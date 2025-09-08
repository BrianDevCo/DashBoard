import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, UserGroup, Role, AccessLog, UserSession, Permission } from '../types/users';

// Configuración de la API de Usuarios
export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Users', 'UserGroups', 'Roles', 'AccessLogs', 'UserSessions'],
  endpoints: (builder) => ({
    // Gestión de usuarios
    getUsers: builder.query<User[], {
      page?: number;
      limit?: number;
      status?: string;
      role?: string;
      search?: string;
    }>({
      query: (params) => ({
        url: 'users',
        params,
      }),
      providesTags: ['Users'],
    }),

    getUser: builder.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    createUser: builder.mutation<User, Omit<User, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (user) => ({
        url: 'users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Users'],
    }),

    updateUser: builder.mutation<User, { id: string; user: Partial<User> }>({
      query: ({ id, user }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    updateUserStatus: builder.mutation<User, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
    }),

    updateUserPermissions: builder.mutation<User, { id: string; permissions: Permission[] }>({
      query: ({ id, permissions }) => ({
        url: `users/${id}/permissions`,
        method: 'PATCH',
        body: { permissions },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
    }),

    updateUserMeters: builder.mutation<User, { id: string; meterIds: string[] }>({
      query: ({ id, meterIds }) => ({
        url: `users/${id}/meters`,
        method: 'PATCH',
        body: { meterIds },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
    }),

    updateUserGroups: builder.mutation<User, { id: string; groupIds: string[] }>({
      query: ({ id, groupIds }) => ({
        url: `users/${id}/groups`,
        method: 'PATCH',
        body: { groupIds },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
    }),

    resetUserPassword: builder.mutation<{ success: boolean; message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `users/${id}/reset-password`,
        method: 'POST',
      }),
    }),

    // Gestión de grupos
    getUserGroups: builder.query<UserGroup[], void>({
      query: () => 'users/groups',
      providesTags: ['UserGroups'],
    }),

    getUserGroup: builder.query<UserGroup, string>({
      query: (id) => `users/groups/${id}`,
      providesTags: (result, error, id) => [{ type: 'UserGroups', id }],
    }),

    createUserGroup: builder.mutation<UserGroup, Omit<UserGroup, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (group) => ({
        url: 'users/groups',
        method: 'POST',
        body: group,
      }),
      invalidatesTags: ['UserGroups'],
    }),

    updateUserGroup: builder.mutation<UserGroup, { id: string; group: Partial<UserGroup> }>({
      query: ({ id, group }) => ({
        url: `users/groups/${id}`,
        method: 'PUT',
        body: group,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'UserGroups', id }],
    }),

    deleteUserGroup: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/groups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserGroups'],
    }),

    addUserToGroup: builder.mutation<UserGroup, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `users/groups/${groupId}/users`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (result, error, { groupId }) => [{ type: 'UserGroups', id: groupId }],
    }),

    removeUserFromGroup: builder.mutation<UserGroup, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `users/groups/${groupId}/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { groupId }) => [{ type: 'UserGroups', id: groupId }],
    }),

    // Gestión de roles
    getRoles: builder.query<Role[], void>({
      query: () => 'users/roles',
      providesTags: ['Roles'],
    }),

    getRole: builder.query<Role, string>({
      query: (id) => `users/roles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Roles', id }],
    }),

    createRole: builder.mutation<Role, Omit<Role, 'id' | 'createdAt' | 'updatedAt'> & { isSystem?: boolean }>({
      query: (role) => ({
        url: 'users/roles',
        method: 'POST',
        body: role,
      }),
      invalidatesTags: ['Roles'],
    }),

    updateRole: builder.mutation<Role, { id: string; role: Partial<Role> }>({
      query: ({ id, role }) => ({
        url: `users/roles/${id}`,
        method: 'PUT',
        body: role,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Roles', id }],
    }),

    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `users/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles'],
    }),

    // Gestión de logs de acceso
    getAccessLogs: builder.query<AccessLog[], {
      userId?: string;
      action?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    }>({
      query: (params) => ({
        url: 'users/access-logs',
        params,
      }),
      providesTags: ['AccessLogs'],
    }),

    getAccessLog: builder.query<AccessLog, string>({
      query: (id) => `users/access-logs/${id}`,
      providesTags: (result, error, id) => [{ type: 'AccessLogs', id }],
    }),

    // Gestión de sesiones
    getUserSessions: builder.query<UserSession[], string>({
      query: (userId) => `users/${userId}/sessions`,
      providesTags: ['UserSessions'],
    }),

    getCurrentUserSessions: builder.query<UserSession[], void>({
      query: () => 'users/sessions',
      providesTags: ['UserSessions'],
    }),

    terminateSession: builder.mutation<void, string>({
      query: (sessionId) => ({
        url: `users/sessions/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserSessions'],
    }),

    terminateAllSessions: builder.mutation<void, string>({
      query: (userId) => ({
        url: `users/${userId}/sessions`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserSessions'],
    }),

    // Estadísticas de usuarios
    getUserStats: builder.query<{
      total: number;
      active: number;
      inactive: number;
      suspended: number;
      byRole: Record<string, number>;
      recentLogins: Array<{ date: string; count: number }>;
      topUsers: Array<{ userId: string; username: string; loginCount: number }>;
    }, {
      startDate?: string;
      endDate?: string;
      groupBy?: 'hour' | 'day' | 'week' | 'month';
    }>({
      query: (params) => ({
        url: 'users/stats',
        params,
      }),
      providesTags: ['Users'],
    }),

    // Verificación de permisos
    checkPermission: builder.query<{ hasPermission: boolean }, { permission: Permission; resourceId?: string }>({
      query: ({ permission, resourceId }) => ({
        url: 'users/check-permission',
        params: { permission, resourceId },
      }),
    }),

    // Cambio de contraseña
    changePassword: builder.mutation<{ success: boolean; message: string }, {
      currentPassword: string;
      newPassword: string;
    }>({
      query: (passwords) => ({
        url: 'users/change-password',
        method: 'POST',
        body: passwords,
      }),
    }),

    // Actualización de perfil
    updateProfile: builder.mutation<User, Partial<User['profile']>>({
      query: (profile) => ({
        url: 'users/profile',
        method: 'PATCH',
        body: profile,
      }),
      invalidatesTags: ['Users'],
    }),

    // Actualización de preferencias
    updatePreferences: builder.mutation<User, Partial<User['preferences']>>({
      query: (preferences) => ({
        url: 'users/preferences',
        method: 'PATCH',
        body: preferences,
      }),
      invalidatesTags: ['Users'],
    }),

    // Exportación de datos de usuarios
    exportUsers: builder.mutation<Blob, {
      format: 'csv' | 'excel' | 'pdf';
      filters?: {
        status?: string;
        role?: string;
        search?: string;
      };
    }>({
      query: ({ format, filters }) => ({
        url: 'users/export',
        method: 'POST',
        body: { format, filters },
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Importación de usuarios
    importUsers: builder.mutation<{
      success: boolean;
      imported: number;
      errors: Array<{ row: number; error: string }>;
    }, FormData>({
      query: (formData) => ({
        url: 'users/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useUpdateUserPermissionsMutation,
  useUpdateUserMetersMutation,
  useUpdateUserGroupsMutation,
  useResetUserPasswordMutation,
  useGetUserGroupsQuery,
  useGetUserGroupQuery,
  useCreateUserGroupMutation,
  useUpdateUserGroupMutation,
  useDeleteUserGroupMutation,
  useAddUserToGroupMutation,
  useRemoveUserFromGroupMutation,
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetAccessLogsQuery,
  useGetAccessLogQuery,
  useGetUserSessionsQuery,
  useGetCurrentUserSessionsQuery,
  useTerminateSessionMutation,
  useTerminateAllSessionsMutation,
  useGetUserStatsQuery,
  useCheckPermissionQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useUpdatePreferencesMutation,
  useExportUsersMutation,
  useImportUsersMutation,
} = usersApi;



