import { useEffect, useRef } from 'react';

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (message) {
      el.hidden = false;
      // Force reflow
      void el.offsetHeight;
      el.classList.add('show');
    } else {
      el.classList.remove('show');
      const tid = setTimeout(() => { el.hidden = true; }, 240);
      return () => clearTimeout(tid);
    }
  }, [message]);

  return (
    <div ref={ref} className="toast" hidden>
      {message}
    </div>
  );
}
