import { useAppSelector } from '../../store';
import { rc10rService } from '../../services/rc10r';
import '../../types/gtag';

const TrackControls = () => {
  const { connected } = useAppSelector(state => state.rc10r);

  // Send Google Analytics event for track control button clicks
  const sendTrackControlEvent = (action: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'button_click', {
        'event_category': 'Interaction',
        'event_label': 'Track Controls Button Click',
        'action': action
      });
    }
  };

  const handleTrack1UndoRedo = async () => {
    if (!connected) return;
    sendTrackControlEvent('Track 1 Undo/Redo');
    await rc10rService.undoRedoTrack1();
  };

  const handleTrack2UndoRedo = async () => {
    if (!connected) return;
    sendTrackControlEvent('Track 2 Undo/Redo');
    await rc10rService.undoRedoTrack2();
  };

  const handleLoopStart = async () => {
    if (!connected) return;
    sendTrackControlEvent('Loop Start');
    await rc10rService.loopStart();
  };

  const handleLoopStop = async () => {
    if (!connected) return;
    sendTrackControlEvent('Loop Stop');
    await rc10rService.loopStop();
  };

  const handleLoopUndoRedo = async () => {
    if (!connected) return;
    sendTrackControlEvent('Loop Undo/Redo');
    await rc10rService.loopUndoRedo();
  };

  const handleLoopBreak = async () => {
    if (!connected) return;
    sendTrackControlEvent('ALL Break');
    await rc10rService.loopBreak();
  };

  return (
    <div className="control-panel">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Track Controls</h2>
      
      {/* Loop Controls */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Loop Controls</h3>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            onClick={handleLoopStart}
            disabled={!connected}
            className="btn-primary"
          >
            Loop Start
          </button>
          
          <button
            onClick={handleLoopStop}
            disabled={!connected}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Loop Stop
          </button>
          
          <button
            onClick={handleLoopUndoRedo}
            disabled={!connected}
            className="btn-warning"
          >
            Loop Undo/Redo
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleTrack1UndoRedo}
            disabled={!connected}
            className="btn-warning"
          >
            Track 1 Undo/Redo
          </button>
          
          <button
            onClick={handleTrack2UndoRedo}
            disabled={!connected}
            className="btn-warning"
          >
            Track 2 Undo/Redo
          </button>
        </div>
      </div>

      {/* Global Controls */}
      <div className="border-t pt-4">
        <div className="mb-3">
          <button
            onClick={handleLoopBreak}
            disabled={!connected}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            ALL Break
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackControls;