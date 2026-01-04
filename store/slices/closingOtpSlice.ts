import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OtpState {
    otp: string;
    expectedOtp: string | null;
    attempts: number;
    verified: boolean;
    isLocked: boolean;
    error: string | null;
}

const initialState: OtpState = {
    otp: '',
    expectedOtp: null,
    attempts: 0,
    verified: false,
    isLocked: false,
    error: null,
};

const closingOtpSlice = createSlice({
    name: 'closingOtp',
    initialState,
    reducers: {
        setClosingOtpInput: (state, action: PayloadAction<string>) => {
            state.otp = action.payload;
            state.error = null;
        },
        setExpectedClosingOtp: (state, action: PayloadAction<string>) => {
            state.expectedOtp = action.payload;
        },
        incrementClosingAttempts: (state) => {
            state.attempts += 1;
            if (state.attempts >= 3) {
                state.isLocked = true;
                state.error = 'Too many attempts. Locked.';
            } else {
                state.error = 'Invalid OTP. Try again.';
            }
        },
        verifyClosingSuccess: (state) => {
            state.verified = true;
            state.error = null;
        },
        resetClosingOtp: () => initialState
    },
});

export const { setClosingOtpInput, setExpectedClosingOtp, incrementClosingAttempts, verifyClosingSuccess, resetClosingOtp } = closingOtpSlice.actions;
export default closingOtpSlice.reducer;
