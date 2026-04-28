import { useRef, useCallback } from 'react';
import type { Section, AppAction, PatientInfo } from '../../types';
import { MASTER_TEMPLATE } from '../../data/template';
import { DocHeader } from './DocHeader';
import { ReportSection } from './ReportSection';

interface PaperProps {
  sections: Section[];
  patientInfo: PatientInfo;
  dispatch: React.Dispatch<AppAction>;
  sectionRefs: React.RefObject<Map<string, HTMLParagraphElement>>;
}

export function Paper({ sections, patientInfo, dispatch, sectionRefs }: PaperProps) {
  const setSectionRef = useCallback((id: string, el: HTMLParagraphElement | null) => {
    if (!sectionRefs.current) return;
    if (el) {
      sectionRefs.current.set(id, el);
    } else {
      sectionRefs.current.delete(id);
    }
  }, [sectionRefs]);

  const handleTextChange = (id: string, text: string) => {
    dispatch({ type: 'UPDATE_SECTION_TEXT', id, text });
  };

  return (
    <div className="paper">
      <DocHeader title={MASTER_TEMPLATE.title} patientInfo={patientInfo} />

      <div className="paper__body" id="paperBody">
        {sections.map(section => (
          <ReportSection
            key={section.id}
            section={section}
            onTextChange={handleTextChange}
            ref={(el) => setSectionRef(section.id, el)}
          />
        ))}
      </div>

      <div className="paper__signature">dr Kowalska, radiolog</div>
    </div>
  );
}
