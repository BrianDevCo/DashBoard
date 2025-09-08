import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserGroup, Role, AccessLog, UserSession, Permission } from '../../types/users';

interface UsersState {
  users: User[];
  groups: UserGroup[];
  roles: Role[];
  accessLogs: AccessLog[];
  sessions: UserSession[];
  currentUser: User | null;
  selectedUser: User | null;
  isCreatingUser: boolean;
  isEditingUser: boolean;
  isCreatingGroup: boolean;
  isEditingGroup: boolean;
  isCreatingRole: boolean;
  isEditingRole: boolean;
  filters: {
    status: string;
    role: string;
    search: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  loading: {
    users: boolean;
    groups: boolean;
    roles: boolean;
    logs: boolean;
  };
}

const initialState: UsersState = {
  users: [],
  groups: [],
  roles: [],
  accessLogs: [],
  sessions: [],
  currentUser: null,
  selectedUser: null,
  isCreatingUser: false,
  isEditingUser: false,
  isCreatingGroup: false,
  isEditingGroup: false,
  isCreatingRole: false,
  isEditingRole: false,
  filters: {
    status: 'all',
    role: 'all',
    search: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  loading: {
    users: false,
    groups: false,
    roles: false,
    logs: false,
  },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Gestión de usuarios
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    
    updateUser: (state, action: PayloadAction<{ id: string; user: Partial<User> }>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload.user };
      }
    },
    
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    
    updateUserStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const user = state.users.find(u => u.id === action.payload.id);
      if (user) {
        user.status = action.payload.status as any;
      }
    },
    
    updateUserPermissions: (state, action: PayloadAction<{ id: string; permissions: Permission[] }>) => {
      const user = state.users.find(u => u.id === action.payload.id);
      if (user) {
        user.permissions = action.payload.permissions;
      }
    },
    
    updateUserMeters: (state, action: PayloadAction<{ id: string; meterIds: string[] }>) => {
      const user = state.users.find(u => u.id === action.payload.id);
      if (user) {
        user.meterIds = action.payload.meterIds;
      }
    },
    
    updateUserGroups: (state, action: PayloadAction<{ id: string; groupIds: string[] }>) => {
      const user = state.users.find(u => u.id === action.payload.id);
      if (user) {
        user.groupIds = action.payload.groupIds;
      }
    },
    
    // Gestión de grupos
    setGroups: (state, action: PayloadAction<UserGroup[]>) => {
      state.groups = action.payload;
    },
    
    addGroup: (state, action: PayloadAction<UserGroup>) => {
      state.groups.push(action.payload);
    },
    
    updateGroup: (state, action: PayloadAction<{ id: string; group: Partial<UserGroup> }>) => {
      const index = state.groups.findIndex(group => group.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = { ...state.groups[index], ...action.payload.group };
      }
    },
    
    deleteGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter(group => group.id !== action.payload);
    },
    
    addUserToGroup: (state, action: PayloadAction<{ groupId: string; userId: string }>) => {
      const group = state.groups.find(g => g.id === action.payload.groupId);
      if (group && !group.userIds.includes(action.payload.userId)) {
        group.userIds.push(action.payload.userId);
      }
    },
    
    removeUserFromGroup: (state, action: PayloadAction<{ groupId: string; userId: string }>) => {
      const group = state.groups.find(g => g.id === action.payload.groupId);
      if (group) {
        group.userIds = group.userIds.filter(id => id !== action.payload.userId);
      }
    },
    
    // Gestión de roles
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
    },
    
    addRole: (state, action: PayloadAction<Role>) => {
      state.roles.push(action.payload);
    },
    
    updateRole: (state, action: PayloadAction<{ id: string; role: Partial<Role> }>) => {
      const index = state.roles.findIndex(role => role.id === action.payload.id);
      if (index !== -1) {
        state.roles[index] = { ...state.roles[index], ...action.payload.role };
      }
    },
    
    deleteRole: (state, action: PayloadAction<string>) => {
      state.roles = state.roles.filter(role => role.id !== action.payload);
    },
    
    // Gestión de logs de acceso
    setAccessLogs: (state, action: PayloadAction<AccessLog[]>) => {
      state.accessLogs = action.payload;
    },
    
    addAccessLog: (state, action: PayloadAction<AccessLog>) => {
      state.accessLogs.unshift(action.payload);
    },
    
    // Gestión de sesiones
    setSessions: (state, action: PayloadAction<UserSession[]>) => {
      state.sessions = action.payload;
    },
    
    addSession: (state, action: PayloadAction<UserSession>) => {
      state.sessions.push(action.payload);
    },
    
    updateSession: (state, action: PayloadAction<{ id: string; session: Partial<UserSession> }>) => {
      const index = state.sessions.findIndex(session => session.id === action.payload.id);
      if (index !== -1) {
        state.sessions[index] = { ...state.sessions[index], ...action.payload.session };
      }
    },
    
    removeSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(session => session.id !== action.payload);
    },
    
    // UI State
    setCreatingUser: (state, action: PayloadAction<boolean>) => {
      state.isCreatingUser = action.payload;
    },
    
    setEditingUser: (state, action: PayloadAction<boolean>) => {
      state.isEditingUser = action.payload;
    },
    
    setCreatingGroup: (state, action: PayloadAction<boolean>) => {
      state.isCreatingGroup = action.payload;
    },
    
    setEditingGroup: (state, action: PayloadAction<boolean>) => {
      state.isEditingGroup = action.payload;
    },
    
    setCreatingRole: (state, action: PayloadAction<boolean>) => {
      state.isCreatingRole = action.payload;
    },
    
    setEditingRole: (state, action: PayloadAction<boolean>) => {
      state.isEditingRole = action.payload;
    },
    
    // Filtros y paginación
    setFilters: (state, action: PayloadAction<{
      status?: string;
      role?: string;
      search?: string;
    }>) => {
      if (action.payload.status !== undefined) {
        state.filters.status = action.payload.status;
      }
      if (action.payload.role !== undefined) {
        state.filters.role = action.payload.role;
      }
      if (action.payload.search !== undefined) {
        state.filters.search = action.payload.search;
      }
    },
    
    clearFilters: (state) => {
      state.filters = {
        status: 'all',
        role: 'all',
        search: '',
      };
    },
    
    setPagination: (state, action: PayloadAction<{
      page?: number;
      limit?: number;
      total?: number;
    }>) => {
      if (action.payload.page !== undefined) {
        state.pagination.page = action.payload.page;
      }
      if (action.payload.limit !== undefined) {
        state.pagination.limit = action.payload.limit;
      }
      if (action.payload.total !== undefined) {
        state.pagination.total = action.payload.total;
      }
    },
    
    // Loading states
    setLoading: (state, action: PayloadAction<{
      users?: boolean;
      groups?: boolean;
      roles?: boolean;
      logs?: boolean;
    }>) => {
      if (action.payload.users !== undefined) {
        state.loading.users = action.payload.users;
      }
      if (action.payload.groups !== undefined) {
        state.loading.groups = action.payload.groups;
      }
      if (action.payload.roles !== undefined) {
        state.loading.roles = action.payload.roles;
      }
      if (action.payload.logs !== undefined) {
        state.loading.logs = action.payload.logs;
      }
    },
    
    // Utilidades
    resetUsers: (state) => {
      state.users = [];
      state.groups = [];
      state.roles = [];
      state.accessLogs = [];
      state.sessions = [];
      state.currentUser = null;
      state.selectedUser = null;
      state.isCreatingUser = false;
      state.isEditingUser = false;
      state.isCreatingGroup = false;
      state.isEditingGroup = false;
      state.isCreatingRole = false;
      state.isEditingRole = false;
      state.filters = {
        status: 'all',
        role: 'all',
        search: '',
      };
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
      };
      state.loading = {
        users: false,
        groups: false,
        roles: false,
        logs: false,
      };
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setCurrentUser,
  setSelectedUser,
  updateUserStatus,
  updateUserPermissions,
  updateUserMeters,
  updateUserGroups,
  setGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  addUserToGroup,
  removeUserFromGroup,
  setRoles,
  addRole,
  updateRole,
  deleteRole,
  setAccessLogs,
  addAccessLog,
  setSessions,
  addSession,
  updateSession,
  removeSession,
  setCreatingUser,
  setEditingUser,
  setCreatingGroup,
  setEditingGroup,
  setCreatingRole,
  setEditingRole,
  setFilters,
  clearFilters,
  setPagination,
  setLoading,
  resetUsers,
} = usersSlice.actions;

export default usersSlice.reducer;



