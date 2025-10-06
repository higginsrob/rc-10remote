// Web MIDI API TypeScript definitions
export interface MIDIAccess extends EventTarget {
  readonly inputs: MIDIInputMap;
  readonly outputs: MIDIOutputMap;
  readonly sysexEnabled: boolean;
  onstatechange: ((event: MIDIConnectionEvent) => void) | null;
}

export type MIDIInputMap = ReadonlyMap<string, MIDIInput>;
export type MIDIOutputMap = ReadonlyMap<string, MIDIOutput>;

export interface MIDIPort extends EventTarget {
  readonly id: string;
  readonly manufacturer?: string;
  readonly name?: string;
  readonly type: MIDIPortType;
  readonly version?: string;
  readonly state: MIDIPortDeviceState;
  readonly connection: MIDIPortConnectionState;
  onstatechange: ((event: MIDIConnectionEvent) => void) | null;
  open(): Promise<MIDIPort>;
  close(): Promise<MIDIPort>;
}

export interface MIDIInput extends MIDIPort {
  onmidimessage: ((event: MIDIMessageEvent) => void) | null;
}

export interface MIDIOutput extends MIDIPort {
  send(data: Uint8Array, timestamp?: number): void;
}

export interface MIDIMessageEvent extends Event {
  readonly data: Uint8Array;
  readonly receivedTime: number;
}

export interface MIDIConnectionEvent extends Event {
  readonly port: MIDIPort;
}

export type MIDIPortType = 'input' | 'output';
export type MIDIPortDeviceState = 'disconnected' | 'connected';
export type MIDIPortConnectionState = 'open' | 'closed' | 'pending';

// MIDI message types
export interface MIDIMessage {
  type: MIDIMessageType;
  channel: number;
  data: number[];
}

export type MIDIMessageType = 
  | 'noteoff'
  | 'noteon'
  | 'polypressure'
  | 'controlchange'
  | 'programchange'
  | 'channelpressure'
  | 'pitchbend'
  | 'sysex';

// Global MIDI Access
declare global {
  interface Navigator {
    requestMIDIAccess(options?: MIDIOptions): Promise<MIDIAccess>;
  }
}

export interface MIDIOptions {
  sysex?: boolean;
  software?: boolean;
}