import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MIDIConnectionStatus } from '../services/midi';
import type { MIDIDevice } from '../services/midi';

export interface MidiState {
  status: MIDIConnectionStatus;
  error: string | null;
  devices: MIDIDevice[];
  selectedDeviceId: string | null;
  isInitialized: boolean;
}

const initialState: MidiState = {
  status: 'disconnected',
  error: null,
  devices: [],
  selectedDeviceId: null,
  isInitialized: false,
};

const midiSlice = createSlice({
  name: 'midi',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<{ status: MIDIConnectionStatus; error?: string }>) => {
      state.status = action.payload.status;
      state.error = action.payload.error || null;
    },
    
    setDevices: (state, action: PayloadAction<MIDIDevice[]>) => {
      state.devices = action.payload;
      
      // Clear selected device if it's no longer available
      if (state.selectedDeviceId && 
          !action.payload.some(device => device.id === state.selectedDeviceId)) {
        state.selectedDeviceId = null;
      }
    },
    
    selectDevice: (state, action: PayloadAction<string | null>) => {
      state.selectedDeviceId = action.payload;
    },
    
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    reset: () => initialState,
  },
});

export const {
  setStatus,
  setDevices,
  selectDevice,
  setInitialized,
  clearError,
  reset,
} = midiSlice.actions;

export default midiSlice.reducer;