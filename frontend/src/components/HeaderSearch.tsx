import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Fade,
} from '@mui/material';
import {
  Search,
  Clear,
  TrendingUp,
  Warning,
  Assessment,
  Settings,
  People,
} from '@mui/icons-material';

interface SearchResult {
  id: string;
  title: string;
  type: 'metric' | 'alert' | 'report' | 'user' | 'setting';
  description: string;
  category: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Consumo Energético Total',
    type: 'metric',
    description: 'Métrica principal de consumo',
    category: 'Energía'
  },
  {
    id: '2',
    title: 'Alertas de Factor de Potencia',
    type: 'alert',
    description: 'Alertas activas del sistema',
    category: 'Alertas'
  },
  {
    id: '3',
    title: 'Reporte Mensual',
    type: 'report',
    description: 'Reporte de eficiencia energética',
    category: 'Reportes'
  },
  {
    id: '4',
    title: 'Configuración de Medidores',
    type: 'setting',
    description: 'Configuración del sistema',
    category: 'Configuración'
  }
];

const HeaderSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      const filtered = mockSearchResults.filter(item =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase()) ||
        item.category.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
      setOpen(true);
    } else {
      setOpen(false);
      setResults([]);
    }
  };

  const handleClear = () => {
    setQuery('');
    setOpen(false);
    setResults([]);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'metric':
        return <TrendingUp sx={{ color: '#4caf50' }} />;
      case 'alert':
        return <Warning sx={{ color: '#ff9800' }} />;
      case 'report':
        return <Assessment sx={{ color: '#2196f3' }} />;
      case 'user':
        return <People sx={{ color: '#9c27b0' }} />;
      case 'setting':
        return <Settings sx={{ color: '#607d8b' }} />;
      default:
        return <Search sx={{ color: '#666' }} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'metric':
        return '#4caf50';
      case 'alert':
        return '#ff9800';
      case 'report':
        return '#2196f3';
      case 'user':
        return '#9c27b0';
      case 'setting':
        return '#607d8b';
      default:
        return '#666';
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar métricas, alertas, reportes..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => query && setOpen(true)}
        onKeyDown={handleKeyDown}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClear}
                edge="end"
                size="small"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1,
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.6)',
              borderWidth: 2,
            },
          },
          '& .MuiInputBase-input': {
            color: 'white',
            fontWeight: 500,
            '&::placeholder': {
              color: 'rgba(255, 255, 255, 0.8)',
              opacity: 1,
              fontWeight: 400,
            },
          },
        }}
      />

      {/* Search Results Dropdown */}
      <Fade in={open && results.length > 0}>
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <List sx={{ p: 1 }}>
            {results.map((result) => (
              <ListItem
                key={result.id}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {getTypeIcon(result.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={500}>
                      {result.title}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {result.description}
                      </Typography>
                      <Chip
                        label={result.category}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          backgroundColor: getTypeColor(result.type),
                          color: 'white',
                        }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Fade>
    </Box>
  );
};

export default HeaderSearch;
