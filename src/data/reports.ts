export interface ReportRow {
  id: number;
  date: string;
  time: string;
  patient: string;
  exam: string;
  status: 'done' | 'in_progress';
}

export const REPORTS_LIST: ReportRow[] = [
  { id: 1, date: '28.04.2026', time: '14:30', patient: 'Anna Kowalska',        exam: 'MR kolana prawego',       status: 'in_progress' },
  { id: 2, date: '28.04.2026', time: '11:15', patient: 'Jan Nowak',             exam: 'MR barku',                status: 'done' },
  { id: 3, date: '27.04.2026', time: '16:45', patient: 'Maria Wiśniewska',      exam: 'MR kręgosłupa L-S',       status: 'done' },
  { id: 4, date: '27.04.2026', time: '09:00', patient: 'Piotr Zieliński',       exam: 'TK głowy',                status: 'done' },
  { id: 5, date: '25.04.2026', time: '13:20', patient: 'Katarzyna Dąbrowska',   exam: 'MR stawu skokowego',      status: 'done' },
  { id: 6, date: '25.04.2026', time: '10:00', patient: 'Tomasz Lewandowski',    exam: 'USG jamy brzusznej',      status: 'done' },
];
