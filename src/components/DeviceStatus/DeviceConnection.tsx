import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { setStatus, setDevices, setInitialized } from '../../store/midiSlice';
import { updateDeviceState } from '../../store/rc10rSlice';
import { midiService, type MIDIDevice } from '../../services/midi';
import { rc10rService } from '../../services/rc10r';
import type { RC10RDeviceState } from '../../types/rc10r';
import '../../types/gtag';

const DeviceConnection = () => {
  const dispatch = useAppDispatch();
  const { status, devices, isInitialized, error } = useAppSelector(state => state.midi);
  const { connected, deviceName, manufacturer } = useAppSelector(state => state.rc10r);

  // Helper function to send device control button click events to Google Analytics
  const sendDeviceControlEvent = (eventLabel: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'button_click', {
        'event_category': 'Interaction',
        'event_label': eventLabel
      });
    }
  };
  const [showDeviceList, setShowDeviceList] = useState(false);
  const [rc10rChannel, setRc10rChannel] = useState(() => {
    const saved = localStorage.getItem('rc10r-midi-channel');
    return saved ? parseInt(saved) : 1;
  });

  // Note: Device list is now hidden by default and only shows when user clicks to expand
  // Removed auto-show logic to keep the interface clean on load

  // Handle manual device selection
  const handleDeviceSelect = async (device: MIDIDevice) => {
    try {
      // Try to connect to the selected device (mark as manual selection)
      await rc10rService.connectToDevice(device, true);
    } catch {
      // Silently handle connection errors
    }
  };

  // Update local state when patch changes from external sources

  useEffect(() => {
    // Setup MIDI service listeners
    const handleStatusChange = (status: string, error?: string) => {
      dispatch(setStatus({ 
        status: status as 'disconnected' | 'connecting' | 'connected' | 'error', 
        error 
      }));
      
      if (status === 'connected') {
        // Update device list when connected
        const deviceList = midiService.getDevices();
        dispatch(setDevices(deviceList));
      }
    };

    const handleRC10RStateChange = (state: RC10RDeviceState) => {
      dispatch(updateDeviceState(state));
    };

    // Add listeners
    midiService.addStatusListener(handleStatusChange);
    rc10rService.addStateListener(handleRC10RStateChange);

    // Initialize if not already done
    if (!isInitialized) {
      rc10rService.initialize().then(() => {
        dispatch(setInitialized(true));
      });
    }

    // Cleanup
    return () => {
      midiService.removeStatusListener(handleStatusChange);
      rc10rService.removeStateListener(handleRC10RStateChange);
    };
  }, [dispatch, isInitialized]);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return connected ? 'status-connected' : 'status-connecting';
      case 'connecting':
        return 'status-connecting';
      case 'error':
        return 'status-disconnected';
      default:
        return 'status-disconnected';
    }
  };

  const getStatusText = () => {
    if (connected && deviceName) {
      return `Connected to ${deviceName}`;
    }
    
    switch (status) {
      case 'connected':
        if (devices.length > 0 && !connected) {
          return 'MIDI Available - RC-10r not detected';
        }
        return 'MIDI Connected';
      case 'connecting':
        return 'Connecting to MIDI...';
      case 'error':
        return error || 'MIDI Error';
      default:
        if (devices.length > 0) {
          return 'MIDI devices found - Select one to connect';
        }
        return 'No MIDI devices detected';
    }
  };  const handleRetryConnection = async () => {
    try {
      await rc10rService.initialize();
    } catch {
      // Silently handle retry errors
    }
  };

  // Handle channel change
  const handleChannelChange = (newChannel: number) => {
    sendDeviceControlEvent('Update Control Device MIDI Channel');
    setRc10rChannel(newChannel);
    localStorage.setItem('rc10r-midi-channel', newChannel.toString());
    // TODO: Update rc10rService to use the new channel
  };

  return (
    <div className="control-panel">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">RC-10r Device Control</h2>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`status-indicator ${getStatusColor()}`}></div>
          <div>
            <p className="font-medium text-gray-900">{getStatusText()}</p>
            {manufacturer && (
              <p className="text-sm text-gray-600">Manufacturer: {manufacturer}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {(status === 'error' || status === 'disconnected') && (
            <button
              onClick={handleRetryConnection}
              className="btn-primary"
            >
              Retry Connection
            </button>
          )}
          
          {connected && (
            <button
              onClick={() => {
                sendDeviceControlEvent('Test Control Device Midi');
                // Send a simple rhythm start command to test connection
                rc10rService.startRhythm();
                setTimeout(() => rc10rService.stopRhythm(), 100);
              }}
              className="btn-secondary text-sm"
            >
              Test MIDI
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {status === 'connected' && !connected && devices.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700 text-sm">
            No RC-10r device found. Please check that your Boss RC-10r is connected via USB and powered on.
          </p>
        </div>
      )}

      {status === 'error' && error?.includes('not supported') && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-blue-800 font-medium mb-2">Browser Compatibility</h4>
          <p className="text-blue-700 text-sm mb-2">
            This application requires a browser with Web MIDI API support:
          </p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Chrome 43+</li>
            <li>• Edge 79+</li>
            <li>• Opera 30+</li>
            <li>• Safari (with experimental features enabled)</li>
          </ul>
        </div>
      )}

      {devices.filter(device => device.input).length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => {
              const newState = !showDeviceList;
              sendDeviceControlEvent(
                newState ? 'Expand Available Control Devices' : 'Collapse Available Control Devices'
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
              {/* RC-10r Channel Selection */}
              <div className="mb-4">
                <label htmlFor="rc10r-channel" className="block text-sm font-medium text-gray-700 mb-2">
                  RC-10r MIDI Channel
                </label>
                <select
                  id="rc10r-channel"
                  value={rc10rChannel}
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
                  MIDI channel for track and rhythm control messages
                </p>
              </div>

              {devices.filter(device => device.input).length > 0 && (
                <p className="text-sm text-blue-600 mb-2">
                  {connected 
                    ? "Click on a different device below to switch connection:"
                    : "RC-10r not found automatically. Click on a device below to connect manually:"
                  }
                </p>
              )}
              {devices.filter(device => device.input).map(device => {
                const isCurrentDevice = connected && deviceName === device.name;
                return (
                  <button
                    key={device.id}
                    onClick={() => {
                      sendDeviceControlEvent('Select Control Device');
                      handleDeviceSelect(device);
                    }}
                    disabled={isCurrentDevice}
                    className={`w-full text-left flex items-center justify-between p-3 rounded border transition-all ${
                      isCurrentDevice
                        ? 'bg-green-50 border-green-300 cursor-default' 
                        : 'bg-white hover:bg-blue-50 hover:border-blue-300 cursor-pointer border-gray-200'
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
                        {device.input && device.output ? 'Input/Output' : 
                         device.input ? 'Input Only' : 'Output Only'}
                      </span>
                      {isCurrentDevice ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                          ✓ Connected
                        </span>
                      ) : connected ? (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Click to switch
                        </span>
                      ) : (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Click to connect
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceConnection;