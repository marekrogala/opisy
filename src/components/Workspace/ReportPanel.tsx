import type { Section, AppAction, PatientInfo } from '../../types';
import { Paper } from './Paper';

interface ReportPanelProps {
  sections: Section[];
  patientInfo: PatientInfo;
  dispatch: React.Dispatch<AppAction>;
  sectionRefs: React.RefObject<Map<string, HTMLParagraphElement>>;
}

export function ReportPanel({ sections, patientInfo, dispatch, sectionRefs }: ReportPanelProps) {
  return (
    <div className="report-panel">
      <Paper
        sections={sections}
        patientInfo={patientInfo}
        dispatch={dispatch}
        sectionRefs={sectionRefs}
      />
    </div>
  );
}
