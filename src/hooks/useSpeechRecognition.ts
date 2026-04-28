import { useRef, useState, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  onResult: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

interface SpeechRecognitionReturn {
  start: () => boolean;
  stop: () => void;
  isSupported: boolean;
  isListening: boolean;
}

// Minimal types for Web Speech API (not always in DOM lib)
interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: { new(): ISpeechRecognition } | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: { new(): ISpeechRecognition } | undefined;
  }
}

function getSR(): (new () => ISpeechRecognition) | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function useSpeechRecognition(
  opts: UseSpeechRecognitionOptions
): SpeechRecognitionReturn {
  const isSupported = !!getSR();

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const activeRef = useRef(false);
  const optsRef = useRef(opts);
  optsRef.current = opts;
  const [isListening, setIsListening] = useState(false);

  const start = useCallback((): boolean => {
    const SR = getSR();
    if (!SR) return false;

    if (!recognitionRef.current) {
      const r = new SR();
      r.lang = 'pl-PL';
      r.continuous = true;
      r.interimResults = true;

      r.onresult = (event: SpeechRecognitionEvent) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        const isFinal = event.results[event.results.length - 1]?.isFinal ?? false;
        optsRef.current.onResult(text, isFinal);
      };

      r.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === 'not-allowed') {
          optsRef.current.onError?.('Brak dostępu do mikrofonu');
        }
      };

      r.onend = () => {
        if (activeRef.current) {
          // auto-restart
          try { r.start(); } catch { /* ignore */ }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = r;
    }

    try {
      activeRef.current = true;
      recognitionRef.current.start();
      setIsListening(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    activeRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
    setIsListening(false);
  }, []);

  return { start, stop, isSupported, isListening };
}
