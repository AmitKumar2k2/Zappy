import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OtpState {
    email: string;
    step: 'email' | 'otp';
    otp: string;
    expectedOtp: string | null;
    otpExpiry: number | null;
    attempts: number;
    verified: boolean;
    isLocked: boolean;
    error: string | null;
}

const initialState: OtpState = {
    email: '',
    step: 'email',
    otp: '',
    expectedOtp: null,
    otpExpiry: null,
    attempts: 0,
    verified: false,
    isLocked: false,
    error: null,
};

const startOtpSlice = createSlice({
    name: 'startOtp',
    initialState,
    reducers: {
        setEmailInput: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
            state.error = null;
        },
        submitEmail: (state, action: PayloadAction<{ otp: string }>) => {
            if (state.email.includes('@')) {
                state.step = 'otp';
                state.expectedOtp = action.payload.otp;
                state.otpExpiry = Date.now() + 30000;
                state.error = null;
                state.attempts = 0;
            } else {
                state.error = 'Invalid email address';
            }
        },
        resendOtp: (state, action: PayloadAction<{ otp: string }>) => {
            state.expectedOtp = action.payload.otp;
            state.otpExpiry = Date.now() + 30000;
            state.otp = '';
            state.error = null;
        },
        setStartOtpInput: (state, action: PayloadAction<string>) => {
            state.otp = action.payload;
            state.error = null;
        },
        incrementStartAttempts: (state) => {
            state.attempts += 1;
            if (state.attempts >= 3) {
                state.isLocked = true;
                state.error = 'Too many attempts. Locked.';
            } else {
                state.error = 'Invalid OTP. Try again.';
            }
        },
        verifyStartSuccess: (state) => {
            state.verified = true;
            state.error = null;
        },
        resetStartOtp: () => initialState,
        backToEmail: (state) => {
            state.step = 'email';
            state.otp = '';
            state.error = null;
        }
    },
});

export const { setEmailInput, submitEmail, resendOtp, setStartOtpInput, incrementStartAttempts, verifyStartSuccess, resetStartOtp, backToEmail } = startOtpSlice.actions;
export default startOtpSlice.reducer;
