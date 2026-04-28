import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import type { Section } from '../types';

export interface ExportData {
  title: string;
  institution: string;
  patientName: string;
  pesel: string;
  date: string;
  doctorName: string;
  sections: Section[];
}

function makeFileName(ext: string): string {
  return `MR_Kolano_Prawe_Anna_Kowalska_28.04.2026.${ext}`;
}

function triggerDownload(blob: Blob, filename: string): void {
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 200);
}

export async function downloadWord(ex: ExportData): Promise<void> {
  const children: Paragraph[] = [];

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: 'PRACOWNIA DIAGNOSTYKI OBRAZOWEJ', size: 16, color: '9a9a9a' })],
  }));

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: ex.title, bold: true, size: 28 })],
  }));

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: `Pacjent: ${ex.patientName}    PESEL: ${ex.pesel}`, size: 20, color: '3f3f3f' })],
  }));

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 320 },
    children: [new TextRun({ text: `Data: ${ex.date}    Lekarz: ${ex.doctorName}`, size: 20, color: '3f3f3f' })],
  }));

  for (const s of ex.sections) {
    if (s.id === 'wnioski') {
      children.push(new Paragraph({
        spacing: { before: 240, after: 80 },
        children: [new TextRun({ text: 'Wnioski:', bold: true, size: 24 })],
      }));
      for (const line of s.text.split('\n')) {
        children.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: line, size: 22 })] }));
      }
    } else {
      children.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: s.text, size: 22 })] }));
    }
  }

  children.push(new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 480 },
    children: [new TextRun({ text: `${ex.doctorName}, radiolog`, italics: true, size: 22 })],
  }));

  const wordDoc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(wordDoc);
  triggerDownload(blob, makeFileName('docx'));
}
