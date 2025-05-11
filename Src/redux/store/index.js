import { configureStore } from '@reduxjs/toolkit';
import UserReducer from '../UserReducer';

export const store = configureStore({
    reducer: {
        user: UserReducer,
    },
});