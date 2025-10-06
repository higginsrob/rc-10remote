import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import DeviceConnection from './components/DeviceStatus/DeviceConnection';
import SoundModule from './components/DeviceStatus/SoundModule';
import TrackControls from './components/MidiControls/TrackControls';
import RhythmControls from './components/MidiControls/RhythmControls';
import PatchGrid from './components/MidiControls/PatchGrid';
import { midiService } from './services/midi';
import { rc10rService } from './services/rc10r';
import './types/gtag';

function AppContent() {
  const [selectedKit, setSelectedKit] = useState<number>(1);
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);

  // Helper function to send CTA link click events to Google Analytics
  const sendCTAClickEvent = (name: string, url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'button_click', {
        'event_category': 'CTA',
        'event_label': name,
        'custom_parameter_url': url
      });
    }
  };

  // Helper function to send UI button click events to Google Analytics
  const sendButtonClickEvent = (action: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'button_click', {
        'event_category': 'Interaction',
        'event_label': action
      });
    }
  };

  useEffect(() => {
    // Initialize MIDI services when app loads
    const initializeServices = async () => {
      try {
        await rc10rService.initialize();
      } catch {
        // Silently handle initialization errors
      }
    };

    initializeServices();

    // Cleanup on unmount
    return () => {
      rc10rService.destroy();
      midiService.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center gap-6">
            <img 
              src="./boss-rc-10r-big.jpg" 
              alt="Boss RC-10r Rhythm Loop Station" 
              className="w-20 h-16 sm:w-24 sm:h-20 object-contain rounded-lg shadow-sm"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                Boss RC-10r Remote Control
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Web-based control interface for your Boss RC-10r Rhythm Loop Station
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Top Row - Device Control and Sound Module (Collapsible) */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 transition-all duration-300 ${
          showDeviceSettings ? 'opacity-100 max-h-none' : 'opacity-0 max-h-0 overflow-hidden mb-0'
        }`}>
          {/* RC-10r Device Control */}
          <div>
            <DeviceConnection />
          </div>

          {/* Sound Module */}
          <div>
            <SoundModule />
          </div>
        </div>

        {/* Product Links and Settings */}
        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Product Links */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="https://www.boss.info/global/products/rc-10r/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
                title="Boss Official Product Page"
                onClick={() => sendCTAClickEvent('Boss Website', 'https://www.boss.info/global/products/rc-10r/')}
              >
                Boss Website
              </a>
              <a
                href="https://www.boss.info/global/support/by_product/rc-10r/owners_manuals/?lang=en-JM"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                title="Owner's Manual"
                onClick={() => sendCTAClickEvent('Owners Manual', 'https://www.boss.info/global/support/by_product/rc-10r/owners_manuals/?lang=en-JM')}
              >
                Owners Manual
              </a>
              <a
                href="https://www.boss.info/global/products/rc-10r/downloads/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                title="Downloads & Software"
                onClick={() => sendCTAClickEvent('Boss Downloads', 'https://www.boss.info/global/products/rc-10r/downloads/')}
              >
                Boss Downloads
              </a>
              <a
                href="https://www.sweetwater.com/store/detail/RC10R--boss-rc-10r-rhythm-loop-station-pedal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                title="Buy on Sweetwater"
                onClick={() => sendCTAClickEvent('Sweetwater', 'https://www.sweetwater.com/store/detail/RC10R--boss-rc-10r-rhythm-loop-station-pedal')}
              >
                Sweetwater
              </a>
              <a
                href="https://www.amazon.com/BOSS-Rhythm-Station-Pedal-RC-10R/dp/B07V9HCK1N"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
                title="Buy on Amazon"
                onClick={() => sendCTAClickEvent('Amazon', 'https://www.amazon.com/BOSS-Rhythm-Station-Pedal-RC-10R/dp/B07V9HCK1N')}
              >
                Amazon
              </a>
              <a
                href="https://www.guitarcenter.com/BOSS/RC-10R-Rhythm-Loop-Station-Looper-Effects-Pedal-1500000293250.gc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                title="Buy on Guitar Center"
                onClick={() => sendCTAClickEvent('Guitar Center', 'https://www.guitarcenter.com/BOSS/RC-10R-Rhythm-Loop-Station-Looper-Effects-Pedal-1500000293250.gc')}
              >
                Guitar Center
              </a>
              <a
                href="https://github.com/higginsrob/rc-10remote"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white rounded transition-colors"
                title="View Source Code on GitHub"
                onClick={() => sendCTAClickEvent('GitHub', 'https://github.com/higginsrob/rc-10remote')}
              >
                GitHub
              </a>
            </div>
            
            {/* Expand/Collapse Button */}
            <button
              onClick={() => {
                const newState = !showDeviceSettings;
                sendButtonClickEvent(
                  newState ? 'Expand Device Settings' : 'Collapse Device Settings'
                );
                setShowDeviceSettings(newState);
              }}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
              title={showDeviceSettings ? "Hide Device Settings" : "Show Device Settings"}
            >
              <svg 
                className={`w-6 h-6 transition-transform duration-200 ${showDeviceSettings ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Presets - Full Width */}
        <div className="w-full mb-8">
          <PatchGrid />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Track Controls */}
          <div className="space-y-6">
            <TrackControls />
          </div>

          {/* Rhythm Controls */}
          <div className="space-y-6">
            <RhythmControls 
              selectedKit={selectedKit} 
              setSelectedKit={setSelectedKit}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-gray-500 text-sm text-center">
            RC-10r Remote Control - Open source MIDI controller for Boss RC-10r
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
