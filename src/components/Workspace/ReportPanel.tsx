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
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '24px 0',
        }}>
          <button
            className="btn btn--primary"
            style={{ padding: '12px 32px', fontSize: '14px' }}
            onClick={onStartDictation}
          >
            Rozpocznij dyktowanie →
          </button>
        </div>
      )}
    </div>
  );
}
