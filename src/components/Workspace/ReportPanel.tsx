import type { Section, AppAction, PatientInfo } from '../../types';
import { Paper } from './Paper';

interface ReportPanelProps {
  sections: Section[];
  patientInfo: PatientInfo;
  dispatch: React.Dispatch<AppAction>;
  showStartButton?: boolean;
  onStartDictation?: () => void;
}

export function ReportPanel({ sections, patientInfo, dispatch, showStartButton, onStartDictation }: ReportPanelProps) {
  return (
    <div className="report-panel">
      <Paper
        sections={sections}
        patientInfo={patientInfo}
        dispatch={dispatch}
      />
      {showStartButton && (
        <div className="report-panel__start">
          <button className="start-btn" onClick={onStartDictation}>
            Rozpocznij dyktowanie
            <span className="start-btn__arrow">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
