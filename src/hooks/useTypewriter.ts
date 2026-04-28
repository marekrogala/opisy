import { useCallback } from 'react';
import { sleep } from '../utils/helpers';

export function useTypewriter(ref: React.RefObject<HTMLParagraphElement | null>) {
  const replaceText = useCallback(async (newText: string, charDelay = 22): Promise<void> => {
    const p = ref.current;
    if (!p) return;

    // Fade out old text
    p.classList.add('text--fading');
    await sleep(400);
    p.textContent = '';
    p.classList.remove('text--fading');

    // Type new text char by char
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '▌';

    for (let i = 0; i < newText.length; i++) {
      if (newText[i] === '\n') {
        cursor.remove();
        p.appendChild(document.createElement('br'));
      } else {
        cursor.remove();
        p.appendChild(document.createTextNode(newText[i]));
      }
      p.appendChild(cursor);

      if (i % 40 === 0) {
        p.closest('.section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      const base = charDelay + (Math.random() * 10) - 5;
      await sleep(' ,.'.includes(newText[i]) ? base * 0.3 : base);
    }

    cursor.remove();
  }, [ref]);

  return { replaceText };
}
