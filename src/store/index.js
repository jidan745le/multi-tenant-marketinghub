import { configureStore } from '@reduxjs/toolkit';
import themesReducer from './slices/themesSlice';

export const store = configureStore({
    reducer: {
        themes: themesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [],
            },
        }),
});

export default store; 