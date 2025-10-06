import { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '../../store';
import { rc10rService } from '../../services/rc10r';
import { RC10RPatch } from '../../types/rc10r';
import '../../types/gtag';

interface Shortcut {
  slotIndex: number;
  presetNumber: number;
}

const SHORTCUTS_STORAGE_KEY = 'rc10r-quick-access-shortcuts';

const PatchGrid: React.FC = () => {
  const { connected } = useAppSelector(state => state.rc10r);
  const [pressedPatch, setPressedPatch] = useState<number | null>(null);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [pressedShortcut, setPressedShortcut] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to send button click events to Google Analytics
  const sendButtonClickEvent = useCallback((eventLabel: string, additionalData: Record<string, string | number> = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'button_click', {
        'event_category': 'Interaction',
        'event_label': eventLabel,
        ...additionalData
      });
    }
  }, []);

  // Load shortcuts from localStorage on component mount
  useEffect(() => {
    const loadShortcuts = () => {
      try {
        const stored = localStorage.getItem(SHORTCUTS_STORAGE_KEY);
        if (stored) {
          const parsedShortcuts = JSON.parse(stored) as Shortcut[];
          // Validate the data structure
          const validShortcuts = parsedShortcuts.filter(
            (shortcut): shortcut is Shortcut => 
              typeof shortcut.slotIndex === 'number' && 
              typeof shortcut.presetNumber === 'number' &&
              shortcut.slotIndex >= 0 && 
              shortcut.slotIndex <= 9 &&
              shortcut.presetNumber >= 1 && 
              shortcut.presetNumber <= 99
          );
          setShortcuts(validShortcuts);
        }
      } catch {
        // If localStorage data is corrupted, start fresh
        localStorage.removeItem(SHORTCUTS_STORAGE_KEY);
      }
      setIsInitialized(true);
    };

    loadShortcuts();
  }, []);

  // Save shortcuts to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    
    try {
      localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(shortcuts));
    } catch {
      // Handle localStorage quota exceeded or other errors silently
    }
  }, [shortcuts, isInitialized]);

  const handlePatchClick = async (patchNumber: number, event?: React.MouseEvent) => {
    if (!connected) return;
    
    // Check if shift key is held down
    if (event?.shiftKey) {
      // Add to shortcuts - find next available slot (0-9)
      const occupiedSlots = shortcuts.map(s => s.slotIndex);
      const nextSlotIndex = Array.from({ length: 10 }, (_, i) => i).find(i => !occupiedSlots.includes(i));
      
      if (nextSlotIndex !== undefined) {
        const newShortcut: Shortcut = {
          slotIndex: nextSlotIndex,
          presetNumber: patchNumber
        };
        setShortcuts(prev => [...prev, newShortcut]);
      }
      return;
    }
    
    // Normal click - trigger preset
    await triggerPreset(patchNumber);
  };

  const triggerPreset = useCallback(async (patchNumber: number, isQuickAccess: boolean = false) => {
    // Visual feedback - show pressed state
    setPressedPatch(patchNumber);
    
    // Send Google Analytics event with appropriate label
    const eventLabel = isQuickAccess ? 'Quick Access Button Click' : 'Preset Button Click';
    sendButtonClickEvent(eventLabel, { program: patchNumber });
    
    // Convert to RC10RPatch enum value (0-based for MIDI, but display is 1-based)
    const midiPatchValue = patchNumber - 1; // Convert from 1-based display to 0-based MIDI
    const patchValue = midiPatchValue as RC10RPatch;
    
    await rc10rService.setPatch(patchValue);
    
    // Clear pressed state after a short delay
    setTimeout(() => setPressedPatch(null), 200);
  }, [sendButtonClickEvent]);

  const handleShortcutClick = useCallback(async (shortcut: Shortcut, index: number) => {
    if (!connected) return;
    
    // Visual feedback for shortcut button
    setPressedShortcut(index);
    
    // Trigger the preset with quick access flag
    await triggerPreset(shortcut.presetNumber, true);
    
    // Clear shortcut pressed state
    setTimeout(() => setPressedShortcut(null), 200);
  }, [connected, triggerPreset]);

  const removeShortcut = (slotIndexToRemove: number) => {
    setShortcuts(prev => prev.filter(shortcut => shortcut.slotIndex !== slotIndexToRemove));
  };

  // Keyboard event handler for number keys 0-9
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle if no input/textarea is focused and we have shortcuts
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA' ||
          shortcuts.length === 0) {
        return;
      }

      const key = event.key;
      
      // Map keyboard keys to slot indices: 1-9 maps to slots 0-8, 0 maps to slot 9
      let slotIndex = -1;
      if (key >= '1' && key <= '9') {
        slotIndex = parseInt(key) - 1; // Keys 1-9 map to slots 0-8
      } else if (key === '0') {
        slotIndex = 9; // Key 0 maps to slot 9 (10th position)
      }
      
      if (slotIndex >= 0 && slotIndex < shortcuts.length) {
        const shortcut = shortcuts.find(s => s.slotIndex === slotIndex);
        if (shortcut) {
          event.preventDefault();
          handleShortcutClick(shortcut, slotIndex);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts, connected, handleShortcutClick]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Presets</h2>
      
      {/* Fluid Preset Buttons - All 99 Presets */}
      <div className="flex flex-wrap gap-1 justify-center">
        {Array.from({ length: 99 }, (_, index) => {
          const patchNumber = index + 1; // 1-based display (1-99)
          const isPressed = pressedPatch === patchNumber;
          
          return (
            <button
              key={index}
              onClick={(event) => handlePatchClick(patchNumber, event)}
              disabled={!connected}
              className={`border rounded flex items-center justify-center font-bold text-[10px] transition-all duration-150 h-5 px-0.5 min-w-[30px] ${
                isPressed
                  ? 'bg-gradient-to-br from-green-400 to-green-500 border-green-600 text-white shadow-inner'
                  : connected
                  ? 'bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 border-gray-400 hover:border-gray-500 text-gray-800 hover:shadow-md active:shadow-inner active:from-gray-400 active:to-gray-500'
                  : 'bg-gradient-to-br from-gray-100 to-gray-150 border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
              style={{
                textShadow: connected && !isPressed ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
              }}
              title={`Preset ${patchNumber}`}
            >
              {patchNumber}
            </button>
          );
        })}
      </div>

      {/* Shortcuts Section */}
      {shortcuts.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Quick Access (Keys 1-9, 0)</h3>
            <button
              onClick={() => {
                sendButtonClickEvent('Clear All Shortcuts', { shortcuts_cleared: shortcuts.length });
                setShortcuts([]);
              }}
              className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
              title="Clear all shortcuts"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-5 lg:grid-cols-10 gap-2">
            {Array.from({ length: 10 }, (_, index) => {
              const shortcut = shortcuts.find(s => s.slotIndex === index);
              const isPressed = pressedShortcut === index;
              // Convert slot index to display key: slots 0-8 show keys 1-9, slot 9 shows key 0
              const displayKey = index === 9 ? '0' : (index + 1).toString();
              
              return (
                <div key={index} className="relative">
                  {shortcut ? (
                    <div className="relative group">
                      <button
                        onClick={() => handleShortcutClick(shortcut, index)}
                        disabled={!connected}
                        className={`w-full h-12 border-2 rounded-lg flex flex-col items-center justify-center font-bold text-sm transition-all duration-150 ${
                          isPressed
                            ? 'bg-gradient-to-br from-blue-400 to-blue-500 border-blue-600 text-white shadow-inner'
                            : connected
                            ? 'bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 border-blue-400 hover:border-blue-500 text-blue-800 hover:shadow-md active:shadow-inner'
                            : 'bg-gradient-to-br from-gray-100 to-gray-150 border-gray-300 text-gray-400 cursor-not-allowed'
                        }`}
                        title={`Key ${displayKey}: Preset ${shortcut.presetNumber}`}
                      >
                        <span className="text-xs">{displayKey}</span>
                        <span>{shortcut.presetNumber}</span>
                      </button>
                      <button
                        onClick={() => removeShortcut(shortcut.slotIndex)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove shortcut"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-12 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 text-xs">
                      <span>{displayKey}</span>
                      <span>Empty</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Shift+click preset buttons to add shortcuts • Press keys 1-9, 0 to trigger
          </p>
        </div>
      )}

      {shortcuts.length === 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 text-center">
            <span className="font-medium">Tip:</span> Shift+click any preset button to add it as a keyboard shortcut
          </p>
        </div>
      )}
      
      {!connected && (
        <p className="text-sm text-gray-500 mt-3 text-center">
          Connect RC-10r to use preset controls
        </p>
      )}
    </div>
  );
};

export default PatchGrid;