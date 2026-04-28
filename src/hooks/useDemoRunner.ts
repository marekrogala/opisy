import { useCallback, useRef } from 'react';
import type { AppAction } from '../types';
import { DICTATION_SCRIPT } from '../data/dictationScript';
import { sleep } from '../utils/helpers';

export function useDemoRunner(
  dispatch: React.Dispatch<AppAction>,
  manualStopRef: React.MutableRefObject<boolean>
) {
  const runningRef = useRef(false);

  const streamTranscript = useCallback(async (text: string, perWordMs = 95) => {
    const blockId = crypto.randomUUID();
    dispatch({ type: 'ADD_TRANSCRIPT_BLOCK', id: blockId });

    const words = text.split(/\s+/);
    for (const word of words) {
      if (manualStopRef.current) break;
      dispatch({ type: 'APPEND_TRANSCRIPT_WORD', blockId, word });
      await sleep(perWordMs + Math.random() * 55);
    }

    dispatch({ type: 'FINISH_TRANSCRIPT_BLOCK', blockId });
  }, [dispatch, manualStopRef]);

  const typewriterReplace = useCallback(async (sectionId: string, newText: string, charDelay = 18) => {
    // Start typewriter — old text already visible with strikethrough (via oldText in state)
    dispatch({ type: 'SET_DISPLAYED_TEXT', id: sectionId, text: '' });

    let current = '';
    let lastDispatch = 0;
    for (let i = 0; i < newText.length; i++) {
      if (manualStopRef.current) break;
      current += newText[i];

      const now = performance.now();
      if (now - lastDispatch > 40 || i === newText.length - 1) {
        dispatch({ type: 'SET_DISPLAYED_TEXT', id: sectionId, text: current });
        lastDispatch = now;
      }

      const base = charDelay + (Math.random() * 8) - 4;
      await sleep(' ,.'.includes(newText[i]) ? base * 0.2 : base);
    }
    dispatch({ type: 'SET_DISPLAYED_TEXT', id: sectionId, text: current });
  }, [dispatch, manualStopRef]);

  const runDictationStep = useCallback(async (step: typeof DICTATION_SCRIPT[0]) => {
    // Mark section as active
    dispatch({ type: 'SET_ACTIVE_SECTION', id: step.target });

    // Mic on
    dispatch({ type: 'SET_RECORDING', value: true });
    dispatch({ type: 'SET_MIC_STATUS', text: 'Słucham…' });

    // Stream transcript words
    await streamTranscript(step.transcript, 95);
    await sleep(420);

    // Processing
    dispatch({ type: 'SET_RECORDING', value: false });
    dispatch({ type: 'SET_MIC_STATUS', text: 'Przetwarzam…' });
    await sleep(500);

    // Typewriter the new text
    await typewriterReplace(step.target, step.newText);

    // Lock the section
    dispatch({ type: 'LOCK_SECTION', id: step.target, text: step.newText });

    // Cleanup removed sections — framer-motion AnimatePresence handles the exit animation
    if (step.removeTargets?.length) {
      for (const id of step.removeTargets) {
        dispatch({ type: 'REMOVE_SECTION', id });
      }
    }

    dispatch({ type: 'SET_MIC_STATUS', text: 'Gotowy' });
    dispatch({ type: 'SET_SAVE_STATUS', status: 'saving' });
    setTimeout(() => dispatch({ type: 'SET_SAVE_STATUS', status: 'saved' }), 700);
  }, [dispatch, streamTranscript, typewriterReplace]);

  const startDemo = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;

    dispatch({ type: 'CLEAR_TRANSCRIPT' });
    dispatch({ type: 'SET_STORY_STATE', running: true, done: false });

    for (const step of DICTATION_SCRIPT) {
      if (manualStopRef.current) break;
      await runDictationStep(step);
      await sleep(850);
    }

    const completed = !manualStopRef.current;
    runningRef.current = false;

    dispatch({ type: 'SET_STORY_STATE', running: false, done: completed });
    if (completed) {
      dispatch({ type: 'ENABLE_EXPORTS' });
      dispatch({ type: 'SET_MIC_STATUS', text: 'Opis gotowy' });
    }
  }, [dispatch, manualStopRef, runDictationStep]);

  return { startDemo };
}
