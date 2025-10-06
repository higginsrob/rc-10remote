// Boss RC-10r Rhythm Loop Station MIDI Implementation

// Device identification
export const RC10R_DEVICE_NAME = 'RC-10R';

// MIDI Channel (default)
export const RC10R_MIDI_CHANNEL = 1; // Channel 1 (0-indexed)

// Control Change (CC) Numbers for RC-10r (Your device's actual CC mapping)
export const RC10RControlChange = {
  // Based on your Boss RC-10r actual CC mapping
  RHYTHM_START: 1,         // CC1 - Rhythm Start
  RHYTHM_DIVISION: 2,      // CC2 - Rhythm Division  
  RHYTHM_FILL: 3,          // CC3 - Rhythm Fill
  RHYTHM_STOP: 4,          // CC4 - Rhythm Stop
  RESERVED1: 5,            // CC5 - Reserved
  LOOP_START: 7,           // CC7 - Loop Start
  LOOP_STOP: 8,            // CC8 - Loop Stop  
  LOOP_UNDO_REDO: 9,       // CC9 - Loop Undo/Redo
  TRACK1_REC_PLAY: 10,     // CC10 - Track 1 Record/Play (Start)
  TRACK1_STOP: 11,         // CC11 - Track 1 Stop
  TRACK1_UNDO_REDO: 12,    // CC12 - Track 1 Undo/Redo
  TRACK2_REC_PLAY: 13,     // CC13 - Track 2 Record/Play (Start)  
  TRACK2_STOP: 14,         // CC14 - Track 2 Stop
  TRACK2_UNDO_REDO: 15,    // CC15 - Track 2 Undo/Redo
  SYNC_MODE: 18,           // CC18 - Sync Mode
  ALL_STOP: 19,            // CC19 - All Stop
} as const;

export type RC10RControlChange = typeof RC10RControlChange[keyof typeof RC10RControlChange];

// Program Change Numbers (Memory Patches)
export const RC10RPatch = {
  PATCH_1: 0,
  PATCH_2: 1,
  PATCH_3: 2,
  PATCH_4: 3,
  PATCH_5: 4,
  PATCH_6: 5,
  PATCH_7: 6,
  PATCH_8: 7,
  PATCH_9: 8,
  PATCH_10: 9,
  PATCH_11: 10,
  PATCH_12: 11,
  PATCH_13: 12,
  PATCH_14: 13,
  PATCH_15: 14,
  PATCH_16: 15,
  PATCH_17: 16,
  PATCH_18: 17,
  PATCH_19: 18,
  PATCH_20: 19,
  PATCH_21: 20,
  PATCH_22: 21,
  PATCH_23: 22,
  PATCH_24: 23,
  PATCH_25: 24,
  PATCH_26: 25,
  PATCH_27: 26,
  PATCH_28: 27,
  PATCH_29: 28,
  PATCH_30: 29,
  PATCH_31: 30,
  PATCH_32: 31,
  PATCH_33: 32,
  PATCH_34: 33,
  PATCH_35: 34,
  PATCH_36: 35,
  PATCH_37: 36,
  PATCH_38: 37,
  PATCH_39: 38,
  PATCH_40: 39,
  PATCH_41: 40,
  PATCH_42: 41,
  PATCH_43: 42,
  PATCH_44: 43,
  PATCH_45: 44,
  PATCH_46: 45,
  PATCH_47: 46,
  PATCH_48: 47,
  PATCH_49: 48,
  PATCH_50: 49,
  PATCH_51: 50,
  PATCH_52: 51,
  PATCH_53: 52,
  PATCH_54: 53,
  PATCH_55: 54,
  PATCH_56: 55,
  PATCH_57: 56,
  PATCH_58: 57,
  PATCH_59: 58,
  PATCH_60: 59,
  PATCH_61: 60,
  PATCH_62: 61,
  PATCH_63: 62,
  PATCH_64: 63,
  PATCH_65: 64,
  PATCH_66: 65,
  PATCH_67: 66,
  PATCH_68: 67,
  PATCH_69: 68,
  PATCH_70: 69,
  PATCH_71: 70,
  PATCH_72: 71,
  PATCH_73: 72,
  PATCH_74: 73,
  PATCH_75: 74,
  PATCH_76: 75,
  PATCH_77: 76,
  PATCH_78: 77,
  PATCH_79: 78,
  PATCH_80: 79,
  PATCH_81: 80,
  PATCH_82: 81,
  PATCH_83: 82,
  PATCH_84: 83,
  PATCH_85: 84,
  PATCH_86: 85,
  PATCH_87: 86,
  PATCH_88: 87,
  PATCH_89: 88,
  PATCH_90: 89,
  PATCH_91: 90,
  PATCH_92: 91,
  PATCH_93: 92,
  PATCH_94: 93,
  PATCH_95: 94,
  PATCH_96: 95,
  PATCH_97: 96,
  PATCH_98: 97,
  PATCH_99: 98
} as const;

export type RC10RPatch = typeof RC10RPatch[keyof typeof RC10RPatch];

// Rhythm Kit Sounds (Note Numbers for MIDI Note messages)
export const RC10RRhythmKit = {
  ROCK1: 36,
  ROCK2: 37,
  ROCK3: 38,
  POP1: 39,
  POP2: 40,
  POP3: 41,
  JAZZ1: 42,
  JAZZ2: 43,
  JAZZ3: 44,
  LATIN1: 45,
  LATIN2: 46,
  LATIN3: 47,
  // Add more kits as needed
} as const;

export type RC10RRhythmKit = typeof RC10RRhythmKit[keyof typeof RC10RRhythmKit];

// MIDI Message Values
export const RC10RMIDIValue = {
  OFF: 0,
  ON: 127,
  MIN_VALUE: 0,
  MAX_VALUE: 127,
} as const;

export type RC10RMIDIValue = typeof RC10RMIDIValue[keyof typeof RC10RMIDIValue];

// Track states
export const RC10RTrackState = {
  STOPPED: 0,
  RECORDING: 1,
  PLAYING: 2,
  OVERDUBBING: 3,
} as const;

export type RC10RTrackState = typeof RC10RTrackState[keyof typeof RC10RTrackState];

// Sync modes
export const RC10RSyncMode = {
  INTERNAL: 0,
  MIDI_CLOCK: 1,
  AUTO: 2,
} as const;

export type RC10RSyncMode = typeof RC10RSyncMode[keyof typeof RC10RSyncMode];

// Device state interface
export interface RC10RDeviceState {
  connected: boolean;
  deviceName?: string;
  manufacturer?: string;
  
  // Track states
  track1: {
    state: RC10RTrackState;
    hasContent: boolean;
  };
  
  track2: {
    state: RC10RTrackState;
    hasContent: boolean;
  };
  
  // Rhythm state
  rhythm: {
    playing: boolean;
    kit: RC10RRhythmKit;
    tempo: number; // BPM or MIDI value
  };
  
  // Patch state
  patch: {
    current: RC10RPatch;
  };
  
  // Global settings
  syncMode: RC10RSyncMode;
  
  // Beat clock state
  beatClock: {
    receiving: boolean;
    isPlaying: boolean;
    currentBeat: number; // 1-4 for quarter notes
    clockCount: number;  // 0-23 for timing clock within quarter note
    lastClockTime: number; // timestamp of last clock message
  };
}

// MIDI Commands for RC-10r
export interface RC10RMIDICommand {
  type: 'cc' | 'pc' | 'sysex';
  channel: number;
  data: number[];
}

// Helper functions for creating MIDI messages
export const createControlChangeMessage = (
  cc: number, 
  value: number, 
  channel: number = RC10R_MIDI_CHANNEL
): Uint8Array => {
  return new Uint8Array([0xB0 + channel - 1, cc, Math.min(127, Math.max(0, value))]);
};

export const createProgramChangeMessage = (
  program: number,
  channel: number = RC10R_MIDI_CHANNEL
): Uint8Array => {
  return new Uint8Array([0xC0 + channel - 1, program]);
};

export const createNoteOnMessage = (
  note: number,
  velocity: number = 127,
  channel: number = RC10R_MIDI_CHANNEL
): Uint8Array => {
  return new Uint8Array([0x90 + channel - 1, note, Math.min(127, Math.max(0, velocity))]);
};

export const createNoteOffMessage = (
  note: number,
  channel: number = RC10R_MIDI_CHANNEL
): Uint8Array => {
  return new Uint8Array([0x80 + channel - 1, note, 0]);
};

// Parse incoming MIDI messages
export const parseRC10RMIDIMessage = (data: Uint8Array): RC10RMIDICommand | null => {
  if (data.length < 2) return null;
  
  const status = data[0];
  const messageType = status & 0xF0;
  const channel = (status & 0x0F) + 1;
  
  switch (messageType) {
    case 0xB0: // Control Change
      return {
        type: 'cc',
        channel,
        data: [data[1], data[2] || 0]
      };
    case 0xC0: // Program Change
      return {
        type: 'pc',
        channel,
        data: [data[1]]
      };
    case 0xF0: // System Exclusive
      return {
        type: 'sysex',
        channel: 0,
        data: Array.from(data)
      };
    default:
      return null;
  }
};

// Default device state
export const createDefaultRC10RState = (): RC10RDeviceState => ({
  connected: false,
  track1: {
    state: RC10RTrackState.STOPPED,
    hasContent: false,
  },
  track2: {
    state: RC10RTrackState.STOPPED,
    hasContent: false,
  },
  rhythm: {
    playing: false,
    kit: RC10RRhythmKit.ROCK1,
    tempo: 120,
  },
  patch: {
    current: RC10RPatch.PATCH_1,
  },
  syncMode: RC10RSyncMode.INTERNAL,
  beatClock: {
    receiving: false,
    isPlaying: false,
    currentBeat: 1,
    clockCount: 0,
    lastClockTime: 0,
  },
});