import { useState } from 'react';
import { useAppSelector } from '../../store';
import '../../types/gtag';

const SoundModule = () => {
  const { devices } = useAppSelector(state => state.midi);
  const [selectedSoundDevice, setSelectedSoundDevice] = useState(() => {
    const saved = localStorage.getItem('sound-module-device');
    return saved || '';
  });
  const [soundChannel, setSoundChannel] = useState(() => {
    const saved = localStorage.getItem('sound-module-channel');
    return saved ? parseInt(saved) : 10;
  });
  const [showDeviceList, setShowDeviceList] = useState(false);

  // Helper function to send sound module button click events to Google Analytics
  const sendSoundModuleEvent = (eventLabel: string, event_type: string = 'button_click') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event_type, {
        'event_category': 'Interaction',
        'event_label': eventLabel
      });
    }
  };

  // Filter devices that have MIDI input capability (for receiving our drum sounds)
  const soundDevices = devices.filter(device => device.input);

  // Handle device selection
  const handleDeviceSelect = (deviceId: string, deviceName: string) => {
    setSelectedSoundDevice(deviceId);
    localStorage.setItem('sound-module-device', deviceId);
    localStorage.setItem('sound-module-device-name', deviceName);
    // TODO: Update services to use the selected sound device
  };

  // Handle channel change
  const handleChannelChange = (newChannel: number) => {
    sendSoundModuleEvent('Update Sound Module MIDI Channel', 'select');
    setSoundChannel(newChannel);
    localStorage.setItem('sound-module-channel', newChannel.toString());
    // TODO: Update beat sequencer and drum sound services to use new channel
  };

  // Get selected device info
  const selectedDevice = soundDevices.find(device => device.id === selectedSoundDevice);
  const selectedDeviceName = selectedDevice?.name || localStorage.getItem('sound-module-device-name') || 'None';

  return (
    <div className="control-panel">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Sound Module</h2>
      
      {/* Current Selection Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`status-indicator ${selectedDevice ? 'status-connected' : 'status-disconnected'}`}></div>
          <div>
            <p className="font-medium text-gray-900">
              {selectedDevice ? `Connected to ${selectedDeviceName}` : 'No device selected'}
            </p>
            {selectedDevice?.manufacturer && (
              <p className="text-sm text-gray-600">Manufacturer: {selectedDevice.manufacturer}</p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {selectedDevice && (
            <button
              onClick={() => {
                sendSoundModuleEvent('Test Sound Module Midi');
                // Send a test note to the sound module
                const deviceId = selectedSoundDevice;
                const channel = soundChannel;
                if (deviceId) {
                  // Send a simple drum note (kick drum on note 36) to test
                  const noteOnMessage = new Uint8Array([
                    0x90 | (channel - 1), // Note On command + channel (0-based)
                    36, // MIDI note number (kick drum)
                    127 // Velocity
                  ]);
                  const noteOffMessage = new Uint8Array([
                    0x80 | (channel - 1), // Note Off command + channel (0-based)  
                    36, // MIDI note number
                    0 // Velocity
                  ]);
                  
                  // Import midiService dynamically to avoid circular imports
                  import('../../services/midi').then(({ midiService }) => {
                    midiService.sendMessage(deviceId, noteOnMessage);
                    setTimeout(() => midiService.sendMessage(deviceId, noteOffMessage), 100);
                  });
                }
              }}
              className="btn-secondary text-sm"
            >
              Test MIDI
            </button>
          )}
        </div>
      </div>

      {/* Device Selection */}
      {soundDevices.length > 0 ? (
        <div className="mt-4">
          <button
            onClick={() => {
              const newState = !showDeviceList;
              sendSoundModuleEvent(
                newState ? 'Expand Available Sound Module Devices' : 'Collapse Available Sound Module Devices'
              );
              setShowDeviceList(newState);
            }}
            className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-2 hover:text-gray-600 transition-colors"
          >
            <span>Available MIDI Devices:</span>
            <svg
              className={`w-4 h-4 transition-transform ${showDeviceList ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showDeviceList && (
            <div className="space-y-2">
              {/* Sound Module Channel Selection */}
              <div className="mb-4">
                <label htmlFor="sound-channel" className="block text-sm font-medium text-gray-700 mb-2">
                  Sound Module MIDI Channel
                </label>
                <select
                  id="sound-channel"
                  value={soundChannel}
                  onChange={(e) => handleChannelChange(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 16 }, (_, i) => i + 1).map(channel => (
                    <option key={channel} value={channel}>
                      Channel {channel}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  MIDI channel for drum sounds and beat sequencer notes
                </p>
              </div>

              <p className="text-sm text-blue-600 mb-2">
                Select a MIDI device to receive drum sounds and beat sequencer notes:
              </p>
              {soundDevices.map(device => {
                const isSelected = selectedSoundDevice === device.id;
                return (
                  <button
                    key={device.id}
                    onClick={() => {
                      sendSoundModuleEvent('Select Sound Module Device');
                      handleDeviceSelect(device.id, device.name);
                    }}
                    className={`w-full text-left flex items-center justify-between p-3 rounded border transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 cursor-default' 
                        : 'bg-white hover:bg-gray-50 hover:border-gray-300 cursor-pointer border-gray-200'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{device.name}</p>
                      {device.manufacturer && (
                        <p className="text-sm text-gray-600">{device.manufacturer}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        MIDI Input
                      </span>
                      {isSelected ? (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                          ✓ Selected
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          Click to select
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700 text-sm">
            No MIDI input devices found. Connect a sound module, synthesizer, or other MIDI device to receive drum sounds.
          </p>
        </div>
      )}

    </div>
  );
};

export default SoundModule;