import type { AppAction } from '../../types';
import { REPORTS_LIST } from '../../data/reports';

interface ListViewProps {
  dispatch: React.Dispatch<AppAction>;
  onOpenWorkspace: () => void;
  onNewExam: () => void;
}

export function ListView({ onOpenWorkspace, onNewExam }: ListViewProps) {
  return (
    <div className="view" id="viewList">
      <header className="header">
        <div className="header__left">
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
            <span className="demo-pill">DEMO</span>
          </div>
        </div>
        <div className="header__right">
          <button className="hbtn hbtn--primary" onClick={onNewExam}>
            + Nowe badanie
          </button>
        </div>
      </header>

      <main className="list-main">
        <div className="list-container">
          <h2 className="list-heading">Opisy badań</h2>
          <div className="reports-table">
            {REPORTS_LIST.map(r => {
              const badgeClass = r.status === 'done' ? 'status-badge--done' : 'status-badge--inprogress';
              const badgeText = r.status === 'done' ? 'Zakończony' : 'W trakcie';
              const activeClass = r.id === 1 ? 'report-row--active' : '';
              return (
                <div
                  key={r.id}
                  className={`report-row ${activeClass}`}
                  onClick={() => r.id === 1 && onOpenWorkspace()}
                >
                  <div className="report-row__datetime">
                    {r.date}<span>{r.time}</span>
                  </div>
                  <div className="report-row__info">
                    <div className="report-row__patient">{r.patient}</div>
                    <div className="report-row__exam">{r.exam}</div>
                  </div>
                  <span className={`status-badge ${badgeClass}`}>{badgeText}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
