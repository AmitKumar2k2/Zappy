import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CheckInState {
    photo: string | null; // Storing as base64 string for simplicity
    latitude: number | null;
    longitude: number | null;
    timestamp: string | null;
    status: 'idle' | 'loading' | 'success' | 'error';
    error: string | null;
}

const initialState: CheckInState = {
    photo: null,
    latitude: null,
    longitude: null,
    timestamp: null,
    status: 'idle',
    error: null,
};

const checkInSlice = createSlice({
    name: 'checkIn',
    initialState,
    reducers: {
        startCheckIn: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        setCheckInData: (state, action: PayloadAction<{ photo: string; lat: number; lng: number; timestamp: string }>) => {
            state.photo = action.payload.photo;
            state.latitude = action.payload.lat;
            state.longitude = action.payload.lng;
            state.timestamp = action.payload.timestamp;
            state.status = 'success';
        },
        setCheckInError: (state, action: PayloadAction<string>) => {
            state.status = 'error';
            state.error = action.payload;
            state.photo = null;
        },
        resetCheckIn: () => initialState
    },
});

export const { startCheckIn, setCheckInData, setCheckInError, resetCheckIn } = checkInSlice.actions;
export default checkInSlice.reducer;
