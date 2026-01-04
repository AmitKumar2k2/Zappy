import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import checkInReducer from './slices/checkInSlice';
import startOtpReducer from './slices/startOtpSlice';
import setupReducer from './slices/setupSlice';
import closingOtpReducer from './slices/closingOtpSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        event: eventReducer,
        checkIn: checkInReducer,
        startOtp: startOtpReducer,
        setup: setupReducer,
        closingOtp: closingOtpReducer,
        ui: uiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
