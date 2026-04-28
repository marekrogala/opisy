import { memo, useRef, useImperativeHandle, forwardRef } from 'react';
import type { Section } from '../../types';

interface ReportSectionProps {
  section: Section;
  onTextChange: (id: string, text: string) => void;
}

export const ReportSection = memo(forwardRef<HTMLParagraphElement, ReportSectionProps>(
  function ReportSection({ section, onTextChange }, ref) {
    const pRef = useRef<HTMLParagraphElement>(null);

    useImperativeHandle(ref, () => pRef.current!, []);

    if (section.removed) return null;

    const cls = section.locked ? 'section--locked'
               : section.active ? 'section--active'
               : section.pending ? 'section--pending'
               : '';

    const isEditable = !section.active;

    const handleBlur = () => {
      if (pRef.current) {
        onTextChange(section.id, pRef.current.innerText.trim());
      }
    };

    return (
      <div
        className={`section ${cls}`}
        data-section={section.id}
      >
        <p
          ref={pRef}
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={handleBlur}
          dangerouslySetInnerHTML={{ __html: section.text.replace(/\n/g, '<br/>') }}
        />
      </div>
    );
  }
));
