/* ============================================================
   Opisy v3 — single-screen demo
   ============================================================ */

// ============== Utilities ==============
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return [...root.querySelectorAll(sel)]; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// ============== Templates catalogue ==============
const TEMPLATES = [
  { id: 'mr_kolano_prawe', icon: 'MR', title: 'MR kolana prawego',     meta: '12 sekcji · ostatnio dziś',   active: true },
  { id: 'mr_kolano_lewe',  icon: 'MR', title: 'MR kolana lewego',      meta: '12 sekcji · ostatnio wczoraj' },
  { id: 'mr_bark',         icon: 'MR', title: 'MR barku',              meta: '10 sekcji · ostatnio 25.04' },
  { id: 'mr_kregoslup_ls', icon: 'MR', title: 'MR kręgosłupa L-S',     meta: '14 sekcji · ostatnio 21.04' },
  { id: 'mr_skok',         icon: 'MR', title: 'MR stawu skokowego',    meta: '11 sekcji · ostatnio 18.04' },
  { id: 'mr_biodro',       icon: 'MR', title: 'MR stawu biodrowego',   meta: '11 sekcji · ostatnio 10.04' },
  { id: 'usg_brzuch',      icon: 'USG', title: 'USG jamy brzusznej',   meta: '10 sekcji · ostatnio 24.04' },
  { id: 'tk_glowa',        icon: 'TK', title: 'TK głowy',              meta: '9 sekcji · ostatnio 23.04' },
  { id: 'tk_klatka',       icon: 'TK', title: 'TK klatki piersiowej',  meta: '10 sekcji · ostatnio 15.04' },
];

// ============== Master template (MR knee R) ==============
const MASTER_TEMPLATE = {
  id: 'mr_kolano_prawe',
  title: 'REZONANS MAGNETYCZNY KOLANA PRAWEGO',
  sections: [
    { id: 'wskazanie', label: 'Wskazanie',
      text: 'Wskazanie: ból kolana, podejrzenie uszkodzenia łąkotki przyśrodkowej. Uraz skrętny 3 tygodnie temu.',
      pending: false },
    { id: 'technika', label: 'Technika',
      text: 'Badanie wykonano w sekwencjach PD, T1, T2 z saturacją tłuszczu w płaszczyznach strzałkowej, czołowej i poprzecznej.',
      pending: false },
    { id: 'lakotka_p', label: 'Łąkotka przyśrodkowa',
      text: 'Łąkotka przyśrodkowa: prawidłowa, bez cech uszkodzenia.',
      pending: true },
    { id: 'lakotka_b', label: 'Łąkotka boczna',
      text: 'Łąkotka boczna: prawidłowa, bez cech uszkodzenia.',
      pending: true },
    { id: 'acl', label: 'Więzadło krzyżowe przednie',
      text: 'Więzadło krzyżowe przednie (ACL): prawidłowe, ciągłe na całym przebiegu.',
      pending: true },
    { id: 'pcl', label: 'Więzadło krzyżowe tylne',
      text: 'Więzadło krzyżowe tylne (PCL): prawidłowe, ciągłe.',
      pending: true },
    { id: 'mcl', label: 'Więzadła poboczne',
      text: 'Więzadła poboczne (MCL, LCL): prawidłowe, bez cech uszkodzenia.',
      pending: true },
    { id: 'chrzastka', label: 'Chrząstka stawowa',
      text: 'Chrząstka stawowa: bez cech istotnego uszkodzenia.',
      pending: true },
    { id: 'kosci', label: 'Kości',
      text: 'Kości tworzące staw: bez zmian patologicznych, bez obrzęku szpiku.',
      pending: true },
    { id: 'wysiek', label: 'Jama stawu',
      text: 'Jama stawu: bez wysięku.',
      pending: true },
    { id: 'tkanki', label: 'Tkanki miękkie',
      text: 'Tkanki miękkie okołostawowe: bez zmian.',
      pending: true },
    { id: 'wnioski', label: 'Wnioski',
      text: '1. Badanie bez istotnych odchyleń od normy.',
      pending: true },
  ]
};

// ============== Dictation script ==============
const DICTATION_SCRIPT = [
  {
    target: 'lakotka_b',
    transcript: 'łąkotka boczna prawidłowa bez cech uszkodzenia w obu rogach',
    newText: 'Łąkotka boczna: prawidłowa, bez cech uszkodzenia w rogu przednim ani tylnym.',
    showLockToast: true,
  },
  {
    target: 'lakotka_p',
    transcript: 'róg tylny łąkotki przyśrodkowej skośne przytorebkowe pęknięcie',
    newText: 'Łąkotka przyśrodkowa: w rogu tylnym widoczne skośne, horyzontalno-degeneracyjne pęknięcie przytorebkowe sięgające górnej powierzchni stawowej. Wysokość rogu tylnego zachowana.',
  },
  {
    target: 'acl',
    transcript: 'ACL trzeciego stopnia w przyczepie udowym',
    newText: 'Więzadło krzyżowe przednie (ACL): zerwanie III stopnia w przyczepie udowym, z brakiem ciągłości włókien. Włókna pofałdowane, leżą poziomo na płaskowyżu kości piszczelowej. Towarzyszy bone bruise w okolicy przyczepu.',
    removeTargets: ['mcl'],
  },
  {
    target: 'kosci',
    transcript: 'obrzęk szpiku kłykieć boczny dwanaście na osiem milimetrów',
    newText: 'Kości tworzące staw: w kłykciu bocznym kości udowej widoczny obszar obrzęku szpiku kostnego (bone bruise) o wymiarach około 12 × 8 mm. Pozostałe kości bez zmian patologicznych.',
    removeTargets: ['chrzastka'],
  },
  {
    target: 'wysiek',
    transcript: 'niewielki wysięk w zachyłku nadrzepkowym',
    newText: 'Jama stawu: obecny niewielki wysięk w zachyłku nadrzepkowym. Bez cech krwiaka.',
  },
  {
    target: 'wnioski',
    transcript: 'wygeneruj wnioski',
    newText:
      '1. Skośne, horyzontalno-degeneracyjne pęknięcie przytorebkowe rogu tylnego łąkotki przyśrodkowej.\n' +
      '2. Zerwanie więzadła krzyżowego przedniego (ACL) III stopnia w przyczepie udowym.\n' +
      '3. Obszar obrzęku szpiku kostnego (bone bruise) w kłykciu bocznym kości udowej (12 × 8 mm).\n' +
      '4. Niewielki wysięk w jamie stawu.\n' +
      '5. Pozostałe struktury bez istotnych odchyleń od normy.',
    removeTargets: ['pcl', 'tkanki'],
  },
];

// ============== State ==============
const state = {
  patient: { firstName: 'Anna', lastName: 'Kowalska', anonId: '#4471', doctorName: 'dr Kowalska' },
  templateId: 'mr_kolano_prawe',
  sections: clone(MASTER_TEMPLATE.sections),
  startTime: null,
  isRecording: false,
  storyRunning: false,
  storyDone: false,
  manualStop: false,
};

// ============== Initial render ==============
function initApp() {
  updateHeader();
  renderPaper();
  updateProgress();
  // start demo after 1.5s
  setTimeout(startDemo, 1500);
}

function updateHeader() {
  const tpl = TEMPLATES.find(t => t.id === state.templateId);
  $('#patientName').textContent = `${state.patient.firstName} ${state.patient.lastName}`;
  $('#patientAnon').textContent = `Pacjent ${state.patient.anonId}`;
  $('#paperTitle').textContent = tpl ? tpl.title : MASTER_TEMPLATE.title;
  $('#paperMeta').textContent =
    `Pacjent: ${state.patient.anonId} · Data: ${new Date().toLocaleDateString('pl-PL')} · Lekarz: ${state.patient.doctorName}`;
}

// ============== Paper render ==============
function renderPaper() {
  const body = $('#paperBody');
  if (!body) return;
  body.innerHTML = state.sections.map(s => {
    if (s.removed) return '';
    const cls = s.locked ? 'section--locked'
              : s.active  ? 'section--active'
              : s.pending ? 'section--pending'
              : '';
    const html = escapeHtml(s.text).replace(/\n/g, '<br/>');
    return `<div class="section ${cls}" data-section="${s.id}">
      <p>${html}</p>
      ${s.locked ? `<button class="section__edit" data-edit="${s.id}">edytuj</button>` : ''}
    </div>`;
  }).join('');

  // wire edit buttons
  $$('[data-edit]', body).forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const sid = btn.dataset.edit;
      const sec = $(`.section[data-section="${sid}"]`);
      if (!sec) return;
      const p = sec.querySelector('p');
      if (p.contentEditable === 'true') {
        p.contentEditable = 'false';
        sec.classList.remove('section--editing');
        const obj = state.sections.find(x => x.id === sid);
        if (obj) obj.text = p.innerText.trim();
      } else {
        p.contentEditable = 'true';
        sec.classList.add('section--editing');
        p.focus();
        p.addEventListener('blur', () => {
          p.contentEditable = 'false';
          sec.classList.remove('section--editing');
          const obj = state.sections.find(x => x.id === sid);
          if (obj) obj.text = p.innerText.trim();
        }, { once: true });
      }
    });
  });
}

// ============== Progress counter ==============
function updateProgress() {
  const total = state.sections.filter(s => !s.removed).length;
  const locked = state.sections.filter(s => s.locked).length;
  const el = $('#progressText');
  if (el) el.textContent = `${locked} / ${total} sekcji`;
}

// ============== Mic UI ==============
let micLevelId = null;

function setMic(active, statusText) {
  state.isRecording = active;
  const btn = $('#micBtn');
  const status = $('#micStatus');
  const level = $('#micLevel');
  const dot = $('#liveDot');

  btn?.classList.toggle('active', active);
  if (status) status.textContent = statusText;
  if (dot) dot.classList.toggle('live', active);

  clearInterval(micLevelId);
  if (active) {
    micLevelId = setInterval(() => {
      if (level) level.style.width = (25 + Math.random() * 72) + '%';
    }, 90);
  } else if (level) {
    level.style.width = '0%';
  }
}

// ============== Live transcript stream ==============
let transcriptBlock = null;

function clearTranscriptEmpty() {
  const empty = $('#transcript .transcript__empty');
  if (empty) empty.remove();
}

async function streamTranscript(text, perWordMs = 95) {
  clearTranscriptEmpty();
  const tr = $('#transcript');

  // mark previous block as done
  if (transcriptBlock) {
    transcriptBlock.classList.add('done');
    const br = document.createElement('span');
    br.className = 'transcript__break';
    tr.appendChild(br);
  }

  transcriptBlock = document.createElement('div');
  transcriptBlock.className = 'transcript__block';
  tr.appendChild(transcriptBlock);

  const words = text.split(/\s+/);
  for (const w of words) {
    if (state.manualStop) break;
    const span = document.createElement('span');
    span.className = 'transcript__word transcript__word--active';
    span.textContent = w;
    transcriptBlock.appendChild(span);
    tr.scrollTop = tr.scrollHeight;
    await sleep(perWordMs + Math.random() * 55);
  }

  // mark all words as done
  $$('.transcript__word--active', transcriptBlock).forEach(w => {
    w.classList.remove('transcript__word--active');
    w.classList.add('transcript__word--done');
  });
}

// ============== Typewriter replacement ==============
async function typewriterReplace(sectionEl, newText, charDelay = 22) {
  const p = sectionEl.querySelector('p');
  if (!p) return;

  // Fade out old text
  p.classList.add('text--fading');
  await sleep(400);

  // Clear and start typing
  p.textContent = '';
  p.classList.remove('text--fading');

  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.textContent = '▌';

  for (let i = 0; i < newText.length; i++) {
    if (newText[i] === '\n') {
      if (cursor.parentNode) cursor.remove();
      p.appendChild(document.createElement('br'));
    } else {
      if (cursor.parentNode) cursor.remove();
      p.appendChild(document.createTextNode(newText[i]));
    }
    p.appendChild(cursor);

    // scroll section into view periodically
    if (i % 40 === 0) sectionEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // variable delay for natural feel; faster for spaces/punctuation
    const base = charDelay + (Math.random() * 10) - 5;
    const delay = (' ,.'.includes(newText[i])) ? base * 0.3 : base;
    await sleep(delay);
  }

  cursor.remove();
}

// ============== Dictation step ==============
async function runDictationStep(step) {
  const sec = state.sections.find(s => s.id === step.target);
  if (!sec) return;

  // Mark section active
  state.sections.forEach(s => s.active = false);
  sec.active = true;

  // Update section element state directly (no full re-render to preserve typewriter)
  const sectionEl = $(`.section[data-section="${step.target}"]`);
  if (sectionEl) {
    sectionEl.className = 'section section--active';
    sectionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  setMic(true, 'Słucham…');
  await streamTranscript(step.transcript, 95);

  await sleep(420);
  setMic(false, 'Przetwarzam…');
  await sleep(500);

  // Typewriter replacement
  if (sectionEl) {
    await typewriterReplace(sectionEl, step.newText);
  }

  // Lock section
  sec.active = false;
  sec.pending = false;
  sec.locked = true;
  sec.text = step.newText;

  if (sectionEl) {
    sectionEl.className = 'section section--locked';
    // re-add edit button if not present
    if (!sectionEl.querySelector('.section__edit')) {
      const editBtn = document.createElement('button');
      editBtn.className = 'section__edit';
      editBtn.dataset.edit = step.target;
      editBtn.textContent = 'edytuj';
      editBtn.addEventListener('click', e => {
        e.stopPropagation();
        const p = sectionEl.querySelector('p');
        if (!p) return;
        if (p.contentEditable === 'true') {
          p.contentEditable = 'false';
          sectionEl.classList.remove('section--editing');
          sec.text = p.innerText.trim();
        } else {
          p.contentEditable = 'true';
          sectionEl.classList.add('section--editing');
          p.focus();
          p.addEventListener('blur', () => {
            p.contentEditable = 'false';
            sectionEl.classList.remove('section--editing');
            sec.text = p.innerText.trim();
          }, { once: true });
        }
      });
      sectionEl.appendChild(editBtn);
    }
  }

  if (step.showLockToast) showToast('Sekcja zablokowana — model jej nie zmieni');

  // Handle cleanup targets
  if (step.removeTargets?.length) {
    await applyCleanup(step.removeTargets);
  }

  updateProgress();
  setMic(false, 'Gotowy');
  flashSave();
}

// ============== Cleanup: fade+collapse removed sections ==============
let _cleanupToastShown = false;

async function applyCleanup(ids) {
  if (!_cleanupToastShown) {
    _cleanupToastShown = true;
    showToast('AI usunął nieistotne linie szablonu');
  }
  for (const id of ids) {
    const sec = state.sections.find(s => s.id === id);
    if (!sec || sec.locked || sec.removed) continue;
    const el = $(`.section[data-section="${id}"]`);
    if (el) {
      el.classList.add('section--removing');
    }
    await sleep(780);
    sec.removed = true;
    if (el) el.remove();
  }
}

// ============== Save flash ==============
function flashSave() {
  const chip = $('#saveChipText');
  if (!chip) return;
  chip.textContent = 'Zapisuję…';
  setTimeout(() => { chip.textContent = 'Zapisane'; }, 700);
}

// ============== Full story ==============
async function startDemo() {
  if (state.storyRunning || state.storyDone) return;
  state.storyRunning = true;
  state.startTime = Date.now();

  // Disable download buttons during dictation
  ['#dlWord', '#dlPdf'].forEach(sel => {
    const el = $(sel);
    if (el) { el.disabled = true; el.title = 'Dostępne po zakończeniu opisu'; }
  });

  for (const step of DICTATION_SCRIPT) {
    if (state.manualStop) break;
    await runDictationStep(step);
    await sleep(850);
  }

  state.storyRunning = false;
  state.storyDone = true;

  // Re-enable download buttons
  ['#dlWord', '#dlPdf'].forEach(sel => {
    const el = $(sel);
    if (el) { el.disabled = false; el.title = ''; }
  });

  setMic(false, 'Opis gotowy');

  // Show completion banner in paper
  const paper = $('#paper');
  if (paper) {
    const locked = state.sections.filter(s => s.locked).length;
    const total = state.sections.filter(s => !s.removed).length;
    const banner = document.createElement('div');
    banner.className = 'paper__banner';
    banner.innerHTML = `Opis gotowy · ${locked}/${total} sekcji zweryfikowanych<div class="banner__bar"></div>`;
    const body = $('#paperBody');
    if (body) body.insertBefore(banner, body.firstChild);
  }

  // Pulse the PDF button
  $('#dlPdf')?.classList.add('pulsing');

  updateProgress();
}

// ============== Mic button click ==============
$('#micBtn')?.addEventListener('click', () => {
  if (state.storyRunning) {
    state.manualStop = true;
    setMic(false, 'Zatrzymano');
    state.storyRunning = false;
    return;
  }
  if (state.isRecording) {
    setMic(false, 'Gotowy');
  } else {
    setMic(true, 'Słucham…');
    setTimeout(() => setMic(false, 'Gotowy'), 1800);
  }
});

// ============== Restart ==============
function fullReset() {
  state.sections = clone(MASTER_TEMPLATE.sections);
  state.startTime = null;
  state.isRecording = false;
  state.storyRunning = false;
  state.storyDone = false;
  state.manualStop = false;
  _cleanupToastShown = false;
  transcriptBlock = null;

  // Reset transcript
  const tr = $('#transcript');
  if (tr) tr.innerHTML = '<div class="transcript__empty">Tu pojawią się słowa, które dyktuje radiolog…</div>';

  // Reset PDF button
  $('#dlPdf')?.classList.remove('pulsing');

  setMic(false, 'Gotowy');
  updateHeader();
  renderPaper();
  updateProgress();

  // Restart demo after short delay
  setTimeout(startDemo, 1500);
}

$('#restartBtn')?.addEventListener('click', fullReset);

// ============== Export helpers ==============
function buildExportText() {
  return {
    title: MASTER_TEMPLATE.title,
    patient: 'Pacjent ' + state.patient.anonId,
    date: new Date().toLocaleDateString('pl-PL'),
    doctorName: state.patient.doctorName,
    sections: state.sections.filter(s => !s.removed),
  };
}

function buildPlainText() {
  const ex = buildExportText();
  let out = ex.title + '\n' + '='.repeat(ex.title.length) + '\n\n';
  out += `Pacjent: ${ex.patient}    Data: ${ex.date}    Lekarz: ${ex.doctorName}\n\n`;
  for (const s of ex.sections) {
    if (s.id === 'wnioski') out += '\nWnioski:\n' + s.text + '\n';
    else out += s.text + '\n';
  }
  out += `\n\n                                           ${ex.doctorName}, radiolog\n`;
  return out;
}

function makeFileName(ext) {
  const tpl = (TEMPLATES.find(t => t.id === state.templateId)?.title || 'Opis')
    .replace(/[^A-Za-z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, '').replace(/\s+/g, '_');
  const date = new Date().toISOString().slice(0, 10);
  return `${tpl}_Pacjent${state.patient.anonId.replace('#', '')}_${date}.${ext}`;
}

function triggerDownload(blob, filename) {
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 200);
}

// ============== Word download ==============
async function downloadWord() {
  if (typeof docx === 'undefined') { showToast('Biblioteka docx się nie załadowała.'); return; }
  const btn = $('#dlWord');
  const orig = btn?.textContent;
  if (btn) { btn.textContent = 'Generuję…'; btn.disabled = true; }
  try {
    const { Document, Packer, Paragraph, TextRun, AlignmentType } = docx;
    const ex = buildExportText();
    const children = [];

    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: ex.title, bold: true, size: 28 })],
    }));
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 320 },
      children: [new TextRun({ text: `Pacjent: ${ex.patient}    Data: ${ex.date}    Lekarz: ${ex.doctorName}`, size: 20, color: '6b6b6b' })],
    }));

    for (const s of ex.sections) {
      if (s.id === 'wnioski') {
        children.push(new Paragraph({
          spacing: { before: 240, after: 80 },
          children: [new TextRun({ text: 'Wnioski:', bold: true, size: 24 })],
        }));
        for (const line of s.text.split('\n')) {
          children.push(new Paragraph({
            spacing: { after: 80 },
            children: [new TextRun({ text: line, size: 22 })],
          }));
        }
      } else {
        children.push(new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: s.text, size: 22 })],
        }));
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
    showToast('Plik Word zapisany.');
  } catch (e) {
    console.error('Word export failed:', e);
    showToast('Błąd generowania pliku Word.');
  } finally {
    if (btn) { btn.textContent = orig; btn.disabled = false; }
  }
}

// ============== Polish font loading ==============
let _fontB64 = null;
let _fontBoldB64 = null;

async function loadPolishFont() {
  if (_fontB64) return _fontB64;
  try {
    const resp = await fetch('https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf');
    const buf = await resp.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 4096) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 4096));
    }
    _fontB64 = btoa(binary);
    return _fontB64;
  } catch (e) {
    console.warn('Polish font failed, falling back:', e);
    return null;
  }
}

async function loadPolishFontBold() {
  if (_fontBoldB64) return _fontBoldB64;
  try {
    const resp = await fetch('https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf');
    const buf = await resp.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 4096) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 4096));
    }
    _fontBoldB64 = btoa(binary);
    return _fontBoldB64;
  } catch (e) {
    return null;
  }
}

// ============== PDF download ==============
async function downloadPdf() {
  if (typeof window.jspdf === 'undefined') { showToast('Biblioteka jsPDF się nie załadowała.'); return; }
  const btn = $('#dlPdf');
  const orig = btn?.textContent;
  if (btn) { btn.textContent = 'Generuję PDF…'; btn.disabled = true; }
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 56;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const usableW = pageW - margin * 2;
    let y = margin;

    const ex = buildExportText();

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

    doc.setFont(fontName, 'bold');
    doc.setFontSize(13);
    const titleLines = doc.splitTextToSize(ex.title, usableW);
    doc.text(titleLines, pageW / 2, y, { align: 'center' });
    y += 18 * titleLines.length;

    doc.setFont(fontName, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(110);
    doc.text(`Pacjent: ${ex.patient}    Data: ${ex.date}    Lekarz: ${ex.doctorName}`, pageW / 2, y, { align: 'center' });
    y += 18;
    doc.setDrawColor(180);
    doc.line(margin, y, pageW - margin, y);
    y += 18;
    doc.setTextColor(30);
    doc.setFontSize(11);

    const writeParagraph = (text, opts = {}) => {
      if (opts.bold) doc.setFont(fontName, 'bold');
      else doc.setFont(fontName, 'normal');
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
    showToast('Plik PDF zapisany.');
  } catch (e) {
    console.error('PDF export failed:', e);
    showToast('Błąd generowania PDF.');
  } finally {
    if (btn) { btn.textContent = orig; btn.disabled = false; }
  }
}

$('#dlWord')?.addEventListener('click', downloadWord);
$('#dlPdf')?.addEventListener('click', downloadPdf);

// ============== Toast ==============
let toastTimer = null;
function showToast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.hidden = false;
  void t.offsetHeight;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => { t.hidden = true; }, 240);
  }, 2600);
}

// ============== Boot ==============
initApp();
