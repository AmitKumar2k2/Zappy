import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    vendorId: string | null;
    token: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    vendorId: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ vendorId: string; token: string }>) => {
            state.isAuthenticated = true;
            state.vendorId = action.payload.vendorId;
            state.token = action.payload.token;
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth', JSON.stringify(action.payload));
            }
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.vendorId = null;
            state.token = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth');
            }
        },
        hydrateAuth: (state, action: PayloadAction<{ vendorId: string; token: string }>) => {
            state.isAuthenticated = true;
            state.vendorId = action.payload.vendorId;
            state.token = action.payload.token;
        }
    },
});

export const { login, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
