import type { MIDIAccess, MIDIInput, MIDIOutput, MIDIMessageEvent } from '../types/midi';

export type MIDIConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface MIDIDevice {
  id: string;
  name: string;
  manufacturer?: string;
  input?: MIDIInput;
  output?: MIDIOutput;
}

export class MIDIService {
  private midiAccess: MIDIAccess | null = null;
  private connectedDevices: Map<string, MIDIDevice> = new Map();
  private messageListeners: ((message: Uint8Array, deviceId: string) => void)[] = [];
  private statusListeners: ((status: MIDIConnectionStatus, error?: string) => void)[] = [];
  private currentStatus: MIDIConnectionStatus = 'disconnected';

  constructor() {
    this.checkMIDISupport();
  }

  // Check if Web MIDI API is supported
  private checkMIDISupport(): boolean {
    if (!navigator.requestMIDIAccess) {
      this.setStatus('error', 'Web MIDI API not supported in this browser');
      return false;
    }
    return true;
  }

  // Initialize MIDI access
  async initialize(sysex: boolean = true): Promise<boolean> {
    if (!this.checkMIDISupport()) {
      return false;
    }

    try {
      this.setStatus('connecting');
      
      this.midiAccess = await navigator.requestMIDIAccess({ 
        sysex,
        software: false // Prefer hardware devices
      });

      // Listen for device connection changes
      this.midiAccess.onstatechange = this.onMIDIStateChange.bind(this);
      
      // Scan for existing devices
      this.scanDevices();
      
      this.setStatus('connected');
      return true;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown MIDI error';
      this.setStatus('error', `Failed to access MIDI: ${errorMessage}`);
      return false;
    }
  }

  // Scan for available MIDI devices
  private scanDevices(): void {
    if (!this.midiAccess) return;

    // Clear existing devices
    this.connectedDevices.clear();

    // Scan inputs and outputs
    const inputs = Array.from(this.midiAccess.inputs.values());
    const outputs = Array.from(this.midiAccess.outputs.values());

    // Match inputs and outputs by name/manufacturer
    inputs.forEach(input => {
      const matchingOutput = outputs.find(output => 
        output.name === input.name && 
        output.manufacturer === input.manufacturer
      );

      const device: MIDIDevice = {
        id: input.id,
        name: input.name || 'Unknown Device',
        manufacturer: input.manufacturer,
        input,
        output: matchingOutput
      };

      this.connectedDevices.set(device.id, device);
      this.setupInputListener(input);
    });

    // Handle outputs that don't have matching inputs
    outputs.forEach(output => {
      const existingDevice = this.connectedDevices.get(output.id);
      if (!existingDevice) {
        const device: MIDIDevice = {
          id: output.id,
          name: output.name || 'Unknown Device',
          manufacturer: output.manufacturer,
          output
        };
        this.connectedDevices.set(device.id, device);
      }
    });
  }

  // Setup MIDI input listener
  private setupInputListener(input: MIDIInput): void {
    input.onmidimessage = (event: MIDIMessageEvent) => {
      this.messageListeners.forEach(listener => {
        listener(event.data, input.id);
      });
    };
  }

    // Handle MIDI state changes
  private onMIDIStateChange(): void {
    this.scanDevices();
  }

  // Send MIDI message to a specific device
  async sendMessage(deviceId: string, data: Uint8Array, timestamp?: number): Promise<boolean> {
    const device = this.connectedDevices.get(deviceId);
    
    if (!device?.output) {
      return false;
    }

    try {
      if (device.output.state === 'disconnected') {
        await device.output.open();
      }
      
      device.output.send(data, timestamp);
      return true;
      
    } catch {
      return false;
    }
  }

  // Send MIDI message to all connected devices
  async broadcastMessage(data: Uint8Array, timestamp?: number): Promise<boolean[]> {
    const results: boolean[] = [];
    
    for (const device of this.connectedDevices.values()) {
      if (device.output) {
        const success = await this.sendMessage(device.id, data, timestamp);
        results.push(success);
      }
    }
    
    return results;
  }

  // Get list of available devices
  getDevices(): MIDIDevice[] {
    return Array.from(this.connectedDevices.values());
  }

  // Get specific device by ID
  getDevice(id: string): MIDIDevice | undefined {
    return this.connectedDevices.get(id);
  }

  // Find devices by name pattern (useful for finding RC-10r)
  findDevicesByName(namePattern: string | RegExp): MIDIDevice[] {
    const devices = this.getDevices();
    
    if (typeof namePattern === 'string') {
      return devices.filter(device => 
        device.name.toLowerCase().includes(namePattern.toLowerCase())
      );
    } else {
      return devices.filter(device => namePattern.test(device.name));
    }
  }

  // Add message listener
  addMessageListener(listener: (message: Uint8Array, deviceId: string) => void): void {
    this.messageListeners.push(listener);
  }

  // Remove message listener
  removeMessageListener(listener: (message: Uint8Array, deviceId: string) => void): void {
    const index = this.messageListeners.indexOf(listener);
    if (index > -1) {
      this.messageListeners.splice(index, 1);
    }
  }

  // Add status listener
  addStatusListener(listener: (status: MIDIConnectionStatus, error?: string) => void): void {
    this.statusListeners.push(listener);
    // Immediately notify of current status
    listener(this.currentStatus);
  }

  // Remove status listener
  removeStatusListener(listener: (status: MIDIConnectionStatus, error?: string) => void): void {
    const index = this.statusListeners.indexOf(listener);
    if (index > -1) {
      this.statusListeners.splice(index, 1);
    }
  }

  // Set connection status
  private setStatus(status: MIDIConnectionStatus, error?: string): void {
    this.currentStatus = status;
    this.statusListeners.forEach(listener => listener(status, error));
  }

  // Get current status
  getStatus(): MIDIConnectionStatus {
    return this.currentStatus;
  }

  // Cleanup resources
  destroy(): void {
    if (this.midiAccess) {
      this.midiAccess.onstatechange = null;
    }

    this.connectedDevices.forEach(device => {
      if (device.input) {
        device.input.onmidimessage = null;
      }
    });

    this.connectedDevices.clear();
    this.messageListeners.length = 0;
    this.statusListeners.length = 0;
    this.midiAccess = null;
    this.setStatus('disconnected');
  }
}

// Singleton instance
export const midiService = new MIDIService();