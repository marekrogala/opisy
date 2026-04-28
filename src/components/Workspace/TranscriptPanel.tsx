import { forwardRef } from 'react';

interface TranscriptPanelProps {
  isRecording: boolean;
}

export const TranscriptPanel = forwardRef<HTMLDivElement, TranscriptPanelProps>(
  function TranscriptPanel({ isRecording }, ref) {
    return (
      <div className="transcript-panel">
        <div className="tp-header">
          <span className="tp-title">Transkrypcja</span>
          <div className={`tp-live${isRecording ? ' live' : ''}`} id="liveDot" />
        </div>

        <div className="transcript" id="transcript" ref={ref}>
          <div className="transcript__empty">
            Tu pojawią się słowa, które dyktuje radiolog…
          </div>
        </div>

        <div className="tp-interim" id="tpInterim" />
      </div>
    );
  }
);
