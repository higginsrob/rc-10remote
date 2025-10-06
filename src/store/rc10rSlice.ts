import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RC10RDeviceState, createDefaultRC10RState, RC10RTrackState, RC10RRhythmKit, RC10RPatch } from '../types/rc10r';

export interface RC10RState extends RC10RDeviceState {
  isLoading: boolean;
  lastError: string | null;
  lastCommand: string | null;
  commandInProgress: boolean;
}

const initialState: RC10RState = {
  ...createDefaultRC10RState(),
  isLoading: false,
  lastError: null,
  lastCommand: null,
  commandInProgress: false,
};

const rc10rSlice = createSlice({
  name: 'rc10r',
  initialState,
  reducers: {
    updateDeviceState: (state, action: PayloadAction<RC10RDeviceState>) => {
      const { connected, deviceName, manufacturer, track1, track2, rhythm, syncMode, beatClock } = action.payload;
      
      state.connected = connected;
      state.deviceName = deviceName;
      state.manufacturer = manufacturer;
      state.track1 = track1;
      state.track2 = track2;
      state.rhythm = rhythm;
      state.syncMode = syncMode;
      state.beatClock = beatClock;
    },
    
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
      if (!action.payload) {
        // Reset device-specific info when disconnected
        state.deviceName = undefined;
        state.manufacturer = undefined;
      }
    },
    
    setDeviceInfo: (state, action: PayloadAction<{ name?: string; manufacturer?: string }>) => {
      state.deviceName = action.payload.name;
      state.manufacturer = action.payload.manufacturer;
    },
    
    // Track 1 actions
    setTrack1State: (state, action: PayloadAction<RC10RTrackState>) => {
      state.track1.state = action.payload;
    },
    
    setTrack1HasContent: (state, action: PayloadAction<boolean>) => {
      state.track1.hasContent = action.payload;
    },
    
    // Track 2 actions
    setTrack2State: (state, action: PayloadAction<RC10RTrackState>) => {
      state.track2.state = action.payload;
    },
    
    setTrack2HasContent: (state, action: PayloadAction<boolean>) => {
      state.track2.hasContent = action.payload;
    },
    
    // Rhythm actions
    setRhythmPlaying: (state, action: PayloadAction<boolean>) => {
      state.rhythm.playing = action.payload;
    },
    
    setRhythmKit: (state, action: PayloadAction<RC10RRhythmKit>) => {
      state.rhythm.kit = action.payload;
    },
    
    setPatch: (state, action: PayloadAction<RC10RPatch>) => {
      state.patch.current = action.payload;
    },
    
    setRhythmTempo: (state, action: PayloadAction<number>) => {
      state.rhythm.tempo = Math.min(200, Math.max(40, action.payload));
    },
    
    // Command state management
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setCommandInProgress: (state, action: PayloadAction<boolean>) => {
      state.commandInProgress = action.payload;
    },
    
    setLastCommand: (state, action: PayloadAction<string | null>) => {
      state.lastCommand = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.lastError = action.payload;
    },
    
    clearError: (state) => {
      state.lastError = null;
    },
    
    // Stop all tracks
    stopAllTracks: (state) => {
      state.track1.state = RC10RTrackState.STOPPED;
      state.track2.state = RC10RTrackState.STOPPED;
    },
    
    // Reset to default state
    reset: () => initialState,
  },
});

export const {
  updateDeviceState,
  setConnected,
  setDeviceInfo,
  setTrack1State,
  setTrack1HasContent,
  setTrack2State,
  setTrack2HasContent,
  setRhythmPlaying,
  setRhythmKit,
  setPatch,
  setRhythmTempo,
  setLoading,
  setCommandInProgress,
  setLastCommand,
  setError,
  clearError,
  stopAllTracks,
  reset,
} = rc10rSlice.actions;

export default rc10rSlice.reducer;