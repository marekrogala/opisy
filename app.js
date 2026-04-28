// ============== Mock data ==============
const TEMPLATE = {
  id: 'mr_kolano_prawe',
  title: 'REZONANS MAGNETYCZNY KOLANA PRAWEGO',
  meta: 'Pacjent: [zanonimizowane] · Data badania: dziś · Lekarz: dr Kowalska',
  sections: [
    { id: 'wskazanie', label: 'Wskazanie',
      text: 'Wskazanie: ból kolana, podejrzenie uszkodzenia łąkotki.',
      state: 'normal' },
    { id: 'technika', label: 'Technika',
      text: 'Badanie wykonano w sekwencjach PD, T1, T2 z saturacją tłuszczu w płaszczyznach strzałkowej, czołowej i poprzecznej.',
      state: 'normal' },
    { id: 'lakotka_p', label: 'Łąkotka przyśrodkowa',
      text: 'Łąkotka przyśrodkowa: prawidłowa, bez cech uszkodzenia.',
      state: 'normal' },
    { id: 'lakotka_b', label: 'Łąkotka boczna',
      text: 'Łąkotka boczna: prawidłowa, bez cech uszkodzenia.',
      state: 'normal' },
    { id: 'acl', label: 'Więzadło krzyżowe przednie',
      text: 'Więzadło krzyżowe przednie (ACL): prawidłowe, ciągłe na całym przebiegu.',
      state: 'normal' },
    { id: 'pcl', label: 'Więzadło krzyżowe tylne',
      text: 'Więzadło krzyżowe tylne (PCL): prawidłowe, ciągłe.',
      state: 'normal' },
    { id: 'mcl', label: 'Więzadła poboczne',
      text: 'Więzadła poboczne (MCL, LCL): prawidłowe, bez cech uszkodzenia.',
      state: 'normal' },
    { id: 'chrzastka', label: 'Chrząstka stawowa',
      text: 'Chrząstka stawowa: bez cech istotnego uszkodzenia.',
      state: 'normal' },
    { id: 'kosci', label: 'Kości',
      text: 'Kości tworzące staw: bez zmian patologicznych, bez obrzęku szpiku.',
      state: 'normal' },
    { id: 'wysiek', label: 'Jama stawu',
      text: 'Jama stawu: bez wysięku.',
      state: 'normal' },
    { id: 'tkanki', label: 'Tkanki miękkie',
      text: 'Tkanki miękkie okołostawowe: bez zmian.',
      state: 'normal' },
    { id: 'wnioski', label: 'Wnioski',
      text: '1. Badanie bez istotnych odchyleń od normy.',
      state: 'normal' },
  ]
};

const DEMO_DICTATIONS = [
  {
    label: 'róg tylny łąkotki przyśrodkowej skośne pęknięcie',
    transcript: 'róg tylny łąkotki przyśrodkowej skośne przytorebkowe pęknięcie',
    target: 'lakotka_p',
    newText: 'Łąkotka przyśrodkowa: w rogu tylnym widoczne skośne, horyzontalno-degeneracyjne pęknięcie przytorebkowe sięgające górnej powierzchni stawowej. Wysokość rogu tylnego zachowana.'
  },
  {
    label: 'ACL trzeciego stopnia',
    transcript: 'ACL trzeciego stopnia w przyczepie udowym',
    target: 'acl',
    newText: 'Więzadło krzyżowe przednie (ACL): zerwanie III stopnia w przyczepie udowym, z brakiem ciągłości włókien więzadłowych. Włókna pofałdowane, leżą poziomo na płaskowyżu kości piszczelowej.'
  },
  {
    label: 'niewielki wysięk',
    transcript: 'niewielki wysięk',
    target: 'wysiek',
    newText: 'Jama stawu: obecny niewielki wysięk w zachyłku nadrzepkowym.'
  },
  {
    label: 'obrzęk szpiku kłykieć boczny',
    transcript: 'obrzęk szpiku w kłykciu bocznym kości udowej',
    target: 'kosci',
    newText: 'Kości tworzące staw: w kłykciu bocznym kości udowej widoczny obszar obrzęku szpiku kostnego (bone bruise) o wymiarach około 12 × 8 mm. Pozostałe kości bez zmian patologicznych.'
  },
  {
    label: 'wnioski',
    transcript: 'wygeneruj wnioski',
    target: 'wnioski',
    newText: '1. Skośne, horyzontalno-degeneracyjne pęknięcie przytorebkowe rogu tylnego łąkotki przyśrodkowej.\n2. Zerwanie więzadła krzyżowego przedniego (ACL) III stopnia w przyczepie udowym.\n3. Obrzęk szpiku kostnego w kłykciu bocznym kości udowej (12 × 8 mm).\n4. Niewielki wysięk w jamie stawu.'
  }
];

// ============== State ==============
const state = {
  template: JSON.parse(JSON.stringify(TEMPLATE)),
  doneDemos: new Set(),
  startTime: null,
  totalDictatedWords: 0,
  isRecording: false,
};

// ============== Screen routing ==============
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.hidden = true);
  const s = document.querySelector(`[data-screen="${name}"]`);
  if (s) s.hidden = false;
  if (name === 'dictation') initDictation();
  if (name === 'export') initExport();
  window.scrollTo(0, 0);
}

document.querySelectorAll('[data-go]').forEach(btn => {
  btn.addEventListener('click', () => showScreen(btn.dataset.go));
});

document.querySelectorAll('[data-template]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.template !== 'mr_kolano_prawe') {
      alert('W demo dostępny jest tylko szablon MR kolana prawego.');
      return;
    }
    showScreen('dictation');
  });
});

// ============== Dictation screen ==============
function initDictation() {
  // reset state if first time
  if (!state.startTime) state.startTime = Date.now();
  renderReport();
  renderSections();
  renderDemoButtons();
}

function renderReport() {
  const root = document.getElementById('reportRoot');
  root.innerHTML = `
    <div class="report-header">
      <h1>${TEMPLATE.title}</h1>
      <div class="meta">${TEMPLATE.meta}</div>
    </div>
    ${state.template.sections.map(s => `
      <div class="report-section" data-section="${s.id}">
        <p class="diff-stable">${escapeHtml(s.text).replace(/\n/g, '<br/>')}</p>
      </div>
    `).join('')}
  `;
}

function renderSections() {
  const list = document.getElementById('sectionList');
  list.innerHTML = state.template.sections.map(s => `
    <li class="${s.state}" data-section="${s.id}">${s.label}</li>
  `).join('');
  list.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      const target = document.querySelector(`.report-section[data-section="${li.dataset.section}"]`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

function renderDemoButtons() {
  const wrap = document.getElementById('demoButtons');
  wrap.innerHTML = DEMO_DICTATIONS.map((d, i) => `
    <button data-demo-idx="${i}" class="${state.doneDemos.has(i) ? 'done' : ''}">
      🎤 ${d.label}
    </button>
  `).join('');
  wrap.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => {
      const idx = parseInt(b.dataset.demoIdx);
      if (state.doneDemos.has(idx)) return;
      runDictation(idx);
    });
  });
}

// ============== Dictation simulation ==============
function runDictation(idx) {
  const d = DEMO_DICTATIONS[idx];
  state.doneDemos.add(idx);
  state.totalDictatedWords += d.transcript.split(/\s+/).length;

  // 1. Mic activates
  setMic(true, 'Słucham…');
  addTranscript(d.transcript, 'processing');

  // 2. Mic stops, processing
  setTimeout(() => {
    setMic(false, 'Przetwarzam dyktat...');
  }, 600);

  // 3. AI replaces
  setTimeout(() => {
    setMic(false, 'Przerabiam na Twój styl…');
    finalizeTranscript();
  }, 1200);

  // 4. Apply diff
  setTimeout(() => {
    applyDiff(d.target, d.newText);
    setMic(false, 'Gotowy');
    renderDemoButtons();
  }, 1800);
}

function applyDiff(targetId, newText) {
  const section = state.template.sections.find(s => s.id === targetId);
  if (!section) return;
  const oldText = section.text;
  section.text = newText;
  section.state = 'modified';

  const el = document.querySelector(`.report-section[data-section="${targetId}"]`);
  if (!el) return;

  // animate diff
  el.innerHTML = `
    <p>
      <span class="diff-removed">${escapeHtml(oldText)}</span>
      <span class="diff-added">${escapeHtml(newText).replace(/\n/g, '<br/>')}</span>
    </p>
  `;

  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // settle
  setTimeout(() => {
    el.innerHTML = `<p class="diff-stable">${escapeHtml(newText).replace(/\n/g, '<br/>')}</p>`;
  }, 1600);

  renderSections();
}

// ============== Mic / transcript helpers ==============
let micLevelInterval = null;
function setMic(active, statusText) {
  state.isRecording = active;
  const btn = document.getElementById('micBtn');
  const status = document.getElementById('micStatus');
  const level = document.getElementById('micLevel');
  btn.classList.toggle('active', active);
  status.textContent = statusText;

  if (active) {
    micLevelInterval = setInterval(() => {
      level.style.width = (30 + Math.random() * 70) + '%';
    }, 80);
  } else {
    clearInterval(micLevelInterval);
    level.style.width = '0%';
  }
}

function addTranscript(text, cls = '') {
  const list = document.getElementById('transcriptList');
  // remove hint
  list.querySelectorAll('.transcript__hint').forEach(h => h.remove());
  const li = document.createElement('li');
  if (cls) li.className = cls;
  li.textContent = '"' + text + '"';
  list.appendChild(li);
  list.scrollTop = list.scrollHeight;
}
function finalizeTranscript() {
  document.querySelectorAll('#transcriptList li.processing').forEach(li => {
    li.classList.remove('processing');
  });
}

// ============== Push-to-talk (spacebar) ==============
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !e.repeat &&
      document.querySelector('[data-screen="dictation"]')?.hidden === false) {
    if (document.activeElement.tagName === 'BUTTON' ||
        document.activeElement.tagName === 'INPUT') return;
    e.preventDefault();
    setMic(true, 'Słucham… (puść spację, żeby zakończyć)');
  }
});
document.addEventListener('keyup', (e) => {
  if (e.code === 'Space' &&
      document.querySelector('[data-screen="dictation"]')?.hidden === false) {
    if (document.activeElement.tagName === 'INPUT') return;
    e.preventDefault();
    if (state.isRecording) {
      setMic(false, 'Przetwarzam…');
      setTimeout(() => setMic(false, 'Gotowy'), 800);
    }
  }
});

// Mic button click — short demo of recording state
document.getElementById('micBtn')?.addEventListener('click', () => {
  if (state.isRecording) {
    setMic(false, 'Gotowy');
  } else {
    setMic(true, 'Słucham…');
    setTimeout(() => setMic(false, 'Gotowy'), 1500);
  }
});

// Undo
document.getElementById('undoBtn')?.addEventListener('click', () => {
  // simple mock — undo last modified section to original
  for (let i = state.template.sections.length - 1; i >= 0; i--) {
    const s = state.template.sections[i];
    if (s.state === 'modified') {
      const orig = TEMPLATE.sections.find(o => o.id === s.id);
      s.text = orig.text;
      s.state = 'normal';
      // remove from done demos if applicable
      const idx = DEMO_DICTATIONS.findIndex(d => d.target === s.id);
      if (idx >= 0) state.doneDemos.delete(idx);
      renderReport();
      renderSections();
      renderDemoButtons();
      return;
    }
  }
});

// Auto demo
document.getElementById('demoAuto')?.addEventListener('click', async () => {
  for (let i = 0; i < DEMO_DICTATIONS.length; i++) {
    if (state.doneDemos.has(i)) continue;
    runDictation(i);
    await sleep(2400);
  }
});

// Run full demo from start
document.getElementById('runFullDemo')?.addEventListener('click', async () => {
  // reset
  state.template = JSON.parse(JSON.stringify(TEMPLATE));
  state.doneDemos = new Set();
  state.startTime = Date.now();

  showScreen('templates');
  await sleep(1500);
  showScreen('dictation');
  await sleep(1000);
  for (let i = 0; i < DEMO_DICTATIONS.length; i++) {
    runDictation(i);
    await sleep(2600);
  }
  await sleep(1500);
  showScreen('export');
});

// ============== Export ==============
function initExport() {
  const paper = document.getElementById('exportPaper');
  paper.innerHTML = `
    <h1>${TEMPLATE.title}</h1>
    <p><strong>Pacjent:</strong> [zanonimizowane] &nbsp; <strong>Data:</strong> ${new Date().toLocaleDateString('pl-PL')}</p>
    ${state.template.sections.map(s => {
      if (s.id === 'wnioski') {
        return `<div class="section-label">Wnioski:</div><p>${escapeHtml(s.text).replace(/\n/g, '<br/>')}</p>`;
      }
      return `<p>${escapeHtml(s.text)}</p>`;
    }).join('')}
    <p style="margin-top:40px; text-align:right;"><em>dr Kowalska, radiolog</em></p>
  `;

  // stats
  const elapsed = state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 134;
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  document.getElementById('statTime').textContent = `${mins} min ${secs} s`;
  document.getElementById('statWords').textContent = state.totalDictatedWords || 23;
  const outputWords = state.template.sections
    .map(s => s.text.split(/\s+/).length).reduce((a, b) => a + b, 0);
  document.getElementById('statOutput').textContent = outputWords;
}

// ============== Utils ==============
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============== Init ==============
showScreen('setup');
