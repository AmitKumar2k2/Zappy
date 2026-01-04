import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
}

interface UiState {
    toasts: Toast[];
}

const initialState: UiState = {
    toasts: [],
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
            const id = Date.now().toString();
            state.toasts.push({ id, ...action.payload });
        },
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter((t) => t.id !== action.payload);
        },
    },
});

export const { addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
