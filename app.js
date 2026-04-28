/* ============================================================
   Opisy v4 — list view + workspace demo
   ============================================================ */

// ============== Utilities ==============
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return [...root.querySelectorAll(sel)]; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ============== Reports list data ==============
const REPORTS_LIST = [
  { id: 1, date: '28.04.2026', time: '14:30', patient: 'Anna Kowalska',        exam: 'MR kolana prawego',       status: 'in_progress' },
  { id: 2, date: '28.04.2026', time: '11:15', patient: 'Jan Nowak',             exam: 'MR barku',                status: 'done' },
  { id: 3, date: '27.04.2026', time: '16:45', patient: 'Maria Wiśniewska',      exam: 'MR kręgosłupa L-S',       status: 'done' },
  { id: 4, date: '27.04.2026', time: '09:00', patient: 'Piotr Zieliński',       exam: 'TK głowy',                status: 'done' },
  { id: 5, date: '25.04.2026', time: '13:20', patient: 'Katarzyna Dąbrowska',   exam: 'MR stawu skokowego',      status: 'done' },
  { id: 6, date: '25.04.2026', time: '10:00', patient: 'Tomasz Lewandowski',    exam: 'USG jamy brzusznej',      status: 'done' },
];

// ============== Master template (MR knee R) ==============
const MASTER_TEMPLATE = {
  id: 'mr_kolano_prawe',
  title: 'REZONANS MAGNETYCZNY KOLANA PRAWEGO',
  sections: [
    { id: 'wskazanie',  label: 'Wskazanie',
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

// ============== App state ==============
const state = {
  currentView: 'list',
  sections: [],
  isRecording: false,
  storyRunning: false,
  storyDone: false,
  manualStop: false,
};

// ============== View switching ==============
function showView(name) {
  state.currentView = name;
  $('#viewList').classList.toggle('hidden', name !== 'list');
  $('#viewWorkspace').classList.toggle('hidden', name !== 'workspace');
}

function openWorkspace() {
  showView('workspace');
  initWorkspace();
}

function goToList() {
  // Stop any running demo
  state.manualStop = true;
  state.storyRunning = false;
  showView('list');
}

// ============== List view render ==============
function renderList() {
  const table = $('#reportsTable');
  if (!table) return;
  table.innerHTML = REPORTS_LIST.map(r => {
    const badgeClass = r.status === 'done' ? 'status-badge--done' : 'status-badge--inprogress';
    const badgeText = r.status === 'done' ? 'Zakończony' : 'W trakcie';
    const activeClass = r.id === 1 ? 'report-row--active' : '';
    return `<div class="report-row ${activeClass}" data-report-id="${r.id}">
      <div class="report-row__datetime">${r.date}<span>${r.time}</span></div>
      <div class="report-row__info">
        <div class="report-row__patient">${escapeHtml(r.patient)}</div>
        <div class="report-row__exam">${escapeHtml(r.exam)}</div>
      </div>
      <span class="status-badge ${badgeClass}">${badgeText}</span>
    </div>`;
  }).join('');

  // Wire clicks — only first row opens workspace in this demo
  $$('.report-row', table).forEach(row => {
    row.addEventListener('click', () => {
      const id = Number(row.dataset.reportId);
      if (id === 1) openWorkspace();
    });
  });
}

// ============== Workspace init ==============
function initWorkspace() {
  // Reset state
  state.sections = clone(MASTER_TEMPLATE.sections);
  state.isRecording = false;
  state.storyRunning = false;
  state.storyDone = false;
  state.manualStop = false;
  _cleanupToastShown = false;
  transcriptBlock = null;

  // Reset transcript
  const tr = $('#transcript');
  if (tr) tr.innerHTML = '<div class="transcript__empty">Tu pojawią się słowa, które dyktuje radiolog…</div>';

  // Reset export buttons
  ['#dlWord', '#dlPdf'].forEach(sel => {
    const el = $(sel);
    if (el) { el.disabled = true; el.title = 'Dostępne po zakończeniu opisu'; el.classList.remove('pulsing'); }
  });

  // Reset done label
  const doneEl = $('#doneLabel');
  if (doneEl) { doneEl.textContent = ''; doneEl.classList.remove('visible'); }

  setMic(false, 'Gotowy');
  renderPaper();

  // Auto-start demo after 1.5s
  setTimeout(startDemo, 1500);
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
    const editable = !s.active ? 'contenteditable="true"' : '';
    return `<div class="section ${cls}" data-section="${s.id}">
      <p ${editable}>${html}</p>
    </div>`;
  }).join('');

  // Save edits on blur
  $$('.section p[contenteditable]', body).forEach(p => {
    p.addEventListener('blur', () => {
      const sid = p.closest('.section')?.dataset.section;
      const obj = state.sections.find(x => x.id === sid);
      if (obj) obj.text = p.innerText.trim();
    });
  });
}


// ============== Mic UI ==============
let micLevelId = null;

function setMic(active, statusText) {
  state.isRecording = active;
  $('#micBtn')?.classList.toggle('active', active);
  const status = $('#micStatus');
  const level = $('#micLevel');
  const dot = $('#liveDot');
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

// ============== Live transcript ==============
let transcriptBlock = null;

function clearTranscriptEmpty() {
  $('#transcript .transcript__empty')?.remove();
}

async function streamTranscript(text, perWordMs = 95) {
  clearTranscriptEmpty();
  const tr = $('#transcript');
  if (!tr) return;
  if (transcriptBlock) {
    transcriptBlock.classList.add('done');
    const br = document.createElement('span');
    br.className = 'transcript__break';
    tr.appendChild(br);
  }
  transcriptBlock = document.createElement('div');
  transcriptBlock.className = 'transcript__block';
  tr.appendChild(transcriptBlock);
  for (const w of text.split(/\s+/)) {
    if (state.manualStop) break;
    const span = document.createElement('span');
    span.className = 'transcript__word transcript__word--active';
    span.textContent = w;
    transcriptBlock.appendChild(span);
    tr.scrollTop = tr.scrollHeight;
    await sleep(perWordMs + Math.random() * 55);
  }
  $$('.transcript__word--active', transcriptBlock).forEach(w => {
    w.classList.remove('transcript__word--active');
    w.classList.add('transcript__word--done');
  });
}

// ============== Typewriter ==============
async function typewriterReplace(sectionEl, newText, charDelay = 22) {
  const p = sectionEl.querySelector('p');
  if (!p) return;
  p.classList.add('text--fading');
  await sleep(400);
  p.textContent = '';
  p.classList.remove('text--fading');
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.textContent = '▌';
  for (let i = 0; i < newText.length; i++) {
    if (newText[i] === '\n') {
      cursor.remove();
      p.appendChild(document.createElement('br'));
    } else {
      cursor.remove();
      p.appendChild(document.createTextNode(newText[i]));
    }
    p.appendChild(cursor);
    if (i % 40 === 0) sectionEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    const base = charDelay + (Math.random() * 10) - 5;
    await sleep(' ,.'.includes(newText[i]) ? base * 0.3 : base);
  }
  cursor.remove();
}

// ============== Dictation step ==============
async function runDictationStep(step) {
  const sec = state.sections.find(s => s.id === step.target);
  if (!sec) return;
  state.sections.forEach(s => s.active = false);
  sec.active = true;
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
  if (sectionEl) await typewriterReplace(sectionEl, step.newText);
  sec.active = false;
  sec.pending = false;
  sec.locked = true;
  sec.text = step.newText;
  if (sectionEl) {
    sectionEl.className = 'section section--locked';
    const p = sectionEl.querySelector('p');
    if (p) {
      p.contentEditable = 'true';
      p.addEventListener('blur', () => {
        const obj = state.sections.find(x => x.id === step.target);
        if (obj) obj.text = p.innerText.trim();
      });
    }
  }
  if (step.removeTargets?.length) await applyCleanup(step.removeTargets);
  setMic(false, 'Gotowy');
  flashSave();
}

// ============== Cleanup ==============
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
    if (el) el.classList.add('section--removing');
    await sleep(780);
    sec.removed = true;
    el?.remove();
  }
}

// ============== Save flash ==============
function flashSave() {
  const chip = $('#saveChipText');
  if (!chip) return;
  chip.textContent = 'Zapisuję…';
  setTimeout(() => { chip.textContent = 'Zapisane'; }, 700);
}

// ============== Full demo ==============
async function startDemo() {
  if (state.storyRunning || state.storyDone) return;
  state.storyRunning = true;
  for (const step of DICTATION_SCRIPT) {
    if (state.manualStop) break;
    await runDictationStep(step);
    await sleep(850);
  }
  state.storyRunning = false;
  state.storyDone = !state.manualStop;
  if (state.storyDone) {
    ['#dlWord', '#dlPdf'].forEach(sel => {
      const el = $(sel);
      if (el) { el.disabled = false; el.title = ''; }
    });
    setMic(false, 'Opis gotowy');
    $('#dlPdf')?.classList.add('pulsing');
    const doneEl = $('#doneLabel');
    if (doneEl) { doneEl.textContent = 'Opis gotowy'; doneEl.classList.add('visible'); }
    // Completion banner in paper
    const body = $('#paperBody');
    if (body) {
      const banner = document.createElement('div');
      banner.className = 'paper__banner';
      banner.textContent = 'Opis gotowy';
      body.insertBefore(banner, body.firstChild);
    }
  }
}

// ============== Speech Recognition ==============
let recognition = null;

function initSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.lang = 'pl-PL';
  r.continuous = true;
  r.interimResults = true;

  let currentBlock = null;

  r.onresult = (event) => {
    const tr = $('#transcript');
    if (!tr) return;
    clearTranscriptEmpty();

    if (!currentBlock) {
      currentBlock = document.createElement('div');
      currentBlock.className = 'transcript__block transcript__block--live';
      tr.appendChild(currentBlock);
    }

    let text = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      text += event.results[i][0].transcript;
    }
    currentBlock.textContent = text;
    tr.scrollTop = tr.scrollHeight;
  };

  r.onerror = (event) => {
    if (event.error === 'not-allowed') {
      showToast('Brak dostępu do mikrofonu');
    }
  };

  r.onend = () => {
    if (state.isRecording) r.start(); // auto-restart
    else {
      if (currentBlock) currentBlock.classList.add('done');
      currentBlock = null;
    }
  };

  return r;
}

function startRealRecording() {
  if (!recognition) recognition = initSpeechRecognition();
  if (!recognition) {
    showToast('Przeglądarka nie obsługuje rozpoznawania mowy');
    return false;
  }
  try {
    recognition.start();
    return true;
  } catch (e) {
    return false;
  }
}

function stopRealRecording() {
  if (recognition) {
    try { recognition.stop(); } catch (e) {}
  }
}

// ============== Push-to-talk (SPACE) ==============
document.addEventListener('keydown', (e) => {
  if (e.code !== 'Space' || e.repeat) return;
  if (state.currentView !== 'workspace') return;
  const ae = document.activeElement;
  if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) return;
  e.preventDefault();
  if (!state.isRecording) {
    startRealRecording();
    setMic(true, 'Nagrywam…');
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code !== 'Space') return;
  if (state.currentView !== 'workspace') return;
  const ae = document.activeElement;
  if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) return;
  e.preventDefault();
  if (state.isRecording && !state.storyRunning) {
    stopRealRecording();
    setMic(false, 'Gotowy');
  }
});

// ============== Mic button ==============
document.addEventListener('click', e => {
  if (!e.target.closest('#micBtn')) return;
  if (state.storyRunning) {
    state.manualStop = true;
    setMic(false, 'Zatrzymano');
    state.storyRunning = false;
  } else if (state.isRecording) {
    stopRealRecording();
    setMic(false, 'Gotowy');
  } else {
    if (startRealRecording()) {
      setMic(true, 'Nagrywam…');
    } else {
      setMic(true, 'Słucham…');
      setTimeout(() => setMic(false, 'Gotowy'), 1800);
    }
  }
});

// ============== Navigation ==============
document.addEventListener('click', e => {
  if (e.target.closest('#backBtn') || e.target.closest('#newExamBtn')) goToList();
});

// ============== Export helpers ==============
function buildExportData() {
  const readField = (field) => {
    const el = $(`[data-field="${field}"]`);
    return el ? el.textContent.trim() : '';
  };
  return {
    title: $('.doc-title')?.textContent?.trim() || MASTER_TEMPLATE.title,
    institution: $('.doc-institution span:first-child')?.textContent?.trim() || 'PRACOWNIA DIAGNOSTYKI OBRAZOWEJ',
    institutionAddr: $('.doc-institution__addr')?.textContent?.trim() || '',
    patientName: readField('patientName') || 'Anna Kowalska',
    pesel: readField('pesel') || '84062512345',
    sex: readField('sex') || 'K',
    age: readField('age') || '41 l.',
    date: readField('date') || '28.04.2026',
    doctorName: readField('doctor') || 'dr Kowalska',
    address: readField('address') || '',
    sections: state.sections.filter(s => !s.removed),
  };
}

function buildPlainText() {
  const ex = buildExportData();
  let out = ex.title + '\n' + '='.repeat(ex.title.length) + '\n\n';
  out += `Pacjent: ${ex.patientName}    PESEL: ${ex.pesel}    Data: ${ex.date}    Lekarz: ${ex.doctorName}\n\n`;
  for (const s of ex.sections) {
    if (s.id === 'wnioski') out += '\nWnioski:\n' + s.text + '\n';
    else out += s.text + '\n';
  }
  out += `\n\n                                           ${ex.doctorName}, radiolog\n`;
  return out;
}

function makeFileName(ext) {
  return `MR_Kolano_Prawe_Anna_Kowalska_28.04.2026.${ext}`;
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
    const ex = buildExportData();
    const children = [];
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
    showToast('Plik Word zapisany.');
  } catch (e) {
    console.error('Word export failed:', e);
    showToast('Błąd generowania pliku Word.');
  } finally {
    if (btn) { btn.textContent = orig; btn.disabled = false; }
  }
}

// ============== Polish font loading ==============
let _fontB64 = null, _fontBoldB64 = null;

async function loadFont(url, cache) {
  if (cache) return cache;
  try {
    const buf = await (await fetch(url)).arrayBuffer();
    const bytes = new Uint8Array(buf);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 4096)
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 4096));
    return btoa(bin);
  } catch { return null; }
}

async function loadPolishFont() {
  _fontB64 = await loadFont('https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf', _fontB64);
  return _fontB64;
}
async function loadPolishFontBold() {
  _fontBoldB64 = await loadFont('https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf', _fontBoldB64);
  return _fontBoldB64;
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
    const ex = buildExportData();
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

    const writeParagraph = (text, opts = {}) => {
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
    showToast('Plik PDF zapisany.');
  } catch (e) {
    console.error('PDF export failed:', e);
    showToast('Błąd generowania PDF.');
  } finally {
    if (btn) { btn.textContent = orig; btn.disabled = false; }
  }
}

document.addEventListener('click', e => {
  if (e.target.closest('#dlWord')) downloadWord();
  if (e.target.closest('#dlPdf')) downloadPdf();
});

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
renderList();
showView('list');

// Auto-open first report after 2s
setTimeout(() => {
  if (state.currentView === 'list') openWorkspace();
}, 2000);
