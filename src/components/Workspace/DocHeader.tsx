import type { PatientInfo } from '../../types';

interface DocHeaderProps {
  title: string;
  patientInfo: PatientInfo;
}

export function DocHeader({ title, patientInfo }: DocHeaderProps) {
  return (
    <>
      <div className="doc-institution">
        <span>PRACOWNIA DIAGNOSTYKI OBRAZOWEJ</span>
        <span className="doc-institution__addr">ul. Szpitalna 1 · 00-001 Warszawa</span>
      </div>

      <hr className="doc-rule" />

      <div
        className="doc-title"
        contentEditable
        suppressContentEditableWarning
      >
        {title}
      </div>

      <div className="doc-patient-grid">
        <div className="doc-field">
          <span className="doc-field__label">Pacjent:</span>
          <span
            className="doc-field__value"
            contentEditable
            suppressContentEditableWarning
            data-field="patientName"
          >
            {patientInfo.name}
          </span>
        </div>
        <div className="doc-field">
          <span className="doc-field__label">PESEL:</span>
          <span
            className="doc-field__value"
            contentEditable
            suppressContentEditableWarning
            data-field="pesel"
          >
            {patientInfo.pesel}
          </span>
        </div>
        <div className="doc-field">
          <span className="doc-field__label">Płeć:</span>
          <span
            className="doc-field__value"
            contentEditable
            suppressContentEditableWarning
            data-field="sex"
          >
            K
          </span>
        </div>
        <div className="doc-field">
          <span className="doc-field__label">Wiek:</span>
          <span
            className="doc-field__value"
            contentEditable
            suppressContentEditableWarning
            data-field="age"
          >
            41 l.
          </span>
        </div>
        <div className="doc-field doc-field--full">
          <span className="doc-field__label">Data badania:</span>
          <span
            className="doc-field__value"
            contentEditable
            suppressContentEditableWarning
            data-field="date"
          >
            28.04.2026
          </span>
        </div>
        <div className="doc-field doc-field--full">
          <span className="doc-field__label">Lekarz opisujący:</span>
          <span
            className="doc-field__value"
            contentEditable
            suppressContentEditableWarning
            data-field="doctor"
          >
            dr Kowalska
          </span>
        </div>
        <div className="doc-field doc-field--full" style={{ display: 'none' }}>
          <span
            className="doc-field__value"
            data-field="address"
          />
        </div>
      </div>

      <hr className="doc-rule" />
    </>
  );
}
