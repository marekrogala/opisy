import { useRef, useEffect, useCallback } from 'react';
import type { AppAction, AppState } from '../../types';
import { WorkspaceHeader } from './WorkspaceHeader';
import { TranscriptPanel } from './TranscriptPanel';
import { ReportPanel } from './ReportPanel';
import { BottomBar } from './BottomBar';
import { useDemoRunner } from '../../hooks/useDemoRunner';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface WorkspaceViewProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  onShowToast: (msg: string) => void;
  autoDemo?: boolean;
}

export function WorkspaceView({ state, dispatch, onShowToast, autoDemo = false }: WorkspaceViewProps) {
  const manualStopRef = useRef(false);

  useEffect(() => {
    manualStopRef.current = state.manualStop;
  }, [state.manualStop]);

  const { startDemo } = useDemoRunner(dispatch, manualStopRef);

  const speech = useSpeechRecognition({
    onResult: (text, _isFinal) => {
      // Interim speech text — could dispatch to state if needed
      // For now, store in a local ref so we don't fight React rendering
      const interim = document.getElementById('tpInterim');
      if (interim) interim.textContent = text;
    },
    onError: (msg) => {
      onShowToast(msg);
    },
  });

  const handleMicClick = useCallback(() => {
    if (state.storyRunning) {
      manualStopRef.current = true;
      dispatch({ type: 'SET_STORY_STATE', running: false, done: false, manualStop: true });
      dispatch({ type: 'SET_RECORDING', value: false });
      dispatch({ type: 'SET_MIC_STATUS', text: 'Zatrzymano' });
    } else if (state.isRecording) {
      speech.stop();
      dispatch({ type: 'SET_RECORDING', value: false });
      dispatch({ type: 'SET_MIC_STATUS', text: 'Gotowy' });
    } else {
      if (speech.isSupported) {
        const ok = speech.start();
        if (ok) {
          dispatch({ type: 'SET_RECORDING', value: true });
          dispatch({ type: 'SET_MIC_STATUS', text: 'Nagrywam…' });
        }
      } else {
        onShowToast('Przeglądarka nie obsługuje rozpoznawania mowy');
      }
    }
  }, [state.storyRunning, state.isRecording, speech, dispatch, onShowToast]);

  const handleStartDictation = useCallback(() => {
    startDemo();
  }, [startDemo]);

  // Push-to-talk spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return;
      const ae = document.activeElement;
      if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || (ae as HTMLElement).isContentEditable)) return;
      e.preventDefault();
      if (!state.isRecording && !state.storyRunning) {
        if (speech.isSupported) {
          speech.start();
          dispatch({ type: 'SET_RECORDING', value: true });
          dispatch({ type: 'SET_MIC_STATUS', text: 'Nagrywam…' });
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      const ae = document.activeElement;
      if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || (ae as HTMLElement).isContentEditable)) return;
      e.preventDefault();
      if (state.isRecording && !state.storyRunning) {
        speech.stop();
        dispatch({ type: 'SET_RECORDING', value: false });
        dispatch({ type: 'SET_MIC_STATUS', text: 'Gotowy' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state.isRecording, state.storyRunning, speech, dispatch]);

  // Auto-start demo if opened from existing report
  useEffect(() => {
    if (!autoDemo) return;
    const tid = setTimeout(() => startDemo(), 1500);
    return () => clearTimeout(tid);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showStartButton = !state.storyRunning && !state.storyDone && !autoDemo;

  return (
    <div className="view" id="viewWorkspace">
      <WorkspaceHeader
        dispatch={dispatch}
        saveStatus={state.saveStatus}
        exportsEnabled={state.exportsEnabled}
        patientInfo={state.patientInfo}
        sections={state.sections}
        onShowToast={onShowToast}
      />

      <div className="workspace">
        <TranscriptPanel
          transcriptBlocks={state.transcriptBlocks}
          isRecording={state.isRecording}
        />
        <ReportPanel
          sections={state.sections}
          patientInfo={state.patientInfo}
          dispatch={dispatch}
          showStartButton={showStartButton}
          onStartDictation={handleStartDictation}
        />
      </div>

      <BottomBar
        isRecording={state.isRecording}
        storyRunning={state.storyRunning}
        micStatusText={state.micStatusText}
        onMicClick={handleMicClick}
        showDone={state.storyDone}
      />
    </div>
  );
}
