import { configureStore } from '@reduxjs/toolkit';
import midiReducer from './midiSlice';
import rc10rReducer from './rc10rSlice';

export const store = configureStore({
  reducer: {
    midi: midiReducer,
    rc10r: rc10rReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore MIDI device objects in actions as they contain non-serializable data
        ignoredActions: ['midi/setDevices'],
        ignoredActionsPaths: ['payload.devices'],
        ignoredPaths: ['midi.devices'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
import { useDispatch, useSelector } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T => 
  useSelector(selector);