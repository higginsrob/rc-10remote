import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import App from '../../App';

// Mock the MIDI services
vi.mock('../../services/midi', () => ({
  midiService: {
    getDevices: vi.fn(() => []),
    destroy: vi.fn(),
    addStatusListener: vi.fn(),
    removeStatusListener: vi.fn(),
    sendMessage: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('../../services/rc10r', () => ({
  rc10rService: {
    initialize: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn(),
    addStateListener: vi.fn(),
    removeStateListener: vi.fn(),
    playDrumSound: vi.fn().mockResolvedValue(undefined),
    startRhythm: vi.fn().mockResolvedValue(undefined),
    stopRhythm: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('App Component', () => {
  it('renders the app title', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('Boss RC-10r Remote Control')).toBeInTheDocument();
  });

  it('renders the app description', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/Web-based control interface/)).toBeInTheDocument();
  });
});