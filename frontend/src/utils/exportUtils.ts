// Utilidades para exportación e impresión de datos

import { ExportData, ExportSettings, ExportFormat, ExportColumn } from '../types/export';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export class ExportService {
  /**
   * Exporta datos a CSV
   */
  static exportToCSV(data: ExportData, settings: ExportSettings): string {
    const { columns, data: rows } = data;
    const visibleColumns = columns.filter(col => col.visible);
    
    let csv = '';
    
    // Headers
    if (settings.includeHeaders) {
      csv += visibleColumns.map(col => this.escapeCSV(col.label)).join(',') + '\n';
    }
    
    // Data rows
    rows.forEach(row => {
      const csvRow = visibleColumns.map(col => {
        const value = row[col.key];
        return this.formatValue(value, col, settings);
      });
      csv += csvRow.join(',') + '\n';
    });
    
    // Metadata
    if (settings.includeMetadata) {
      csv += '\n';
      csv += `# Metadatos\n`;
      csv += `# Generado: ${data.metadata.generatedAt}\n`;
      csv += `# Generado por: ${data.metadata.generatedBy}\n`;
      csv += `# Período: ${data.metadata.period.start} - ${data.metadata.period.end}\n`;
    }
    
    return csv;
  }

  /**
   * Exporta datos a Excel
   */
  static exportToExcel(data: ExportData, settings: ExportSettings): ArrayBuffer {
    const { columns, data: rows } = data;
    const visibleColumns = columns.filter(col => col.visible);
    
    // Crear workbook
    const wb = XLSX.utils.book_new();
    
    // Preparar datos
    const excelData = rows.map(row => {
      const excelRow: any = {};
      visibleColumns.forEach(col => {
        excelRow[col.label] = this.formatValue(row[col.key], col, settings);
      });
      return excelRow;
    });
    
    // Crear worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Configurar anchos de columna
    const colWidths = visibleColumns.map(col => ({
      wch: col.width || 15
    }));
    ws['!cols'] = colWidths;
    
    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    
    // Agregar metadata si está habilitada
    if (settings.includeMetadata) {
      const metadataWs = XLSX.utils.aoa_to_sheet([
        ['Metadatos'],
        ['Generado', data.metadata.generatedAt],
        ['Generado por', data.metadata.generatedBy],
        ['Período inicio', data.metadata.period.start],
        ['Período fin', data.metadata.period.end],
        ['Total registros', rows.length],
      ]);
      XLSX.utils.book_append_sheet(wb, metadataWs, 'Metadatos');
    }
    
    // Convertir a ArrayBuffer
    return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  }

  /**
   * Exporta datos a PDF
   */
  static exportToPDF(data: ExportData, settings: ExportSettings): Blob {
    const doc = new jsPDF();
    const { columns, data: rows } = data;
    const visibleColumns = columns.filter(col => col.visible);
    
    // Título
    doc.setFontSize(16);
    doc.text(data.title, 20, 20);
    
    // Descripción
    if (data.description) {
      doc.setFontSize(10);
      doc.text(data.description, 20, 30);
    }
    
    // Metadatos
    if (settings.includeMetadata) {
      doc.setFontSize(8);
      doc.text(`Generado: ${data.metadata.generatedAt}`, 20, 40);
      doc.text(`Período: ${data.metadata.period.start} - ${data.metadata.period.end}`, 20, 45);
    }
    
    // Preparar datos para la tabla
    const tableData = rows.map(row => 
      visibleColumns.map(col => this.formatValue(row[col.key], col, settings))
    );
    
    const tableHeaders = visibleColumns.map(col => col.label);
    
    // Crear tabla
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 50,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
    
    // Resumen si está habilitado
    if (settings.includeSummary && data.summary) {
      const finalY = (doc as any).lastAutoTable.finalY || 50;
      doc.setFontSize(10);
      doc.text('Resumen', 20, finalY + 20);
      
      doc.setFontSize(8);
      doc.text(`Total de registros: ${data.summary.totalRecords}`, 20, finalY + 30);
      if (data.summary.totalValue) {
        doc.text(`Valor total: ${data.summary.totalValue}`, 20, finalY + 35);
      }
      if (data.summary.averageValue) {
        doc.text(`Valor promedio: ${data.summary.averageValue}`, 20, finalY + 40);
      }
    }
    
    return doc.output('blob');
  }

  /**
   * Exporta datos a JSON
   */
  static exportToJSON(data: ExportData, settings: ExportSettings): string {
    const exportData = {
      title: data.title,
      description: data.description,
      data: data.data,
      columns: data.columns,
      metadata: settings.includeMetadata ? data.metadata : undefined,
      summary: settings.includeSummary ? data.summary : undefined,
      exportSettings: settings,
      exportedAt: new Date().toISOString(),
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Formatea un valor según su tipo y configuración
   */
  private static formatValue(value: any, column: ExportColumn, settings: ExportSettings): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    switch (column.type) {
      case 'number':
        return this.formatNumber(value, settings.decimalSeparator);
      case 'date':
        return this.formatDate(value, settings.dateFormat);
      case 'currency':
        return this.formatCurrency(value, settings.decimalSeparator);
      case 'boolean':
        return value ? 'Sí' : 'No';
      default:
        return String(value);
    }
  }

  /**
   * Formatea un número con el separador decimal correcto
   */
  private static formatNumber(value: number, decimalSeparator: string): string {
    const formatted = value.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    if (decimalSeparator === ',') {
      return formatted;
    } else {
      return formatted.replace(',', '.');
    }
  }

  /**
   * Formatea una fecha según el formato especificado
   */
  private static formatDate(value: string | Date, format: string): string {
    const date = new Date(value);
    
    if (isNaN(date.getTime())) {
      return String(value);
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD-MM-YYYY':
        return `${day}-${month}-${year}`;
      default:
        return date.toLocaleDateString('es-ES');
    }
  }

  /**
   * Formatea una moneda
   */
  private static formatCurrency(value: number, decimalSeparator: string): string {
    const formatted = value.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    if (decimalSeparator === ',') {
      return formatted;
    } else {
      return formatted.replace(',', '.');
    }
  }

  /**
   * Escapa un valor para CSV
   */
  private static escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Descarga un archivo
   */
  static downloadFile(content: string | ArrayBuffer | Blob, filename: string, mimeType: string): void {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Genera un nombre de archivo único
   */
  static generateFilename(title: string, format: ExportFormat): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    return `${sanitizedTitle}_${timestamp}.${format}`;
  }
}

export class PrintService {
  /**
   * Imprime una tabla
   */
  static printTable(data: ExportData, settings: any): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const { columns, data: rows } = data;
    const visibleColumns = columns.filter(col => col.visible);
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .metadata { margin-top: 30px; font-size: 12px; color: #666; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${data.title}</h1>
          ${data.description ? `<p>${data.description}</p>` : ''}
          
          <table>
            <thead>
              <tr>
                ${visibleColumns.map(col => `<th>${col.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  ${visibleColumns.map(col => `<td>${row[col.key] || ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="metadata">
            <p>Generado: ${data.metadata.generatedAt}</p>
            <p>Período: ${data.metadata.period.start} - ${data.metadata.period.end}</p>
            <p>Total registros: ${rows.length}</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  }

  /**
   * Imprime un gráfico
   */
  static printChart(chartElement: HTMLElement, title: string): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const canvas = chartElement.querySelector('canvas');
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { margin: 20px; text-align: center; }
            h1 { color: #333; margin-bottom: 20px; }
            img { max-width: 100%; height: auto; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <img src="${dataURL}" alt="${title}" />
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

