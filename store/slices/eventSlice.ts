import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EventStatus = 'assigned' | 'in-progress' | 'completed';

interface EventState {
    id: string;
    customerName: string;
    location: string;
    date: string;
    status: EventStatus;
    currentStep: number; // 0: Check-In, 1: OTP Start, 2: Setup, 3: Closing OTP, 4: Done
}

// Mock initial data
const initialState: EventState = {
    id: 'EVT-8821-XG',
    customerName: 'OmniConsumer Products',
    location: 'Sector 7, Industrial Zone',
    date: new Date().toISOString().split('T')[0],
    status: 'assigned',
    currentStep: 0,
};

const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        advanceStep: (state) => {
            if (state.currentStep < 4) {
                state.currentStep += 1;
                state.status = 'in-progress';
            }
            if (state.currentStep === 4) {
                state.status = 'completed';
            }
        },
        setStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload;
        },
        completeEvent: (state) => {
            state.status = 'completed';
            state.currentStep = 4;
        }
    },
});

export const { advanceStep, setStep, completeEvent } = eventSlice.actions;
export default eventSlice.reducer;
