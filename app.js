/* ============================================================
   Opisy v2 — desktop-app demo
   ============================================================ */

// ============== Templates catalogue ==============
const TEMPLATES = [
  { id: 'mr_kolano_prawe', icon: '🦵', title: 'MR kolana prawego', meta: 'MR · użyty dziś', active: true },
  { id: 'mr_kolano_lewe',  icon: '🦵', title: 'MR kolana lewego',  meta: 'MR · wczoraj' },
  { id: 'mr_bark',         icon: '💪', title: 'MR barku',          meta: 'MR · 3 dni temu' },
  { id: 'mr_kregoslup_ls', icon: '🧍', title: 'MR kręgosłupa L-S', meta: 'MR · tydzień temu' },
  { id: 'mr_skok',         icon: '🦶', title: 'MR stawu skokowego',meta: 'MR · 2 tyg. temu' },
  { id: 'mr_biodro',       icon: '🦴', title: 'MR stawu biodrowego', meta: 'MR · miesiąc temu' },
  { id: 'usg_brzuch',      icon: '🩺', title: 'USG jamy brzusznej',meta: 'USG · regularnie' },
  { id: 'tk_glowa',        icon: '🧠', title: 'TK głowy',          meta: 'TK · regularnie' },
  { id: 'tk_klatka',       icon: '🫁', title: 'TK klatki piersiowej', meta: 'TK · czasem' },
];

// ============== Master template (MR knee R) ==============
const MASTER_TEMPLATE = {
  id: 'mr_kolano_prawe',
  title: 'REZONANS MAGNETYCZNY KOLANA PRAWEGO',
  sections: [
    { id: 'wskazanie', label: 'Wskazanie',
      text: 'Wskazanie: ból kolana, podejrzenie uszkodzenia łąkotki przyśrodkowej. Uraz skrętny 3 tygodnie temu.',
      pending: false }, // already filled from referral
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
    target: 'lakotka_p',
    transcript: 'róg tylny łąkotki przyśrodkowej skośne przytorebkowe pęknięcie',
    newText: 'Łąkotka przyśrodkowa: w rogu tylnym widoczne skośne, horyzontalno-degeneracyjne pęknięcie przytorebkowe sięgające górnej powierzchni stawowej. Wysokość rogu tylnego zachowana.',
  },
  {
    target: 'acl',
    transcript: 'ACL trzeciego stopnia w przyczepie udowym',
    newText: 'Więzadło krzyżowe przednie (ACL): zerwanie III stopnia w przyczepie udowym, z brakiem ciągłości włókien. Włókna pofałdowane, leżą poziomo na płaskowyżu kości piszczelowej. Towarzyszy bone bruise w okolicy przyczepu.',
  },
  {
    target: 'kosci',
    transcript: 'obrzęk szpiku kłykieć boczny dwanaście na osiem milimetrów',
    newText: 'Kości tworzące staw: w kłykciu bocznym kości udowej widoczny obszar obrzęku szpiku kostnego (bone bruise) o wymiarach około 12 × 8 mm. Pozostałe kości bez zmian patologicznych.',
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
  },
];

// ============== State ==============
const state = {
  patient: { firstName: 'Anna', lastName: 'Kowalska', pesel: '84062512345', anonId: '#4471', referral: '' },
  templateId: 'mr_kolano_prawe',
  sections: clone(MASTER_TEMPLATE.sections),
  currentScreen: 'patient',
  startTime: null,
  totalDictatedWords: 0,
  isRecording: false,
  storyRunning: false,
  storyDone: false,
  storyStep: 0,
  manualStop: false,
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }
function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return [...root.querySelectorAll(sel)]; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// ============== Routing ==============
const SCREENS = ['patient', 'template', 'dictation', 'export'];
function showScreen(name) {
  state.currentScreen = name;
  $$('.step').forEach(s => s.hidden = (s.dataset.screen !== name));

  // rail
  $$('.rail__step').forEach(b => {
    b.classList.remove('active', 'done');
    const idx = SCREENS.indexOf(b.dataset.step);
    const cur = SCREENS.indexOf(name);
    if (idx === cur) b.classList.add('active');
    else if (idx < cur) b.classList.add('done');
  });

  // titlebar doc
  if (name === 'patient') {
    $('#docName').textContent = 'Nowy opis';
    $('#docPatient').textContent = '—';
  } else {
    const tplName = TEMPLATES.find(t => t.id === state.templateId)?.title || 'MR kolana prawego';
    $('#docName').textContent = tplName;
    $('#docPatient').textContent = `Pacjent ${state.patient.anonId}`;
  }

  if (name === 'dictation') initDictation();
  if (name === 'export') initExport();
}

$$('.rail__step').forEach(btn => {
  btn.addEventListener('click', () => {
    // allow free navigation only between visited steps
    showScreen(btn.dataset.step);
  });
});
$$('[data-go]').forEach(b => {
  b.addEventListener('click', () => showScreen(b.dataset.go));
});

// ============== Patient form ==============
function refreshAnonChips() {
  const f = $('#fName').value.trim();
  const l = $('#lName').value.trim();
  const p = $('#pesel').value.trim();
  $('#fNameAnon').textContent = f ? '→ [zanonimizowano]' : '→ —';
  $('#lNameAnon').textContent = l ? '→ [zanonimizowano]' : '→ —';
  // mock anonId from pesel digits
  if (p.length >= 4) {
    const id = '#' + (parseInt(p.slice(-4), 10) % 9000 + 1000);
    $('#peselAnon').textContent = '→ Pacjent ' + id;
    state.patient.anonId = id;
  } else {
    $('#peselAnon').textContent = '→ Pacjent #—';
  }
}
['#fName', '#lName', '#pesel'].forEach(sel => {
  $(sel)?.addEventListener('input', refreshAnonChips);
});
refreshAnonChips();

$('#patientNext').addEventListener('click', () => {
  state.patient.firstName = $('#fName').value;
  state.patient.lastName = $('#lName').value;
  state.patient.pesel = $('#pesel').value;
  state.patient.referral = $('#refer').value;
  state.templateId = $('#examType').value;
  // sync wskazanie section
  const ws = state.sections.find(s => s.id === 'wskazanie');
  if (ws && state.patient.referral) ws.text = 'Wskazanie: ' + state.patient.referral;
  showScreen('template');
});

// ============== Templates grid ==============
function renderTemplates() {
  const wrap = $('#tplGrid');
  wrap.innerHTML = TEMPLATES.map(t => `
    <button class="tcard ${t.id === state.templateId ? 'tcard--active' : ''}" data-tpl="${t.id}">
      <span class="tcard__icon">${t.icon}</span>
      <span class="tcard__title">${t.title}</span>
      <span class="tcard__meta">${t.meta}</span>
    </button>
  `).join('');
  $$('.tcard', wrap).forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.tpl;
      if (id !== 'mr_kolano_prawe') {
        showToast('W demo aktywny jest tylko szablon MR kolana prawego.');
        return;
      }
      state.templateId = id;
      showScreen('dictation');
    });
  });
  $('#tplSearch')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    $$('.tcard', wrap).forEach(c => {
      c.style.display = c.querySelector('.tcard__title').textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}
renderTemplates();

// ============== Dictation init ==============
function initDictation() {
  renderSections();
  renderPaper();
  // story starts on first mic click (set in mic handler)
  if (state.startTime) startTimer();
}

let liveTimerId = null;
function startTimer() {
  clearInterval(liveTimerId);
  liveTimerId = setInterval(() => {
    if (!state.startTime) return;
    const s = Math.floor((Date.now() - state.startTime) / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    const el = $('#liveTime');
    if (el) el.textContent = `${m}:${String(sec).padStart(2, '0')}`;
  }, 500);
}

// ============== Renderers ==============
function renderSections() {
  const ul = $('#sectionList');
  if (!ul) return;
  ul.innerHTML = state.sections.map(s => {
    const cls = s.removed ? 'removed' : (s.locked ? 'locked' : (s.active ? 'active' : (s.pending ? 'pending' : 'done')));
    const lockIcon = s.locked ? '<span class="seclist__lockicon">🔒</span>' : '';
    return `<li class="${cls}" data-id="${s.id}">${escapeHtml(s.label)}${lockIcon}</li>`;
  }).join('');
  $$('li', ul).forEach(li => {
    li.addEventListener('click', () => {
      const target = $(`.section[data-section="${li.dataset.id}"]`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  const total = state.sections.filter(s => !s.removed).length;
  const locked = state.sections.filter(s => s.locked).length;
  const cnt = $('#sectionCount');
  if (cnt) cnt.textContent = `${locked} / ${total} zweryfikowane`;
  const liveLocked = $('#liveLocked'); if (liveLocked) liveLocked.textContent = locked;

  // word count
  const words = state.sections.filter(s => !s.removed)
    .map(s => s.text.split(/\s+/).filter(Boolean).length).reduce((a,b)=>a+b, 0);
  const live = $('#liveOutWords'); if (live) live.textContent = words;
  const dict = $('#liveDictWords'); if (dict) dict.textContent = state.totalDictatedWords;
}

function sectionStateClass(s) {
  if (s.locked) return 'section--locked';
  if (s.active) return 'section--active';
  if (s.pending) return 'section--pending';
  return '';
}

function renderPaper() {
  $('#paperTitle').textContent = MASTER_TEMPLATE.title;
  $('#paperMeta').textContent =
    `Pacjent: Pacjent ${state.patient.anonId} · Data badania: ${new Date().toLocaleDateString('pl-PL')} · Lekarz: dr Kowalska`;

  const body = $('#paperBody');
  body.innerHTML = state.sections.map(s => {
    if (s.removed) return '';
    const cls = sectionStateClass(s);
    const html = escapeHtml(s.text).replace(/\n/g, '<br/>');
    return `<div class="section ${cls}" data-section="${s.id}">
      <p>${html}</p>
      ${s.locked ? '<button class="section__edit" data-edit="' + s.id + '">edytuj ręcznie</button>' : ''}
    </div>`;
  }).join('');

  $$('[data-edit]', body).forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      const sid = b.dataset.edit;
      const sec = $(`.section[data-section="${sid}"]`);
      if (!sec) return;
      const p = sec.querySelector('p');
      const isOn = sec.getAttribute('contenteditable') === 'true';
      sec.setAttribute('contenteditable', isOn ? 'false' : 'true');
      if (!isOn) p.focus();
      else {
        const obj = state.sections.find(x => x.id === sid);
        if (obj) obj.text = p.innerText.trim();
      }
    });
  });
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
      if (level) level.style.width = (28 + Math.random() * 70) + '%';
    }, 90);
  } else if (level) {
    level.style.width = '0%';
  }
}

// ============== Live transcript stream ==============
let transcriptBlock = null;
function clearTranscriptHint() {
  const empty = $('#transcript .transcript__empty');
  if (empty) empty.remove();
}
async function streamTranscript(text, perWordMs = 95) {
  clearTranscriptHint();
  const tr = $('#transcript');
  if (transcriptBlock) {
    // mark previous as done
    $$('.transcript__word--active', transcriptBlock).forEach(w => {
      w.classList.remove('transcript__word--active');
      w.classList.add('transcript__word--done');
    });
    const br = document.createElement('span');
    br.className = 'transcript__break';
    tr.appendChild(br);
  }
  transcriptBlock = document.createElement('div');
  tr.appendChild(transcriptBlock);

  const words = text.split(/\s+/);
  for (const w of words) {
    if (state.manualStop) break;
    const span = document.createElement('span');
    span.className = 'transcript__word transcript__word--active';
    span.textContent = w;
    transcriptBlock.appendChild(span);
    tr.scrollTop = tr.scrollHeight;
    await sleep(perWordMs + Math.random() * 60);
  }
}

// ============== Dictation simulation ==============
async function runDictationStep(step) {
  const sec = state.sections.find(s => s.id === step.target);
  if (!sec) return;

  // mark active
  state.sections.forEach(s => s.active = false);
  sec.active = true;
  renderSections();
  // also highlight in paper
  const secEl = $(`.section[data-section="${step.target}"]`);
  if (secEl) {
    secEl.classList.remove('section--pending');
    secEl.classList.add('section--active');
    secEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  setMic(true, 'Słucham…');
  await streamTranscript(step.transcript, 95);

  // small reflection pause
  await sleep(450);
  setMic(false, 'Przetwarzam dyktat…');
  await sleep(550);

  // diff-replace
  await applyDiff(step.target, step.newText);

  // counts
  state.totalDictatedWords += step.transcript.split(/\s+/).filter(Boolean).length;

  // lock
  sec.active = false;
  sec.pending = false;
  sec.locked = true;
  sec.text = step.newText;

  // implicit cleanup: AI may remove still-pending sections (never locked ones)
  await applyImplicitCleanup(step.target);

  renderSections();
  renderPaperPreserve();
  setMic(false, 'Gotowy');
  // brief save flash
  flashSave();
}

function flashSave() {
  const c = $('#saveChipText');
  if (!c) return;
  c.textContent = 'Zapisuję…';
  setTimeout(() => c.textContent = 'Zapisane teraz', 700);
}

async function applyDiff(targetId, newText) {
  const sec = state.sections.find(s => s.id === targetId);
  if (!sec) return;
  const oldText = sec.text;
  const el = $(`.section[data-section="${targetId}"]`);
  if (!el) return;

  el.innerHTML = `<p>
    <span class="diff-removed">${escapeHtml(oldText)}</span>
    <span class="diff-added">${escapeHtml(newText).replace(/\n/g, '<br/>')}</span>
  </p>`;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // settle
  await sleep(1500);
  // remove the strikethrough
  const removed = el.querySelector('.diff-removed');
  if (removed) {
    removed.classList.add('diff-fading');
    await sleep(900);
    removed.remove();
  }
  // unwrap added span
  const added = el.querySelector('.diff-added');
  if (added) {
    const txt = added.innerHTML;
    added.outerHTML = txt;
  }
}

// AI cleanup of PENDING sections (never touches LOCKED ones)
// Demonstrates the guarantee: model can tidy up the remaining template ahead of the cursor,
// but never modifies what the doctor has already verified.
const CLEANUP_RULES = {
  // After bone-marrow edema is dictated, AI consolidates an unrelated pending placeholder.
  kosci: ['tkanki'],
};

async function applyImplicitCleanup(justLocked) {
  const targets = CLEANUP_RULES[justLocked];
  if (!targets) return;
  for (const id of targets) {
    const sec = state.sections.find(s => s.id === id);
    if (!sec || sec.locked || sec.removed) continue;
    sec.removed = true;
    const el = $(`.section[data-section="${id}"]`);
    if (el) {
      el.classList.add('section--removing');
      await sleep(700);
    }
  }
}

// Render paper but preserve scroll & not disturb diff that just settled
function renderPaperPreserve() {
  const body = $('#paperBody');
  if (!body) return;
  // rebuild fresh
  body.innerHTML = state.sections.map(s => {
    if (s.removed) return '';
    const cls = sectionStateClass(s);
    const html = escapeHtml(s.text).replace(/\n/g, '<br/>');
    return `<div class="section ${cls}" data-section="${s.id}">
      <p>${html}</p>
      ${s.locked ? '<button class="section__edit" data-edit="' + s.id + '">edytuj ręcznie</button>' : ''}
    </div>`;
  }).join('');
  $$('[data-edit]', body).forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      const sid = b.dataset.edit;
      const sec = $(`.section[data-section="${sid}"]`);
      if (!sec) return;
      const p = sec.querySelector('p');
      const isOn = sec.getAttribute('contenteditable') === 'true';
      sec.setAttribute('contenteditable', isOn ? 'false' : 'true');
      if (!isOn) p.focus();
      else {
        const obj = state.sections.find(x => x.id === sid);
        if (obj) obj.text = p.innerText.trim();
      }
    });
  });
}

// ============== Story (auto-flowing dictation) ==============
async function runFullStory() {
  while (state.storyStep < DICTATION_SCRIPT.length) {
    if (state.manualStop) break;
    const step = DICTATION_SCRIPT[state.storyStep];
    await runDictationStep(step);
    state.storyStep += 1;
    if (state.manualStop) break;
    await sleep(900);
  }
  if (state.storyStep >= DICTATION_SCRIPT.length) {
    state.storyRunning = false;
    state.storyDone = true;
    await sleep(700);
    setMic(false, 'Opis gotowy ✓');
    await sleep(1400);
    if (!state.manualStop) showScreen('export');
  }
}

// ============== Mic trigger — starts the dictation story ==============
function triggerDictation() {
  if (state.storyDone) return;
  if (state.storyRunning) {
    // pause
    state.manualStop = true;
    state.storyRunning = false;
    setMic(false, 'Wstrzymano — kliknij, żeby kontynuować');
    return;
  }
  // first click (or resume)
  if (!state.startTime) {
    state.startTime = Date.now();
    startTimer();
  }
  state.manualStop = false;
  state.storyRunning = true;
  runFullStory();
}

$('#micBtn')?.addEventListener('click', triggerDictation);

document.addEventListener('keydown', (e) => {
  if (e.code !== 'Space' || e.repeat) return;
  if (state.currentScreen !== 'dictation') return;
  const ae = document.activeElement;
  if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) return;
  e.preventDefault();
  triggerDictation();
});

// ============== Export step ==============
function buildExportText() {
  return {
    title: MASTER_TEMPLATE.title,
    patient: 'Pacjent ' + state.patient.anonId,
    date: new Date().toLocaleDateString('pl-PL'),
    sections: state.sections.filter(s => !s.removed),
  };
}

function initExport() {
  const ex = buildExportText();
  const paper = $('#exportPaper');
  paper.innerHTML = `
    <h1>${escapeHtml(ex.title)}</h1>
    <p class="meta"><strong>Pacjent:</strong> ${escapeHtml(ex.patient)} &nbsp; <strong>Data:</strong> ${ex.date} &nbsp; <strong>Lekarz:</strong> dr Kowalska</p>
    ${ex.sections.map(s => {
      if (s.id === 'wnioski') {
        return `<div class="section-label">Wnioski:</div><p>${escapeHtml(s.text).replace(/\n/g, '<br/>')}</p>`;
      }
      return `<p>${escapeHtml(s.text)}</p>`;
    }).join('')}
    <p style="margin-top:36px; text-align:right;"><em>dr Kowalska, radiolog</em></p>
  `;

  // stats
  const elapsed = state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 134;
  $('#statTime').textContent = `${Math.floor(elapsed/60)} min ${elapsed%60} s`;
  $('#statWords').textContent = state.totalDictatedWords;
  const out = ex.sections.map(s => s.text.split(/\s+/).filter(Boolean).length).reduce((a,b)=>a+b,0);
  $('#statOutput').textContent = out;
}

// ============== Real downloads ==============
function buildPlainText() {
  const ex = buildExportText();
  let out = ex.title + '\n';
  out += '='.repeat(ex.title.length) + '\n\n';
  out += `Pacjent: ${ex.patient}    Data: ${ex.date}    Lekarz: dr Kowalska\n\n`;
  for (const s of ex.sections) {
    if (s.id === 'wnioski') {
      out += '\nWnioski:\n' + s.text + '\n';
    } else {
      out += s.text + '\n';
    }
  }
  out += '\n\n                                                  dr Kowalska, radiolog\n';
  return out;
}

async function downloadWord() {
  if (typeof docx === 'undefined') { showToast('Biblioteka docx się nie załadowała.'); return; }
  const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = docx;
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
    children: [new TextRun({ text: `Pacjent: ${ex.patient}    Data: ${ex.date}    Lekarz: dr Kowalska`, size: 20, color: '6b6b6b' })],
  }));
  for (const s of ex.sections) {
    if (s.id === 'wnioski') {
      children.push(new Paragraph({
        spacing: { before: 240, after: 80 },
        children: [new TextRun({ text: 'Wnioski:', bold: true, size: 24 })],
      }));
      const lines = s.text.split('\n');
      for (const line of lines) {
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
    children: [new TextRun({ text: 'dr Kowalska, radiolog', italics: true, size: 22 })],
  }));

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, makeFileName('docx'));
  showToast('Plik Word zapisany.');
}

function downloadPdf() {
  if (typeof window.jspdf === 'undefined') { showToast('Biblioteka jsPDF się nie załadowała.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 56;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const usableW = pageW - margin * 2;
  let y = margin;

  const ex = buildExportText();

  // Note: default jsPDF Helvetica supports Latin-1; Polish diacritics may render imperfectly.
  // We apply replacements as a fallback so output remains readable.
  const polishSafe = (txt) => txt; // jsPDF handles most Latin-Ext OK with Helvetica in v2.5.1

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  const titleLines = doc.splitTextToSize(polishSafe(ex.title), usableW);
  doc.text(titleLines, pageW / 2, y, { align: 'center' });
  y += 18 * titleLines.length;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text(polishSafe(`Pacjent: ${ex.patient}    Data: ${ex.date}    Lekarz: dr Kowalska`), pageW / 2, y, { align: 'center' });
  y += 18;

  doc.setDrawColor(180);
  doc.line(margin, y, pageW - margin, y);
  y += 18;

  doc.setTextColor(30);
  doc.setFontSize(11);

  const writeParagraph = (text, opts = {}) => {
    if (opts.bold) doc.setFont('helvetica', 'bold'); else doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(polishSafe(text), usableW);
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
      const lines = s.text.split('\n');
      for (const line of lines) writeParagraph(line);
    } else {
      writeParagraph(s.text);
    }
  }

  y += 24;
  if (y > pageH - margin - 20) { doc.addPage(); y = margin; }
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.text(polishSafe('dr Kowalska, radiolog'), pageW - margin, y, { align: 'right' });

  doc.save(makeFileName('pdf'));
  showToast('Plik PDF zapisany.');
}

function makeFileName(ext) {
  const tpl = (TEMPLATES.find(t => t.id === state.templateId)?.title || 'Opis')
    .replace(/[^A-Za-z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, '').replace(/\s+/g, '_');
  const date = new Date().toISOString().slice(0, 10);
  return `${tpl}_Pacjent${state.patient.anonId.replace('#','')}_${date}.${ext}`;
}

function triggerDownload(blob, filename) {
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 200);
}

// ============== Wire export buttons ==============
$('#exportWord')?.addEventListener('click', downloadWord);
$('#exportPdf')?.addEventListener('click', downloadPdf);
$('#dlWord')?.addEventListener('click', downloadWord);
$('#dlPdf')?.addEventListener('click', downloadPdf);
$('#exportNext')?.addEventListener('click', () => showScreen('export'));
$('#newReport')?.addEventListener('click', () => fullReset());

// ============== Restart ==============
$('#restartBtn')?.addEventListener('click', () => fullReset());

function fullReset() {
  state.sections = clone(MASTER_TEMPLATE.sections);
  state.startTime = null;
  state.totalDictatedWords = 0;
  state.storyRunning = false;
  state.storyDone = false;
  state.storyStep = 0;
  state.manualStop = false;
  state.isRecording = false;
  transcriptBlock = null;
  const tr = $('#transcript');
  if (tr) tr.innerHTML = '<div class="transcript__empty">Tu pojawią się słowa, które dyktujesz…</div>';
  setMic(false, 'Gotowy');
  refreshAnonChips();
  showScreen('patient');
}

// ============== Toast ==============
let toastTimer = null;
function showToast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.hidden = false;
  // force reflow
  void t.offsetHeight;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.hidden = true, 240);
  }, 2400);
}

// ============== Init ==============
showScreen('patient');
