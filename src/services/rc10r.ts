import { midiService, type MIDIDevice } from './midi';
import {
  type RC10RDeviceState,
  RC10RControlChange,
  RC10RTrackState,
  RC10RPatch,
  type RC10RMIDICommand
} from '../types/rc10r';
import {
  createControlChangeMessage,
  createProgramChangeMessage,
  createNoteOnMessage,
  createNoteOffMessage,
  parseRC10RMIDIMessage,
  createDefaultRC10RState,
  RC10R_DEVICE_NAME
} from '../types/rc10r';

const RC10R_DEVICE_STORAGE_KEY = 'rc10r-preferred-device';

interface StoredDeviceInfo {
  id: string;
  name: string;
  manufacturer?: string;
}

export class RC10RService {
  private deviceState: RC10RDeviceState;
  private connectedDevice: MIDIDevice | null = null;
  private stateListeners: ((state: RC10RDeviceState) => void)[] = [];
  private beatClockTimeoutId: NodeJS.Timeout | null = null;

  constructor() {
    this.deviceState = createDefaultRC10RState();
    // Don't setup MIDI listeners here - do it in initialize() after MIDI service is ready
  }

  // Helper method to safely update device state
  private updateState(updates: Partial<RC10RDeviceState>): void {
    this.deviceState = {
      ...this.deviceState,
      ...updates,
    };
  }

  // Helper method to update track state
  private updateTrackState(trackNumber: 1 | 2, updates: Partial<RC10RDeviceState['track1']>): void {
    const trackKey = trackNumber === 1 ? 'track1' : 'track2';
    this.deviceState = {
      ...this.deviceState,
      [trackKey]: {
        ...this.deviceState[trackKey],
        ...updates,
      },
    };
  }

  // Helper method to update rhythm state  
  private updateRhythmState(updates: Partial<RC10RDeviceState['rhythm']>): void {
    this.deviceState = {
      ...this.deviceState,
      rhythm: {
        ...this.deviceState.rhythm,
        ...updates,
      },
    };
  }

  // Setup MIDI message listeners
  private setupMIDIListeners(): void {
    midiService.addMessageListener(this.handleMIDIMessage.bind(this));
    midiService.addStatusListener(this.handleMIDIStatusChange.bind(this));
  }

  // Handle incoming MIDI messages from RC-10r
  private handleMIDIMessage(message: Uint8Array, deviceId: string): void {
    
    // Handle beat clock messages from ANY RC-10r device (they can come from different ports)
    if (message.length > 0 && [0xF8, 0xFA, 0xFB, 0xFC].includes(message[0])) {
      // Get device name from MIDI service to check if it's an RC-10r
      const allDevices = midiService.getDevices();
      const sendingDevice = allDevices.find((d: { id: string; name?: string }) => d.id === deviceId);
      
      if (sendingDevice && (sendingDevice.name?.includes('RC-10') || sendingDevice.name?.includes('BOSS'))) {
        if (this.handleBeatClockMessage(message)) {
          return; // Beat clock handled, don't process further
        }
      }
    }

    // Only process non-beat-clock messages from our connected RC-10r device
    if (!this.connectedDevice || this.connectedDevice.id !== deviceId) {
      return;
    }

    // Handle beat clock messages first
    if (this.handleBeatClockMessage(message)) {
      return; // Beat clock message handled, don't process further
    }

    const parsedMessage = parseRC10RMIDIMessage(message);
    if (!parsedMessage) return;

    this.updateStateFromMIDI(parsedMessage);
  }

  // Handle MIDI beat clock messages (0xF8, 0xFA, 0xFB, 0xFC)
  private handleBeatClockMessage(message: Uint8Array): boolean {
    if (message.length === 0) return false;
    
    const status = message[0];
    const now = Date.now();
    
    switch (status) {
      case 0xF8: { // Timing Clock (24 times per quarter note)
        const newClockCount = (this.deviceState.beatClock.clockCount + 1) % 24;
        const newCurrentBeat = newClockCount === 0 
          ? (this.deviceState.beatClock.currentBeat % 4) + 1 
          : this.deviceState.beatClock.currentBeat;
        
        this.updateBeatClockState({
          receiving: true,
          lastClockTime: now,
          clockCount: newClockCount,
          currentBeat: newCurrentBeat
        });
        return true;
      }
        
      case 0xFA: // Start
        this.updateBeatClockState({
          receiving: true,
          isPlaying: true,
          currentBeat: 1,
          clockCount: 0,
          lastClockTime: now
        });
        return true;
        
      case 0xFB: // Continue
        this.updateBeatClockState({
          receiving: true,
          isPlaying: true,
          lastClockTime: now
        });
        return true;
        
      case 0xFC: // Stop
        this.updateBeatClockState({
          receiving: true,
          isPlaying: false,
          lastClockTime: now
        });
        return true;
        
      default:
        return false; // Not a beat clock message
    }
  }

  // Helper method to update beat clock state
  private updateBeatClockState(updates: Partial<RC10RDeviceState['beatClock']>): void {
    this.deviceState = {
      ...this.deviceState,
      beatClock: {
        ...this.deviceState.beatClock,
        ...updates,
      },
    };
    
    this.notifyStateListeners();
    
    // Set/reset timeout to clear receiving status if no clock messages for 2 seconds
    if (this.beatClockTimeoutId) {
      clearTimeout(this.beatClockTimeoutId);
    }
    
    if (updates.receiving !== false) {
      this.beatClockTimeoutId = setTimeout(() => {
        this.updateBeatClockState({ 
          receiving: false, 
          isPlaying: false 
        });
        this.beatClockTimeoutId = null;
      }, 2000);
    }
  }

  // Handle MIDI connection status changes
  private handleMIDIStatusChange(status: string): void {
    if (status === 'connected') {
      // Add a small delay to ensure devices are fully enumerated
      setTimeout(() => {
        this.scanForRC10R();
      }, 100);
    } else if (status === 'disconnected') {
      this.disconnect();
    }
  }

  // Save preferred device to localStorage
  private savePreferredDevice(device: MIDIDevice): void {
    try {
      const deviceInfo: StoredDeviceInfo = {
        id: device.id,
        name: device.name,
        manufacturer: device.manufacturer
      };
      localStorage.setItem(RC10R_DEVICE_STORAGE_KEY, JSON.stringify(deviceInfo));
    } catch {
      // Handle localStorage errors silently
    }
  }

  // Load preferred device from localStorage
  private getPreferredDevice(): StoredDeviceInfo | null {
    try {
      const stored = localStorage.getItem(RC10R_DEVICE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as StoredDeviceInfo;
      }
    } catch {
      // Handle localStorage errors silently
      localStorage.removeItem(RC10R_DEVICE_STORAGE_KEY);
    }
    return null;
  }

  // Find device by stored info
  private findDeviceByStoredInfo(storedInfo: StoredDeviceInfo): MIDIDevice | null {
    const allDevices = midiService.getDevices();
    
    // First try to find by exact ID and name match
    let device = allDevices.find(d => 
      d.id === storedInfo.id && 
      d.name === storedInfo.name
    );
    
    if (device) return device;
    
    // If not found by ID, try to find by name only (in case device was reconnected)
    device = allDevices.find(d => d.name === storedInfo.name);
    
    return device || null;
  }

  // Scan for RC-10r devices
  private scanForRC10R(): void {
    // First, check if we have a stored preferred device
    const preferredDevice = this.getPreferredDevice();
    if (preferredDevice) {
      const foundDevice = this.findDeviceByStoredInfo(preferredDevice);
      if (foundDevice) {
        this.connectToDevice(foundDevice);
        return;
      }
    }

    // If no preferred device found, use automatic detection
    const rc10rDevices = midiService.findDevicesByName(RC10R_DEVICE_NAME);
    
    if (rc10rDevices.length > 0) {
      this.connectToDevice(rc10rDevices[0]);
    } else {
      // Try alternative name patterns
      const alternativeDevices = midiService.findDevicesByName(/rc.?10.?r/i);
      
      if (alternativeDevices.length > 0) {
        this.connectToDevice(alternativeDevices[0]);
      } else {
        // Try BOSS pattern
        const bossDevices = midiService.findDevicesByName(/boss.*rc.*10.*r/i);
        
        if (bossDevices.length > 0) {
          this.connectToDevice(bossDevices[0]);
        }
      }
    }
  }

  // Connect to a specific RC-10r device
  async connectToDevice(device: MIDIDevice, isManualSelection: boolean = false): Promise<boolean> {
    try {
      this.connectedDevice = device;
      this.updateState({ 
        connected: true,
        deviceName: device.name,
        manufacturer: device.manufacturer
      });
      
      // Save device to localStorage if it's a manual selection
      if (isManualSelection) {
        this.savePreferredDevice(device);
      }
      
      // Request current device state
      await this.requestDeviceState();
      
      this.notifyStateListeners();
      return true;
      
    } catch {
      return false;
    }
  }

  // Disconnect from device
  disconnect(): void {
    this.connectedDevice = null;
    this.deviceState = createDefaultRC10RState();
    this.notifyStateListeners();
  }

  // Request current device state (send SysEx inquiry if supported)
  private async requestDeviceState(): Promise<void> {
    // For now, we'll assume default state
    // In a full implementation, you could send SysEx messages to query device state
  }

  // Update state based on incoming MIDI message
  private updateStateFromMIDI(command: RC10RMIDICommand): void {
    if (command.type === 'cc') {
      // CC handling removed - no state updates needed
      this.updateStateFromControlChange();
    } else if (command.type === 'pc') {
      const [program] = command.data;
      // Program changes now update patch, not rhythm pattern
      this.updateState({ patch: { current: program as RC10RPatch } });
    }
    
    this.notifyStateListeners();
  }

  // Update state from Control Change message
  private updateStateFromControlChange(): void {
    // Volume/level controls removed - no control change handling needed
  }

  // Send MIDI command to device (with momentary switch behavior)
  private async sendCommand(message: Uint8Array): Promise<boolean> {
    if (!this.connectedDevice) {
      return false;
    }
    
    // Send the press command (value 127)
    const pressResult = await midiService.sendMessage(this.connectedDevice.id, message);
    
    if (!pressResult) {
      return false;
    }
    
    // Create release command (same CC but value 0)
    const releaseMessage = new Uint8Array(message);
    releaseMessage[2] = 0; // Set value to 0 for release
    
    // Send the release command (value 0)
    const releaseResult = await midiService.sendMessage(this.connectedDevice.id, releaseMessage);
    
    return pressResult && releaseResult;
  }

  // Track control methods
  async startTrack1(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.TRACK1_REC_PLAY, 127);
    const success = await this.sendCommand(message);
    
    if (success) {
      this.updateTrackState(1, { state: RC10RTrackState.RECORDING });
      this.notifyStateListeners();
    }
    
    return success;
  }

  // Keep old name for backward compatibility
  async recordTrack1(): Promise<boolean> {
    return this.startTrack1();
  }

  async playTrack1(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.TRACK1_REC_PLAY, 64);
    const success = await this.sendCommand(message);
    
    if (success) {
      this.updateTrackState(1, { state: RC10RTrackState.PLAYING });
      this.notifyStateListeners();
    }
    
    return success;
  }

  async stopTrack1(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.TRACK1_STOP, 127);
    const success = await this.sendCommand(message);
    
    if (success) {
      this.updateTrackState(1, { state: RC10RTrackState.STOPPED });
      this.notifyStateListeners();
    }
    
    return success;
  }

  async startTrack2(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.TRACK2_REC_PLAY, 127);
    const success = await this.sendCommand(message);
    
    if (success) {
      this.updateTrackState(2, { state: RC10RTrackState.RECORDING });
      this.notifyStateListeners();
    }
    
    return success;
  }

  // Keep old name for backward compatibility
  async recordTrack2(): Promise<boolean> {
    return this.startTrack2();
  }

  async playTrack2(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.TRACK2_REC_PLAY, 64);
    const success = await this.sendCommand(message);
    
    if (success) {
      this.updateTrackState(2, { state: RC10RTrackState.PLAYING });
      this.notifyStateListeners();
    }
    
    return success;
  }

  async stopTrack2(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.TRACK2_STOP, 127);
    const success = await this.sendCommand(message);
    
    if (success) {
      this.updateTrackState(2, { state: RC10RTrackState.STOPPED });
      this.notifyStateListeners();
    }
    
    return success;
  }

  // Loop control methods
  async loopStart(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.LOOP_START, 127);
    return await this.sendCommand(message);
  }

  async loopStop(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.LOOP_STOP, 127);
    return await this.sendCommand(message);
  }

  async loopUndoRedo(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.LOOP_UNDO_REDO, 127);
    return await this.sendCommand(message);
  }

  // Track undo/redo methods
  async undoRedoTrack1(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.TRACK1_UNDO_REDO, 127);
    return await this.sendCommand(message);
  }

  async undoRedoTrack2(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.TRACK2_UNDO_REDO, 127);
    return await this.sendCommand(message);
  }

  async stopAllTracks(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.ALL_STOP, 127);
    const success = await this.sendCommand(message);
    
    if (success) {
      this.updateTrackState(1, { state: RC10RTrackState.STOPPED });
      this.updateTrackState(2, { state: RC10RTrackState.STOPPED });
      this.notifyStateListeners();
    }
    
    return success;
  }

  // Rhythm control methods
  async startRhythm(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.RHYTHM_START, 127); // Use default channel 1 for Control Change
    const success = await this.sendCommand(message);
    
    if (success) {
      this.updateRhythmState({ playing: true });
      this.notifyStateListeners();
    }
    
    return success;
  }

  async rhythmDivision(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.RHYTHM_DIVISION, 127); // Use default channel 1 for Control Change
    return await this.sendCommand(message);
  }

  async rhythmFill(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.RHYTHM_FILL, 127); // Use default channel 1 for Control Change
    return await this.sendCommand(message);
  }

  async stopRhythm(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.RHYTHM_STOP, 127); // Use default channel 1 for Control Change
    const success = await this.sendCommand(message);
    
    if (success) {
      this.updateRhythmState({ playing: false });
      this.notifyStateListeners();
    }
    
    return success;
  }

  async loopBreak(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.SYNC_MODE, 127); // CC#18
    return await this.sendCommand(message);
  }

  async rhythmBreak(): Promise<boolean> {
    const message = createControlChangeMessage(RC10RControlChange.RESERVED1, 127); // CC#5
    return await this.sendCommand(message);
  }

  async setPatch(patch: RC10RPatch): Promise<boolean> {
    const message = createProgramChangeMessage(patch);
    const success = await this.sendCommand(message);
    
    if (success) {
      this.updateState({ patch: { current: patch } });
      this.notifyStateListeners();
    }
    
    return success;
  }

  // Set rhythm kit using Program Change message on channel 2
  async setRhythmKit(kitPc: number): Promise<boolean> {
    const message = createProgramChangeMessage(kitPc, 2); // Send on MIDI channel 2
    const success = await this.sendCommand(message);
    
    return success;
  }

  //1Play drum sound using MIDI note
  async playDrumSound(note: number): Promise<boolean> {
    if (!this.connectedDevice) {
      return false;
    }

    try {
      // Send Note On message on channel 2
      const noteOnMessage = createNoteOnMessage(note, 127, 2); // velocity 127, channel 2
      
      const noteOnResult = await midiService.sendMessage(this.connectedDevice.id, noteOnMessage);
      
      if (!noteOnResult) {
        return false;
      }

      // Send Note Off message immediately for momentary trigger
      const noteOffMessage = createNoteOffMessage(note, 2); // Note off message on channel 2
      await midiService.sendMessage(this.connectedDevice?.id || '', noteOffMessage);

      return true;
    } catch {
      return false;
    }
  }



  // Get current device state
  getDeviceState(): RC10RDeviceState {
    return { ...this.deviceState };
  }

  // Check if device is connected
  isConnected(): boolean {
    return this.deviceState.connected && this.connectedDevice !== null;
  }

  // State listener management
  addStateListener(listener: (state: RC10RDeviceState) => void): void {
    this.stateListeners.push(listener);
    // Immediately notify of current state
    listener(this.getDeviceState());
  }

  removeStateListener(listener: (state: RC10RDeviceState) => void): void {
    const index = this.stateListeners.indexOf(listener);
    if (index > -1) {
      this.stateListeners.splice(index, 1);
    }
  }

  private notifyStateListeners(): void {
    const currentState = this.getDeviceState();
    this.stateListeners.forEach(listener => listener(currentState));
  }

  // Initialize the service
  async initialize(): Promise<boolean> {
    const result = await midiService.initialize(true);
    
    // Setup MIDI listeners after MIDI service is initialized
    this.setupMIDIListeners();
    
    // After MIDI service is initialized, check for RC-10r devices
    const currentStatus = midiService.getStatus();
    
    if (currentStatus === 'connected') {
      // Add a small delay to ensure devices are fully enumerated
      setTimeout(() => {
        this.scanForRC10R();
      }, 100);
    }
    
    return result;
  }

  // Cleanup
  destroy(): void {
    this.stateListeners.length = 0;
    if (this.beatClockTimeoutId) {
      clearTimeout(this.beatClockTimeoutId);
      this.beatClockTimeoutId = null;
    }
    this.disconnect();
  }
}

// Singleton instance
export const rc10rService = new RC10RService();