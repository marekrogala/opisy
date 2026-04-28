import { memo, useCallback } from 'react';
import type { Section, AppAction, PatientInfo } from '../../types';
import { MASTER_TEMPLATE } from '../../data/template';
import { DocHeader } from './DocHeader';
import { ReportSection } from './ReportSection';

interface PaperProps {
  sections: Section[];
  patientInfo: PatientInfo;
  dispatch: React.Dispatch<AppAction>;
}

export const Paper = memo(function Paper({ sections, patientInfo, dispatch }: PaperProps) {
  const handleTextChange = useCallback((id: string, text: string) => {
    dispatch({ type: 'UPDATE_SECTION_TEXT', id, text });
  }, [dispatch]);

  return (
    <div className="paper">
      <DocHeader title={MASTER_TEMPLATE.title} patientInfo={patientInfo} />

      <div className="paper__body" id="paperBody">
        {sections.map(section => (
          <ReportSection
            key={section.id}
            section={section}
            onTextChange={handleTextChange}
          />
        ))}
      </div>

      <div className="paper__signature">dr Kowalska, radiolog</div>
    </div>
  );
});
