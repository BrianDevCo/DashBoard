import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { energyApi } from '../services/energyApi';
import { alertsApi } from '../services/alertsApi';
import { usersApi } from '../services/usersApi';
import { kpisApi } from '../services/kpisApi';
import { comparativeApi } from '../services/comparativeApi';
import { reportsApi } from '../services/reportsApi';
import { executiveApi } from '../services/executiveApi';
import { searchApi } from '../services/searchApi';
import { userConfigApi } from '../services/userConfigApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import dashboardReducer from './slices/dashboardSlice';
import alertsReducer from './slices/alertsSlice';
import usersReducer from './slices/usersSlice';
import kpisReducer from './slices/kpisSlice';
import comparativeReducer from './slices/comparativeSlice';
import reportsReducer from './slices/reportsSlice';
import executiveReducer from './slices/executiveSlice';
import searchReducer from './slices/searchSlice';
import userConfigReducer from './slices/userConfigSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
    alerts: alertsReducer,
    users: usersReducer,
    kpis: kpisReducer,
    comparative: comparativeReducer,
    reports: reportsReducer,
    executive: executiveReducer,
    search: searchReducer,
    userConfig: userConfigReducer,
    [energyApi.reducerPath]: energyApi.reducer,
    [alertsApi.reducerPath]: alertsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [kpisApi.reducerPath]: kpisApi.reducer,
    [comparativeApi.reducerPath]: comparativeApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [executiveApi.reducerPath]: executiveApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [userConfigApi.reducerPath]: userConfigApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(energyApi.middleware, alertsApi.middleware, usersApi.middleware, kpisApi.middleware, comparativeApi.middleware, reportsApi.middleware, executiveApi.middleware, searchApi.middleware, userConfigApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

