import { useRef, useEffect } from 'react';
import type { AppAction } from '../../types';

interface NewExamModalProps {
  dispatch: React.Dispatch<AppAction>;
  onOpenWorkspace: () => void;
}

export function NewExamModal({ dispatch, onOpenWorkspace }: NewExamModalProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const peselRef = useRef<HTMLInputElement>(null);
  const examRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setTimeout(() => nameRef.current?.focus(), 50);
  }, []);

  const close = () => dispatch({ type: 'TOGGLE_MODAL', open: false });

  const submit = () => {
    const name = nameRef.current?.value.trim() || 'Anna Kowalska';
    const pesel = peselRef.current?.value.trim() || '84062512345';
    const examType = examRef.current?.value || 'MR kolana prawego';
    dispatch({ type: 'TOGGLE_MODAL', open: false });
    dispatch({ type: 'SET_PATIENT_INFO', info: { name, pesel, examType } });
    dispatch({ type: 'INIT_WORKSPACE' });
    onOpenWorkspace();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); submit(); }
    if (e.key === 'Escape') { e.preventDefault(); close(); }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close();
  };

  return (
    <div className="new-exam-modal" onKeyDown={handleKeyDown} onClick={handleBackdropClick}>
      <div className="new-exam-modal__card">
        <h3>Nowe badanie</h3>
        <div className="new-exam-form">
          <label>
            <span>Pacjent</span>
            <input ref={nameRef} type="text" placeholder="Anna Kowalska" />
          </label>
          <label>
            <span>PESEL</span>
            <input ref={peselRef} type="text" placeholder="84062512345" />
          </label>
          <label>
            <span>Badanie</span>
            <select ref={examRef} defaultValue="MR kolana prawego">
              <option>MR kolana prawego</option>
              <option>MR kolana lewego</option>
              <option>MR barku</option>
              <option>MR kręgosłupa L-S</option>
              <option>TK głowy</option>
              <option>USG jamy brzusznej</option>
            </select>
          </label>
          <div className="new-exam-form__actions">
            <button className="btn btn--ghost" onClick={close}>Anuluj</button>
            <button className="btn btn--primary" onClick={submit}>Rozpocznij</button>
          </div>
        </div>
      </div>
    </div>
  );
}
