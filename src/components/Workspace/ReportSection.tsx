import { memo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Section } from '../../types';

interface ReportSectionProps {
  section: Section;
  onTextChange: (id: string, text: string) => void;
}

export const ReportSection = memo(function ReportSection({ section, onTextChange }: ReportSectionProps) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const initializedRef = useRef(false);
  const lastSyncedText = useRef(section.text);

  // Sync text from state → DOM only when text changes externally (lock, etc.)
  useEffect(() => {
    if (section.removed) return;
    if (!pRef.current) return;
    if (!initializedRef.current) {
      pRef.current.innerHTML = section.text.replace(/\n/g, '<br/>');
      initializedRef.current = true;
      lastSyncedText.current = section.text;
    } else if (lastSyncedText.current !== section.text) {
      pRef.current.innerHTML = section.text.replace(/\n/g, '<br/>');
      lastSyncedText.current = section.text;
    }
  }, [section.text, section.removed]);

  // All hooks must be called before any conditional return
  const isAnimating = section.active && section.displayedText !== undefined;
  const isEditable = !section.active && !section.removing;

  const cls = section.removing ? 'section--removing'
             : section.locked ? 'section--locked'
             : section.active ? 'section--active'
             : section.pending ? 'section--pending'
             : '';

  const handleBlur = () => {
    if (pRef.current) {
      const newText = pRef.current.innerText.trim();
      lastSyncedText.current = newText;
      onTextChange(section.id, newText);
    }
  };

  return (
    <AnimatePresence mode="popLayout">
      {!section.removed && (
        <motion.div
          key={section.id}
          className={`section ${cls}`}
          data-section={section.id}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {isAnimating ? (
            <p>{section.displayedText}<span className="cursor">▌</span></p>
          ) : (
            <p
              ref={pRef}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={handleBlur}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}, (prev, next) => {
  const p = prev.section;
  const n = next.section;
  return p.id === n.id
    && p.text === n.text
    && p.active === n.active
    && p.locked === n.locked
    && p.pending === n.pending
    && p.removed === n.removed
    && p.removing === n.removing
    && p.displayedText === n.displayedText
    && prev.onTextChange === next.onTextChange;
});
