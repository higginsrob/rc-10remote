import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store';

const BeatClockIndicator: React.FC = () => {
  const { beatClock } = useAppSelector(state => state.rc10r);
  const [isBlinking, setIsBlinking] = useState(false);

  // Handle blinking effect on every MIDI timing clock (not just quarter notes)
  useEffect(() => {
    if (beatClock.receiving && beatClock.lastClockTime) {
      // Flash on every timing clock message
      setIsBlinking(true);
      const timeout = setTimeout(() => setIsBlinking(false), 50); // 50ms flash for faster blink
      return () => clearTimeout(timeout);
    }
  }, [beatClock.lastClockTime, beatClock.receiving]);

  // Auto-reset receiving status if no clock messages for 2 seconds
  useEffect(() => {
    if (!beatClock.receiving) return;
    
    const timeout = setTimeout(() => {
      // This would need to be handled by the service
      // For now we'll just rely on the service to manage this
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [beatClock.lastClockTime, beatClock.receiving]);

  const getIndicatorClass = () => {
    if (!beatClock.receiving) {
      return "w-3 h-3 rounded-full bg-gray-400"; // Not receiving
    }
    
    if (!beatClock.isPlaying) {
      return "w-3 h-3 rounded-full bg-gray-600"; // Receiving but not playing
    }
    
    // Determine color based on beat position
    const isBeat1 = beatClock.currentBeat === 1;
    const baseColor = isBeat1 ? "bg-blue-500" : "bg-yellow-500";
    const blinkClass = isBlinking ? "animate-pulse" : "";
    
    return `w-3 h-3 rounded-full ${baseColor} ${blinkClass}`;
  };

  const getTooltipText = () => {
    if (!beatClock.receiving) {
      return "No MIDI beat clock detected";
    }
    
    if (!beatClock.isPlaying) {
      return "MIDI beat clock receiving (stopped)";
    }
    
    return `MIDI beat clock: Beat ${beatClock.currentBeat}/4`;
  };

  return (
    <div className="flex items-center gap-2">
      {/* Desktop Label */}
      <span className="hidden sm:block text-sm font-medium text-gray-700 whitespace-nowrap">
        Clock:
      </span>
      
      {/* Beat Clock Indicator */}
      <div
        className={getIndicatorClass()}
        title={getTooltipText()}
        aria-label={getTooltipText()}
      />
      
      {/* Mobile/Small screen info */}
      <span className="sm:hidden text-xs text-gray-600">
        {beatClock.receiving ? (beatClock.isPlaying ? `${beatClock.currentBeat}` : '■') : '○'}
      </span>
    </div>
  );
};

export default BeatClockIndicator;