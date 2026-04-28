import type { AppAction, AppState, PatientInfo } from '../../types';
import { MASTER_TEMPLATE } from '../../data/template';
import { downloadWord } from '../../utils/exportWord';
import { downloadPdf } from '../../utils/exportPdf';

interface WorkspaceHeaderProps {
  dispatch: React.Dispatch<AppAction>;
  saveStatus: AppState['saveStatus'];
  exportsEnabled: boolean;
  patientInfo: PatientInfo;
  sections: AppState['sections'];
  onShowToast: (msg: string) => void;
}

function buildExportData(patientInfo: PatientInfo, sections: AppState['sections']) {
  return {
    title: MASTER_TEMPLATE.title,
    institution: 'PRACOWNIA DIAGNOSTYKI OBRAZOWEJ',
    patientName: patientInfo.name || 'Anna Kowalska',
    pesel: patientInfo.pesel || '84062512345',
    date: (() => {
      const el = document.querySelector('[data-field="date"]') as HTMLElement | null;
      return el?.textContent?.trim() || '28.04.2026';
    })(),
    doctorName: (() => {
      const el = document.querySelector('[data-field="doctor"]') as HTMLElement | null;
      return el?.textContent?.trim() || 'dr Kowalska';
    })(),
    sections: sections.filter(s => !s.removed),
  };
}

export function WorkspaceHeader({
  dispatch,
  saveStatus,
  exportsEnabled,
  patientInfo,
  sections,
  onShowToast,
}: WorkspaceHeaderProps) {
  const saveLabel = saveStatus === 'saving' ? 'Zapisuję…' : 'Zapisane';

  const handleBack = () => {
    dispatch({ type: 'SET_STORY_STATE', running: false, done: false, manualStop: true });
    dispatch({ type: 'SET_RECORDING', value: false });
    dispatch({ type: 'SET_VIEW', view: 'list' });
  };

  const handleWord = async () => {
    const btn = document.getElementById('dlWord') as HTMLButtonElement | null;
    if (btn) { btn.textContent = 'Generuję…'; btn.disabled = true; }
    try {
      await downloadWord(buildExportData(patientInfo, sections));
      onShowToast('Plik Word zapisany.');
    } catch (e) {
      console.error('Word export failed:', e);
      onShowToast('Błąd generowania pliku Word.');
    } finally {
      if (btn) { btn.textContent = 'Word'; btn.disabled = false; }
    }
  };

  const handlePdf = async () => {
    const btn = document.getElementById('dlPdf') as HTMLButtonElement | null;
    if (btn) { btn.textContent = 'Generuję PDF…'; btn.disabled = true; }
    try {
      await downloadPdf(buildExportData(patientInfo, sections));
      onShowToast('Plik PDF zapisany.');
    } catch (e) {
      console.error('PDF export failed:', e);
      onShowToast('Błąd generowania PDF.');
    } finally {
      if (btn) { btn.textContent = 'PDF'; btn.disabled = false; }
    }
  };

  return (
    <header className="header">
      <div className="header__left">
        <button className="hbtn hbtn--ghost" id="backBtn" onClick={handleBack}>
          ← Powrót
        </button>
        <div className="header-sep" />
        <div className="brand">
          <div className="brand__mark">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <rect x="1" y="1" width="4" height="4" rx="1" fill="white" fillOpacity="0.9"/>
              <rect x="6" y="1" width="4" height="4" rx="1" fill="white" fillOpacity="0.5"/>
              <rect x="1" y="6" width="4" height="4" rx="1" fill="white" fillOpacity="0.5"/>
              <rect x="6" y="6" width="4" height="4" rx="1" fill="white" fillOpacity="0.7"/>
            </svg>
          </div>
          <span className="brand__name">Opisy</span>
        </div>
        <div className="header-sep" />
        <span className="header-patient">
          {patientInfo.name} · {patientInfo.pesel} · {patientInfo.examType}
        </span>
      </div>
      <div className="header__right">
        <div className="save-chip">
          <div className="save-chip__dot" />
          <span id="saveChipText">{saveLabel}</span>
        </div>
        <button
          id="dlWord"
          className="hbtn"
          disabled={!exportsEnabled}
          title={exportsEnabled ? '' : 'Dostępne po zakończeniu opisu'}
          onClick={handleWord}
        >
          Word
        </button>
        <button
          id="dlPdf"
          className={`hbtn hbtn--primary${exportsEnabled ? ' pulsing' : ''}`}
          disabled={!exportsEnabled}
          title={exportsEnabled ? '' : 'Dostępne po zakończeniu opisu'}
          onClick={handlePdf}
        >
          PDF
        </button>
      </div>
    </header>
  );
}
