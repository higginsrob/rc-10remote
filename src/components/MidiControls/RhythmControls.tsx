import { useState } from 'react';
import { useAppSelector } from '../../store';
import { rc10rService } from '../../services/rc10r';
import { midiService } from '../../services/midi';
import { drumSoundMap, getDrumSoundName } from '../../data/drumSounds';
import '../../types/gtag';
import '../../types/gtag';

interface RhythmControlsProps {
  selectedKit: number;
  setSelectedKit: (kit: number) => void;
}

const RhythmControls: React.FC<RhythmControlsProps> = ({ selectedKit, setSelectedKit }) => {
  const { connected } = useAppSelector(state => state.rc10r);
  const [partActive, setPartActive] = useState(false);
  const [drumSoundsExpanded, setDrumSoundsExpanded] = useState(false);

  // RC-10r Kit Sound Patches (Program Change numbers)
  const kitOptions = [
    { pc: 1, label: "Studio Kit" },
    { pc: 2, label: "Live" },
    { pc: 3, label: "Light" },
    { pc: 4, label: "Heavy" },
    { pc: 5, label: "Rock" },
    { pc: 6, label: "Metal" },
    { pc: 7, label: "Jazz" },
    { pc: 8, label: "Brushes" },
    { pc: 9, label: "Cajon" },
    { pc: 10, label: "Drum&Bs" },
    { pc: 11, label: "R&B" },
    { pc: 12, label: "Dance" },
    { pc: 13, label: "Techno" },
    { pc: 14, label: "Dance Beats" },
    { pc: 15, label: "Hiphop" },
    { pc: 16, label: "808 + 909" }
  ];

    // Helper function to send rhythm control events to Google Analytics
  const sendRhythmControlEvent = (action: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'button_click', {
        'event_category': 'Interaction',
        'event_label': 'Rhythm Controls Button Click',
        'action': action
      });
    }
  };

  // Helper function to send rhythm kit selection events to Google Analytics
  const sendKitSelectionEvent = (kitName: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'select', {
        'event_category': 'Interaction',
        'event_label': 'Select Rhythm Kit',
        'kit': kitName
      });
    }
  };

  const handleStartRhythm = async () => {
    if (!connected) return;
    sendRhythmControlEvent('Start');
    await rc10rService.startRhythm();
  };

  const handleRhythmDivision = async () => {
    if (!connected) return;
    sendRhythmControlEvent('Part');
    setPartActive(!partActive);
    await rc10rService.rhythmDivision();
  };

  const handleRhythmFill = async () => {
    if (!connected) return;
    sendRhythmControlEvent('Fill');
    await rc10rService.rhythmFill();
  };

  const handleRhythmBreak = async () => {
    if (!connected) return;
    sendRhythmControlEvent('Rhythm Break');
    await rc10rService.rhythmBreak();
  };

  const handleKitChange = async (kitPc: number) => {
    if (!connected) return;
    setSelectedKit(kitPc);
    
    // Send analytics event for kit selection
    const selectedKitOption = kitOptions.find(kit => kit.pc === kitPc);
    if (selectedKitOption) {
      sendKitSelectionEvent(selectedKitOption.label);
    }
    
    // Send Program Change message to the selected sound module device/channel or RC-10r as fallback
    const deviceId = localStorage.getItem('sound-module-device') || '';
    const channel = parseInt(localStorage.getItem('sound-module-channel') || '10');
    
    if (deviceId) {
      // Send to Sound Module device
      try {
        const programChangeMessage = new Uint8Array([
          0xC0 | (channel - 1), // Program Change command + channel (0-based)
          kitPc - 1 // Program Change value (0-based, so subtract 1)
        ]);
        
        await midiService.sendMessage(deviceId, programChangeMessage);
      } catch {
        // Fallback to RC-10r
        await rc10rService.setRhythmKit(kitPc);
      }
    } else {
      // Fallback to RC-10r if no sound module device selected
      await rc10rService.setRhythmKit(kitPc);
    }
  };

  const handleStopRhythm = async () => {
    if (!connected) return;
    sendRhythmControlEvent('Stop');
    await rc10rService.stopRhythm();
  };

  // Send drum sound to selected sound module device
  const playDrumSoundToSoundModule = async (note: number, velocity: number = 127) => {
    const deviceId = localStorage.getItem('sound-module-device') || '';
    const channel = parseInt(localStorage.getItem('sound-module-channel') || '10');
    
    if (!deviceId) {
      // Fallback to RC-10r if no sound module device selected
      await rc10rService.playDrumSound(note);
      return;
    }

    try {
      // Create Note On message
      const noteOnMessage = new Uint8Array([
        0x90 | (channel - 1), // Note On command + channel (0-based)
        note,
        velocity
      ]);

      // Send Note On
      await midiService.sendMessage(deviceId, noteOnMessage);

      // Send Note Off after short delay
      setTimeout(async () => {
        const noteOffMessage = new Uint8Array([
          0x80 | (channel - 1), // Note Off command + channel (0-based)
          note,
          0
        ]);
        await midiService.sendMessage(deviceId, noteOffMessage);
      }, 100);

    } catch {
      // Fallback to RC-10r on error
      await rc10rService.playDrumSound(note);
    }
  };

  const handleDrumSound = async (note: number) => {
    if (!connected) return;
    
    // Track drum sound button click with sound name
    const drumSoundName = getDrumSoundName(note, selectedKit);
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'button_click', {
        'event_category': 'Interaction',
        'event_label': 'Drum Sound Button Click',
        'drum_sound': drumSoundName,
        'midi_note': note.toString(),
        'kit': selectedKit.toString()
      });
    }
    
    await playDrumSoundToSoundModule(note);
  };

  return (
    <div className="control-panel">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Rhythm Controls</h2>
      
      {/* Rhythm Control Buttons */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <button
          onClick={handleStartRhythm}
          disabled={!connected}
          className="btn-success py-3 px-4 rounded font-bold transition-colors"
        >
          Start
        </button>
        <button
          onClick={handleStopRhythm}
          disabled={!connected}
          className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded font-bold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Stop
        </button>
        <button
          onClick={handleRhythmDivision}
          disabled={!connected}
          className={`py-3 px-4 rounded font-bold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
            partActive 
              ? 'bg-yellow-700 hover:bg-yellow-800 text-yellow-100' 
              : 'bg-blue-700 hover:bg-blue-800 text-blue-100'
          }`}
        >
          Part
        </button>
        <button
          onClick={handleRhythmFill}
          disabled={!connected}
          className="btn-secondary py-3 px-4 rounded font-bold transition-colors"
        >
          Fill
        </button>
      </div>

      {/* Kit Selection */}
      <div className="mb-6">
        <label htmlFor="kit-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Rhythm Kit
        </label>
        <select
          id="kit-select"
          value={selectedKit}
          onChange={(e) => handleKitChange(Number(e.target.value))}
          disabled={!connected}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-boss-red focus:border-boss-red disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {kitOptions.map(option => (
            <option key={option.pc} value={option.pc}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Drum Sound Buttons */}
      <div>
        <button
          onClick={() => setDrumSoundsExpanded(!drumSoundsExpanded)}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-2 p-2 hover:bg-gray-50 rounded transition-colors"
        >
          <span>Drum Sounds ({Object.keys(drumSoundMap).length} sounds)</span>
          <svg
            className={`w-4 h-4 transition-transform ${drumSoundsExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {drumSoundsExpanded && (
          <div className="grid grid-cols-4 gap-px mt-4">
            {/* Generate buttons for all drum sounds (MIDI notes 25-88) */}
            {Object.keys(drumSoundMap)
              .map(Number)
              .sort((a, b) => a - b)
              .map((note) => (
                <button
                  key={note}
                  onClick={() => handleDrumSound(note)}
                  disabled={!connected}
                  className="py-1 px-1.5 bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {getDrumSoundName(note, selectedKit)}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Global Controls */}
      <div className="border-t pt-4 mt-6">
        <div className="mb-3">
          <button
            onClick={handleRhythmBreak}
            disabled={!connected}
            className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Rhythm Break
          </button>
        </div>
      </div>

      {!connected && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700 text-sm">
            Connect your RC-10r to control rhythm patterns
          </p>
        </div>
      )}
    </div>
  );
};

export default RhythmControls;