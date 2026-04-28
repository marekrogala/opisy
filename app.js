/* ============================================================
   Opisy v2 — desktop-app demo
   ============================================================ */

// ============== Templates catalogue ==============
const TEMPLATES = [
  { id: 'mr_kolano_prawe', icon: 'MR', title: 'MR kolana prawego',      meta: '12 sekcji · ostatnio dziś', active: true },
  { id: 'mr_kolano_lewe',  icon: 'MR', title: 'MR kolana lewego',       meta: '12 sekcji · ostatnio wczoraj' },
  { id: 'mr_bark',         icon: 'MR', title: 'MR barku',               meta: '10 sekcji · ostatnio 25.04' },
  { id: 'mr_kregoslup_ls', icon: 'MR', title: 'MR kręgosłupa L-S',      meta: '14 sekcji · ostatnio 21.04' },
  { id: 'mr_skok',         icon: 'MR', title: 'MR stawu skokowego',     meta: '11 sekcji · ostatnio 18.04' },
  { id: 'mr_biodro',       icon: 'MR', title: 'MR stawu biodrowego',    meta: '11 sekcji · ostatnio 10.04' },
  { id: 'usg_brzuch',      icon: 'USG', title: 'USG jamy brzusznej',    meta: '10 sekcji · ostatnio 24.04' },
  { id: 'tk_glowa',        icon: 'TK', title: 'TK głowy',               meta: '9 sekcji · ostatnio 23.04' },
  { id: 'tk_klatka',       icon: 'TK', title: 'TK klatki piersiowej',   meta: '10 sekcji · ostatnio 15.04' },
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
    // Quick early "correction" step — locks immediately, demonstrates lock-after-verify.
    // Doctor verifies a normal finding upfront; AI must NOT modify this section later.
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
    // PCL pending "prawidłowe" stays — separate structure, still relevant clinically.
    // Drop MCL — once a major ACL rupture is dictated, the generic "MCL/LCL prawidłowe"
    // line is template noise the AI can prune from yet-unverified content.
    removeTargets: ['mcl'],
  },
  {
    target: 'kosci',
    transcript: 'obrzęk szpiku kłykieć boczny dwanaście na osiem milimetrów',
    newText: 'Kości tworzące staw: w kłykciu bocznym kości udowej widoczny obszar obrzęku szpiku kostnego (bone bruise) o wymiarach około 12 × 8 mm. Pozostałe kości bez zmian patologicznych.',
    // Chrząstka still reads "bez cech istotnego uszkodzenia" — redundant pending default once
    // bone-level pathology is described in same compartment. Prune it.
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
    // Wnioski summarize the rest — drop any remaining pending "prawidłowy/bez zmian" defaults.
    // pcl is still pending ("prawidłowe"), tkanki is still pending ("bez zmian").
    // lakotka_b was dictated/locked early so it stays.
    removeTargets: ['pcl', 'tkanki'],
  },
];

// ============== State ==============
const state = {
  patient: { firstName: 'Anna', lastName: 'Kowalska', pesel: '84062512345', anonId: '#4471', referral: '', doctorName: 'dr Kowalska' },
  templateId: 'mr_kolano_prawe',
  sections: clone(MASTER_TEMPLATE.sections),
  currentScreen: 'patient',
  startTime: null,
  totalDictatedWords: 0,
  isRecording: false,
  storyRunning: false,
  storyDone: false,
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
    if (state.storyRunning) return; // block navigation during auto-demo
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
  const footerAnon = $('#footerAnonId');
  if (footerAnon) footerAnon.textContent = 'Pacjent ' + state.patient.anonId;
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
  state.patient.doctorName = $('#doctorName').value || state.patient.doctorName;
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
    <button class="tcard ${t.id === state.templateId ? 'tcard--active' : ''} ${!t.active ? 'tcard--disabled' : ''}" data-tpl="${t.id}">
      <span class="tcard__icon tcard__icon--badge">${t.icon}</span>
      <span class="tcard__title">${t.title}</span>
      <span class="tcard__meta">${t.meta}</span>
    </button>
  `).join('');
  $$('.tcard', wrap).forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.tpl;
      if (id !== 'mr_kolano_prawe') return;
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
  if (!state.startTime) state.startTime = Date.now();
  renderSections();
  renderPaper();
  // auto-run story once
  if (!state.storyRunning && !state.storyDone) {
    state.storyRunning = true;
    setTimeout(runFullStory, 300);
  }
}

// ============== Renderers ==============
function renderSections() {
  const ul = $('#sectionList');
  if (!ul) return;
  ul.innerHTML = state.sections.map(s => {
    const cls = s.removed ? 'removed' : (s.locked ? 'locked' : (s.active ? 'active' : (s.pending ? 'pending' : 'done')));
    const lockIcon = s.locked ? '<span class="seclist__lockicon"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>' : '';
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
}

function sectionStateClass(s) {
  if (s.locked) return 'section--locked';
  if (s.active) return 'section--active';
  if (s.pending) return 'section--pending';
  return '';
}

function renderPaper(preserveScroll = false) {
  $('#paperTitle').textContent = MASTER_TEMPLATE.title;
  $('#paperMeta').textContent =
    `Pacjent: Pacjent ${state.patient.anonId} · Data badania: ${new Date().toLocaleDateString('pl-PL')} · Lekarz: ${state.patient.doctorName}`;

  const body = $('#paperBody');
  if (!body) return;
  const scrollTop = preserveScroll ? body.scrollTop : 0;

  body.innerHTML = state.sections.map(s => {
    if (s.removed) return '';
    const cls = sectionStateClass(s);
    const html = escapeHtml(s.text).replace(/\n/g, '<br/>');
    return `<div class="section ${cls}" data-section="${s.id}">
      <p>${html}</p>
      ${s.locked ? '<button class="section__edit" data-edit="' + s.id + '">edytuj ręcznie</button>' : ''}
    </div>`;
  }).join('');

  if (preserveScroll) body.scrollTop = scrollTop;

  $$('[data-edit]', body).forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      const sid = b.dataset.edit;
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
    transcriptBlock.classList.add('transcript__done');
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
  if (step.showLockToast) showToast('Sekcja zablokowana — model jej nie zmieni');

  // implicit cleanup: remove any pending sections that are contradicted
  await applyImplicitCleanup(step);

  renderSections();
  renderPaper(true);
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

let _cleanupToastShown = false;
async function applyImplicitCleanup(step) {
  if (!step.removeTargets || !step.removeTargets.length) return;
  if (!_cleanupToastShown) {
    _cleanupToastShown = true;
    showToast('AI usunął nieistotne linie szablonu');
  }
  for (const targetId of step.removeTargets) {
    const sec = state.sections.find(s => s.id === targetId);
    if (!sec || sec.locked || sec.removed) continue;
    const el = $(`.section[data-section="${targetId}"]`);
    if (el) {
      el.classList.add('section--removing');
      const li = $(`#sectionList li[data-id="${targetId}"]`);
      if (li) li.classList.add('removed');
    }
    await sleep(750);
    sec.removed = true;
    if (el) el.remove();
  }
}

// ============== Story (auto demo) ==============
async function runFullStory() {
  // Disable export panel during dictation
  const exportPanelEl = $('.export-panel');
  if (exportPanelEl) exportPanelEl.classList.add('export-panel--disabled');

  // Disable export buttons during dictation
  const exportBtns = ['#exportNext', '#dlWord', '#dlPdf'];
  exportBtns.forEach(sel => {
    const el = $(sel);
    if (el) { el.disabled = true; el.title = 'Dostępne po zakończeniu opisu'; }
  });

  for (const step of DICTATION_SCRIPT) {
    if (state.manualStop) break;
    await runDictationStep(step);
    await sleep(900);
  }
  state.storyRunning = false;
  state.storyDone = true;
  // Re-enable export panel and buttons
  if (exportPanelEl) exportPanelEl.classList.remove('export-panel--disabled');
  exportBtns.forEach(sel => {
    const el = $(sel);
    if (el) { el.disabled = false; el.title = ''; }
  });
  setMic(false, 'Opis gotowy');

  // show finale banner on paper
  const paper = $('#paper');
  if (paper) {
    const banner = document.createElement('div');
    banner.className = 'paper__banner';
    const locked = state.sections.filter(s => s.locked).length;
    const total = state.sections.filter(s => !s.removed).length;
    const elapsed = state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 0;
    banner.innerHTML = `<span>Opis gotowy · ${locked}/${total} zweryfikowane</span><div class="banner__progress" style="animation-duration:10s"></div>`;
    paper.prepend(banner);
  }

  // pulse the export button
  const exportBtn = $('#exportNext');
  if (exportBtn) exportBtn.classList.add('btn--pulse');

  // update mic hint
  const hint = $('.mic__hint');
  if (hint) hint.innerHTML = 'Demo zakończone. Kliknij <strong>Zakończ i wyeksportuj</strong> lub poczekaj.';

  // auto-advance after 10s unless user already navigated
  const cancelAdvance = () => { state.manualStop = true; };
  $('#paper')?.addEventListener('click', cancelAdvance, { once: true });
  await sleep(10000);
  if (!state.manualStop && state.currentScreen === 'dictation') showScreen('export');
}

// ============== Manual mic mode ==============
$('#micBtn')?.addEventListener('click', () => {
  if (state.storyRunning) {
    state.manualStop = true;
    setMic(false, 'Gotowy');
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

document.addEventListener('keydown', (e) => {
  if (e.code !== 'Space' || e.repeat) return;
  if (state.currentScreen !== 'dictation') return;
  const ae = document.activeElement;
  if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) return;
  e.preventDefault();
  setMic(true, 'Słucham… (puść SPACJĘ, żeby zakończyć)');
});
document.addEventListener('keyup', (e) => {
  if (e.code !== 'Space') return;
  if (state.currentScreen !== 'dictation') return;
  const ae = document.activeElement;
  if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) return;
  e.preventDefault();
  if (state.isRecording) {
    setMic(false, 'Przetwarzam…');
    setTimeout(() => setMic(false, 'Gotowy'), 700);
  }
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
    <p class="meta"><strong>Pacjent:</strong> ${escapeHtml(ex.patient)} &nbsp; <strong>Data:</strong> ${ex.date} &nbsp; <strong>Lekarz:</strong> ${escapeHtml(state.patient.doctorName)}</p>
    ${ex.sections.map(s => {
      if (s.id === 'wnioski') {
        return `<div class="section-label">Wnioski:</div><p>${escapeHtml(s.text).replace(/\n/g, '<br/>')}</p>`;
      }
      return `<p>${escapeHtml(s.text)}</p>`;
    }).join('')}
    <p style="margin-top:36px; text-align:right;"><em>${escapeHtml(state.patient.doctorName)}, radiolog</em></p>
  `;

}

// ============== Real downloads ==============
function buildPlainText() {
  const ex = buildExportText();
  let out = ex.title + '\n';
  out += '='.repeat(ex.title.length) + '\n\n';
  out += `Pacjent: ${ex.patient}    Data: ${ex.date}    Lekarz: ${state.patient.doctorName}\n\n`;
  for (const s of ex.sections) {
    if (s.id === 'wnioski') {
      out += '\nWnioski:\n' + s.text + '\n';
    } else {
      out += s.text + '\n';
    }
  }
  out += `\n\n                                                  ${state.patient.doctorName}, radiolog\n`;
  return out;
}

async function downloadWord() {
  if (typeof docx === 'undefined') { showToast('Biblioteka docx się nie załadowała.'); return; }
  const wordBtn = $('#exportWord') || $('#dlWord');
  const origText = wordBtn?.textContent;
  if (wordBtn) { wordBtn.textContent = 'Generuję Word…'; wordBtn.disabled = true; }
  try {
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
      children: [new TextRun({ text: `Pacjent: ${ex.patient}    Data: ${ex.date}    Lekarz: ${state.patient.doctorName}`, size: 20, color: '6b6b6b' })],
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
      children: [new TextRun({ text: `${state.patient.doctorName}, radiolog`, italics: true, size: 22 })],
    }));

    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    triggerDownload(blob, makeFileName('docx'));
    showToast('Plik Word zapisany.');
  } catch (e) {
    console.error('Word export failed:', e);
    showToast('Błąd generowania pliku Word.');
  } finally {
    if (wordBtn) { wordBtn.textContent = origText; wordBtn.disabled = false; }
  }
}

let _fontBase64Cache = null;
async function loadPolishFont() {
  if (_fontBase64Cache) return _fontBase64Cache;
  try {
    const resp = await fetch('https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf');
    const buf = await resp.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 4096) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 4096));
    }
    _fontBase64Cache = btoa(binary);
    return _fontBase64Cache;
  } catch (e) {
    console.warn('Polish font load failed, falling back to Helvetica:', e);
    return null;
  }
}

let _fontBoldBase64Cache = null;
async function loadPolishFontBold() {
  if (_fontBoldBase64Cache) return _fontBoldBase64Cache;
  try {
    const resp = await fetch('https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf');
    const buf = await resp.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 4096) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 4096));
    }
    _fontBoldBase64Cache = btoa(binary);
    return _fontBoldBase64Cache;
  } catch (e) {
    return null;
  }
}

async function downloadPdf() {
  if (typeof window.jspdf === 'undefined') { showToast('Biblioteka jsPDF się nie załadowała.'); return; }
  const pdfBtn = $('#exportPdf') || $('#dlPdf');
  const origText = pdfBtn?.textContent;
  if (pdfBtn) { pdfBtn.textContent = 'Generuję PDF…'; pdfBtn.disabled = true; }
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
  doc.text(`Pacjent: ${ex.patient}    Data: ${ex.date}    Lekarz: ${state.patient.doctorName}`, pageW / 2, y, { align: 'center' });
  y += 18;

  doc.setDrawColor(180);
  doc.line(margin, y, pageW - margin, y);
  y += 18;

  doc.setTextColor(30);
  doc.setFontSize(11);

  const writeParagraph = (text, opts = {}) => {
    if (opts.bold) doc.setFont(fontName, 'bold'); else doc.setFont(fontName, 'normal');
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
      const lines = s.text.split('\n');
      for (const line of lines) writeParagraph(line);
    } else {
      writeParagraph(s.text);
    }
  }

  y += 24;
  if (y > pageH - margin - 20) { doc.addPage(); y = margin; }
  doc.setFont(fontName, 'normal');
  doc.setFontSize(10);
  doc.text(`${state.patient.doctorName}, radiolog`, pageW - margin, y, { align: 'right' });

  doc.save(makeFileName('pdf'));
  } finally {
    if (pdfBtn) { pdfBtn.textContent = origText; pdfBtn.disabled = false; }
  }
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
  state.manualStop = false;
  state.isRecording = false;
  _cleanupToastShown = false;
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
