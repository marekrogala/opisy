interface BottomBarProps {
  isRecording: boolean;
  storyRunning: boolean;
  micStatusText: string;
  onMicClick: () => void;
  showDone: boolean;
}

export function BottomBar({ isRecording, storyRunning, micStatusText, onMicClick, showDone }: BottomBarProps) {
  return (
    <div className="bottombar">
      <button
        className={`mic-btn${isRecording ? ' active' : ''}`}
        id="micBtn"
        onClick={onMicClick}
        title={storyRunning ? 'Zatrzymaj' : isRecording ? 'Zatrzymaj nagrywanie' : 'Nagraj'}
      >
        <div className="mic-btn__halo" />
        <div className="mic-btn__core">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </div>
      </button>

      <div className="bottombar__meter">
        <div className="meter-bar">
          <span className={isRecording ? 'active' : ''} />
        </div>
      </div>

      <div className="bottombar__status" id="micStatus">{micStatusText}</div>

      <div className="bottombar__hint">
        <kbd>Space</kbd> push-to-talk
      </div>

      <div className="bottombar__spacer" />

      <div className={`bottombar__done${showDone ? ' visible' : ''}`} id="doneLabel">
        {showDone ? 'Opis gotowy' : ''}
      </div>
    </div>
  );
}
