import { jsPDF } from 'jspdf';
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

// Module-level font cache
let _fontB64: string | null = null;
let _fontBoldB64: string | null = null;

function makeFileName(ext: string): string {
  return `MR_Kolano_Prawe_Anna_Kowalska_28.04.2026.${ext}`;
}

async function loadFont(url: string, cache: string | null): Promise<string | null> {
  if (cache) return cache;
  try {
    const buf = await (await fetch(url)).arrayBuffer();
    const bytes = new Uint8Array(buf);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 4096) {
      bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 4096)));
    }
    return btoa(bin);
  } catch {
    return null;
  }
}

async function loadPolishFont(): Promise<string | null> {
  _fontB64 = await loadFont('https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf', _fontB64);
  return _fontB64;
}

async function loadPolishFontBold(): Promise<string | null> {
  _fontBoldB64 = await loadFont('https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf', _fontBoldB64);
  return _fontBoldB64;
}

export async function downloadPdf(ex: ExportData): Promise<void> {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 56;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const usableW = pageW - margin * 2;
  let y = margin;

  const fontB64 = await loadPolishFont();
  const boldB64 = await loadPolishFontBold();
  let fontName = 'helvetica';

  if (fontB64) {
    doc.addFileToVFS('DejaVuSans.ttf', fontB64);
    doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');
    if (boldB64) {
      doc.addFileToVFS('DejaVuSans-Bold.ttf', boldB64);
      doc.addFont('DejaVuSans-Bold.ttf', 'DejaVuSans', 'bold');
    }
    fontName = 'DejaVuSans';
  }

  // Institution header
  doc.setFont(fontName, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('PRACOWNIA DIAGNOSTYKI OBRAZOWEJ', pageW / 2, y, { align: 'center' });
  y += 18;

  // Title
  doc.setFont(fontName, 'bold');
  doc.setFontSize(13);
  doc.setTextColor(10);
  const titleLines = doc.splitTextToSize(ex.title, usableW);
  doc.text(titleLines, pageW / 2, y, { align: 'center' });
  y += 18 * titleLines.length + 4;

  // Patient data
  doc.setFont(fontName, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(63);
  doc.text(`Pacjent: ${ex.patientName}    PESEL: ${ex.pesel}`, pageW / 2, y, { align: 'center' });
  y += 14;
  doc.text(`Data badania: ${ex.date}    Lekarz opisujący: ${ex.doctorName}`, pageW / 2, y, { align: 'center' });
  y += 16;
  doc.setDrawColor(30);
  doc.setLineWidth(1);
  doc.line(margin, y, pageW - margin, y);
  y += 18;
  doc.setTextColor(10);
  doc.setFontSize(11);

  const writeParagraph = (text: string, opts: { bold?: boolean } = {}) => {
    doc.setFont(fontName, opts.bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, usableW);
    for (const line of lines) {
      if (y > pageH - margin) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += 14;
    }
    y += 4;
  };

  for (const s of ex.sections) {
    if (s.id === 'wnioski') {
      y += 8;
      writeParagraph('Wnioski:', { bold: true });
      for (const line of s.text.split('\n')) writeParagraph(line);
    } else {
      writeParagraph(s.text);
    }
  }

  y += 24;
  if (y > pageH - margin - 20) { doc.addPage(); y = margin; }
  doc.setFont(fontName, 'normal');
  doc.setFontSize(10);
  doc.text(`${ex.doctorName}, radiolog`, pageW - margin, y, { align: 'right' });

  doc.save(makeFileName('pdf'));
}
