import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SetupStep {
    photo: string | null;
    notes: string;
    completed: boolean;
}

interface SetupState {
    preSetup: SetupStep;
    postSetup: SetupStep;
}

const initialStep: SetupStep = { photo: null, notes: '', completed: false };

const initialState: SetupState = {
    preSetup: { ...initialStep },
    postSetup: { ...initialStep },
};

const setupSlice = createSlice({
    name: 'setup',
    initialState,
    reducers: {
        updatePreSetup: (state, action: PayloadAction<Partial<SetupStep>>) => {
            state.preSetup = { ...state.preSetup, ...action.payload };
        },
        updatePostSetup: (state, action: PayloadAction<Partial<SetupStep>>) => {
            state.postSetup = { ...state.postSetup, ...action.payload };
        },
        completePreSetup: (state) => {
            state.preSetup.completed = true;
        },
        completePostSetup: (state) => {
            state.postSetup.completed = true;
        }
    },
});

export const { updatePreSetup, updatePostSetup, completePreSetup, completePostSetup } = setupSlice.actions;
export default setupSlice.reducer;
