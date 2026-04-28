import { useCallback, useRef } from 'react';
import type { AppAction, AppState } from '../types';
import { DICTATION_SCRIPT } from '../data/dictationScript';
import { sleep } from '../utils/helpers';

interface DemoRefs {
  transcriptRef: React.RefObject<HTMLDivElement | null>;
  sectionRefs: React.RefObject<Map<string, HTMLParagraphElement>>;
  manualStopRef: React.RefObject<boolean>;
  micLevelRef: React.RefObject<HTMLSpanElement | null>;
}

interface UseDemoRunnerReturn {
  startDemo: () => Promise<void>;
}

export function useDemoRunner(
  dispatch: React.Dispatch<AppAction>,
  state: Pick<AppState, 'storyRunning' | 'storyDone'>,
  refs: DemoRefs
): UseDemoRunnerReturn {
  const micLevelIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptBlockRef = useRef<HTMLDivElement | null>(null);

  const setMic = useCallback((active: boolean, statusText: string) => {
    dispatch({ type: 'SET_RECORDING', value: active });
    dispatch({ type: 'SET_SAVE_STATUS', status: 'idle' });
    // Update mic level via interval
    if (micLevelIntervalRef.current) {
      clearInterval(micLevelIntervalRef.current);
      micLevelIntervalRef.current = null;
    }
    if (active) {
      micLevelIntervalRef.current = setInterval(() => {
        if (refs.micLevelRef.current) {
          refs.micLevelRef.current.style.width = (25 + Math.random() * 72) + '%';
        }
      }, 90);
    } else {
      if (refs.micLevelRef.current) {
        refs.micLevelRef.current.style.width = '0%';
      }
    }
    // Status text is communicated via state — but we store it separately
    // via a custom event so BottomBar can pick it up without extra state
    window.dispatchEvent(new CustomEvent('mic-status', { detail: { statusText, active } }));
  }, [dispatch, refs.micLevelRef]);

  const clearTranscriptEmpty = useCallback(() => {
    const tr = refs.transcriptRef.current;
    if (!tr) return;
    const empty = tr.querySelector('.transcript__empty');
    if (empty) empty.remove();
  }, [refs.transcriptRef]);

  const streamTranscript = useCallback(async (text: string, perWordMs = 95) => {
    clearTranscriptEmpty();
    const tr = refs.transcriptRef.current;
    if (!tr) return;

    if (transcriptBlockRef.current) {
      transcriptBlockRef.current.classList.add('done');
      const br = document.createElement('span');
      br.className = 'transcript__break';
      tr.appendChild(br);
    }

    const block = document.createElement('div');
    block.className = 'transcript__block';
    tr.appendChild(block);
    transcriptBlockRef.current = block;

    for (const w of text.split(/\s+/)) {
      if (refs.manualStopRef.current) break;
      const span = document.createElement('span');
      span.className = 'transcript__word transcript__word--active';
      span.textContent = w;
      block.appendChild(span);
      tr.scrollTop = tr.scrollHeight;
      await sleep(perWordMs + Math.random() * 55);
    }

    block.querySelectorAll('.transcript__word--active').forEach(w => {
      w.classList.remove('transcript__word--active');
      w.classList.add('transcript__word--done');
    });
  }, [clearTranscriptEmpty, refs.transcriptRef, refs.manualStopRef]);

  const typewriterReplace = useCallback(async (pEl: HTMLParagraphElement, newText: string, charDelay = 22) => {
    pEl.classList.add('text--fading');
    await sleep(400);
    pEl.textContent = '';
    pEl.classList.remove('text--fading');

    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '▌';

    for (let i = 0; i < newText.length; i++) {
      if (newText[i] === '\n') {
        cursor.remove();
        pEl.appendChild(document.createElement('br'));
      } else {
        cursor.remove();
        pEl.appendChild(document.createTextNode(newText[i]));
      }
      pEl.appendChild(cursor);

      if (i % 40 === 0) {
        pEl.closest('.section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      const base = charDelay + (Math.random() * 10) - 5;
      await sleep(' ,.'.includes(newText[i]) ? base * 0.3 : base);
    }

    cursor.remove();
  }, []);

  const cleanupToastShownRef = useRef(false);

  const applyCleanup = useCallback(async (ids: string[]) => {
    if (!cleanupToastShownRef.current) {
      cleanupToastShownRef.current = true;
      dispatch({ type: 'SHOW_TOAST', message: 'AI usunął nieistotne linie szablonu' });
      setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2600);
    }

    for (const id of ids) {
      // Find the section DOM element
      const sectionEl = document.querySelector(`.section[data-section="${id}"]`) as HTMLElement | null;
      if (sectionEl) {
        sectionEl.classList.add('section--removing');
      }
      await sleep(780);
      dispatch({ type: 'REMOVE_SECTION', id });
    }
  }, [dispatch]);

  const flashSave = useCallback(() => {
    dispatch({ type: 'SET_SAVE_STATUS', status: 'saving' });
    setTimeout(() => dispatch({ type: 'SET_SAVE_STATUS', status: 'saved' }), 700);
  }, [dispatch]);

  const runDictationStep = useCallback(async (step: typeof DICTATION_SCRIPT[0]) => {
    dispatch({ type: 'SET_ACTIVE_SECTION', id: step.target });

    // Scroll section into view
    const sectionEl = document.querySelector(`.section[data-section="${step.target}"]`) as HTMLElement | null;
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setMic(true, 'Słucham…');
    await streamTranscript(step.transcript, 95);
    await sleep(420);
    setMic(false, 'Przetwarzam…');
    await sleep(500);

    // Get the paragraph ref for this section
    const pEl = refs.sectionRefs.current?.get(step.target);
    if (pEl) {
      await typewriterReplace(pEl, step.newText);
    }

    // Lock the section
    dispatch({ type: 'LOCK_SECTION', id: step.target, text: step.newText });

    if (step.removeTargets?.length) {
      await applyCleanup(step.removeTargets);
    }

    setMic(false, 'Gotowy');
    flashSave();
  }, [dispatch, setMic, streamTranscript, typewriterReplace, applyCleanup, flashSave, refs.sectionRefs]);

  const startDemo = useCallback(async () => {
    if (state.storyRunning || state.storyDone) return;

    cleanupToastShownRef.current = false;
    transcriptBlockRef.current = null;

    dispatch({ type: 'SET_STORY_STATE', running: true, done: false });

    for (const step of DICTATION_SCRIPT) {
      if (refs.manualStopRef.current) break;
      await runDictationStep(step);
      await sleep(850);
    }

    const completed = !refs.manualStopRef.current;
    dispatch({ type: 'SET_STORY_STATE', running: false, done: completed });

    if (completed) {
      dispatch({ type: 'ENABLE_EXPORTS' });
      setMic(false, 'Opis gotowy');
      window.dispatchEvent(new CustomEvent('demo-complete'));

      // Add completion banner
      const paperBody = document.getElementById('paperBody');
      if (paperBody) {
        const existing = paperBody.querySelector('.paper__banner');
        if (!existing) {
          const banner = document.createElement('div');
          banner.className = 'paper__banner';
          banner.textContent = 'Opis gotowy';
          paperBody.insertBefore(banner, paperBody.firstChild);
        }
      }
    }

    if (micLevelIntervalRef.current) {
      clearInterval(micLevelIntervalRef.current);
      micLevelIntervalRef.current = null;
    }
  }, [state.storyRunning, state.storyDone, dispatch, refs.manualStopRef, runDictationStep, setMic]);

  return { startDemo };
}
