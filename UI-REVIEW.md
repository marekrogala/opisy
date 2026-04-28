# Phase 00 — UI Review

**Audited:** 2026-04-28
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md)
**Screenshots:** Captured — desktop (1440×900), tablet (768×1024), mobile (375×812), dictation workspace start, dictation workspace mid-demo, export step

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | Strong Polish medical copy; two structural copy problems undermine the demo story |
| 2. Visuals | 3/4 | Excellent desktop workspace; mobile is broken; dictation screenshot is too small to read |
| 3. Color | 4/4 | Disciplined token system; 14 distinct values all defined as CSS custom properties |
| 4. Typography | 2/4 | 14 distinct font-size values — too granular; no true typographic scale |
| 5. Spacing | 3/4 | Consistent primitives; paper left/right padding is too generous on narrower widths |
| 6. Experience Design | 3/4 | Lock-after-verify and implicit cleanup demo beautifully; Word download has a silent-fail gap |

**Overall: 18/24**

---

## Top 3 Priority Fixes

1. **Typography scale is 14 values spread across a 9.5px–20px range** — When a stakeholder looks at the document, the visual hierarchy feels busy and slightly amateur. Collapse to 5–6 values: 11px (meta), 12px (UI labels), 13px (body/buttons), 14.5px (paper body), 17px (headings), 22px (paper title). Remove the .5px micro-increments (10.5, 11.5, 12.5, 13.5, 14.5 all co-exist with their neighbours within 1px — a stakeholder can't tell them apart but the inconsistency shows up in rendering).

2. **Mobile layout is unusable — it breaks the product story** — The header at 375px overflows so badly that "Restart demo" and "Zapisane teraz" are partially clipped behind each other. The 2-column form grid collapses but the `NAZWISKO` column still clips. Most critically, the dictation workspace collapses to single-column at 980px with no guidance — the three-panel desktop metaphor (LEFT transcript | CENTER paper | RIGHT controls) is the entire product pitch and it vanishes below 980px. Since the target is Windows desktop, mobile doesn't need to be perfect, but tablet (768px) should still show the "app feel" or the stakeholder demo on an iPad breaks.

3. **downloadWord() has no try/catch around the core Packer.toBlob() call** — The PDF export has a `try/finally` that restores button state on failure. The Word export does not: if `Packer.toBlob()` or the CDN library throws, the function fails silently with no user feedback and no button restore. In a live stakeholder demo this would look like a broken product. Wrap lines 671–673 in a try/catch that shows a toast and disables the "Word" button the same way PDF handles it.

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)

**What works well:**
- Medical terminology is accurate and realistic. The dictation script uses correct Polish anatomical terms (horyzontalno-degeneracyjne pęknięcie przytorebkowe, zachyłek nadrzepkowy) — this is the single most important thing for convincing a radiologist stakeholder and it delivers.
- The anonymization copy is excellent: `→ [zanonimizowano]` chips appearing live as you type is the right moment of delight. The footer text "Po kliknięciu „Dalej" dane osobowe nie opuszczają Twojego komputera. Do AI trafia **Pacjent #4471**" is concise and reassuring.
- Toast messages are context-specific: "Sekcja zablokowana — model jej nie zmieni", "AI usunął nieistotne linie szablonu" — these tell the story of the two key product differentiators at exactly the right moment.
- The privacy widget ("Tryb prywatny · Whisper lokalnie · LLM zero-retention") is persistent and well-placed at the bottom of the rail.

**Issues:**

**1a. Demo notice on Step 1 is redundant and removes trust** (`index.html:86`)
The blue banner on the patient screen reads: "Demo interaktywne — kliknij Dalej, aby zobaczyć jak działa dyktowanie głosowe z AI."
This is in direct conflict with the goal of making the app feel like a real product. The radiologist should feel like they are opening a chart, not watching a demo. Move the demo framing to the titlebar area (e.g., a subtle "demo" badge next to the app name) or remove it entirely — the Restart button in the titlebar already signals this is a demo. The blue box screams "this is fake".

**1b. Incomplete hint text on patient form footer** (`index.html:150`)
The text is cut off: "Po kliknięciu „Dalej" dane osobowe nie opuszczają Twojego komputera. Do AI trafia **Pacjent #4471**." The anon ID is hardcoded as `#4471` in the HTML. This is stale — the JS dynamically updates `#peselAnon` chip and `state.patient.anonId`, but the static HTML in the footer hint always shows `#4471` regardless of PESEL input. If a stakeholder changes the PESEL, the chip updates but the sentence in the footer still says #4471. Fix: make this span dynamic with `id="footerAnonId"` and update it in `refreshAnonChips()`.

**1c. Template picker toast is jarring** (`app.js:226`)
"W demo aktywny jest tylko szablon MR kolana prawego." — The other 8 template cards are rendered but non-functional. A click triggers this toast. This undermines the "real product" illusion significantly. Better: grey out non-active templates with a `disabled` visual state and a tooltip on hover saying "Dostępne w pełnej wersji", rather than letting the click go through and showing a toast.

**1d. Mic hint in right panel** (`index.html:223`)
"Demo startuje automatycznie." is sandwiched into the mic hint paragraph without visual separation. It reads awkwardly alongside "Kliknij lub trzymaj SPACJA." The demo instruction belongs to a different register than the operational instruction.

---

### Pillar 2: Visuals (3/4)

**What works well on desktop:**
- The macOS-style traffic light dots + titlebar chrome convincingly sells the "desktop app" metaphor from the first second.
- The dictation workspace three-panel layout is the right layout for the product. The paper in the center is the hero — the border-radius + drop shadow (`var(--shadow-lg)`) makes it feel like a real floating document.
- State differentiation in the paper is visually clear: pending sections are 50% opacity with a dashed left border; active sections have a warm amber left border with the pulsing dot; locked sections get a green left border with the lock chip and the `lockSettle` flash animation. This is the visual heart of the product and it works.
- The diff animation (strikethrough red → new green text appears) is the most impressive moment. It directly demonstrates the AI-rewrites-unverified concept without explanation.
- The mic button with its halo animation is a high-quality interaction affordance.

**Issues:**

**2a. Mobile header overflow** (observed in screenshot at 375px)
At 375px, the titlebar tries to fit: traffic dots + brand + doc name + "Zapisane teraz" chip + "Restart demo" button. These overflow. The "Zapisane teraz" chip and "Restart demo" button overlap each other. The titlebar has `overflow: hidden` via flex, causing clipping. No responsive handling for the titlebar exists in the CSS. Since the target is Windows desktop, the immediate fix is to add `display: none` to the titlebar at <768px rather than showing a broken layout.

**2b. Template cards have no active-state scale affordance visible enough at distance**
`tcard--active` shows only a border-color change to `--accent` (near-black) and the tiny "Aktywny" badge. On a stakeholder demo screen from 2 meters away, it's hard to distinguish the active card from hovered cards. Consider adding a subtle background tint (`var(--accent-soft)`) to the selected card body.

**2c. The "Sekcje opisu" progress panel counter is not prominent enough**
`sectionCount` shows "0 / 12 zweryfikowane" in `var(--text-muted)` 11px. This counter is the core progress metric of the whole workflow. It should be 13px weight-600 in `var(--text)` and possibly have its own visual treatment (a small progress bar or fraction in a larger size) that shows increasing completion as sections lock.

**2d. Dictation workspace screenshot reveals readability issue**
At 1440px wide, the paper column is constrained to max-width 760px but the columns share 12px gaps with 280px left + 340px right. This means the paper is roughly 750px wide with 56px left/right padding — yielding ~638px of usable line length. At 14.5px Source Serif, that's about 90+ characters per line, which is slightly long for comfortable reading (optimal is 60–75 chars). The paper's line length could be reduced to max-width: 680px to improve reading comfort.

---

### Pillar 3: Color (4/4)

The color system is genuinely excellent. Findings are minor.

**What works well:**
- All semantic colors are defined as CSS custom properties in `:root`. Zero hardcoded one-off colors in component rules. The token names are meaningful (--success, --warning, --danger, --info) and used contextually correctly: green for locked/verified, amber/warning for active/recording, red/danger for the live mic state.
- The accent color (`#1e1e2a`, near-black) is disciplined — used only for the primary button, active rail step, template active border, and toast background. It is not overused.
- The surface hierarchy is thoughtful: `--bg` (#f4f4f2, warm grey) → `--bg-app` (#fafaf8, slightly lighter for rail) → `--surface` (white for cards/paper) → `--surface-subtle` for hover states. This creates depth without harshness.
- The 60/30/10 split holds: neutral surfaces dominate, text/border greys occupy secondary space, accent appears only on primary interactive elements.

**Minor issues:**

**3a. Traffic light dots use hardcoded hex values** (`styles.css:114-116`)
`#ff5f57`, `#febc2e`, `#28c840` are decorative and macOS-specific, so hardcoding is defensible. However, if the project later gets a dark mode or brand refresh, these would be orphaned. Low priority.

**3b. Twelve inline rgba() values are not tokenized** (`styles.css:158-164, 226, 507, etc.`)
Several rgba() values repeat the success/warning/danger base colors at specific opacities but are written as raw values rather than using the existing soft tokens. For example, `rgba(4, 120, 87, 0.06)` on line 158 (save-chip background) is functionally identical to `var(--success-soft)` (which is rgba(4, 120, 87, 0.09)) — but uses a slightly different opacity. Decide on canonical soft values and use them via var().

---

### Pillar 4: Typography (2/4)

**14 distinct font-size values in use:**
9.5px, 10px, 10.5px, 11px, 11.5px, 12px, 12.5px, 13px, 13.5px, 14px, 14.5px, 16px, 17px, 20px

This is the most significant technical UI debt in the codebase. The values form a nearly-continuous band from 9.5px to 20px with steps as small as 0.5px. Sub-pixel rendering means the difference between 11px and 11.5px is invisible at normal screen densities — the different values add complexity without adding visual differentiation.

**Recommended 6-step scale:**
- `--text-xs`: 11px — metadata, form labels (IMIĘ), anon chips, lock icons
- `--text-sm`: 12px — UI chrome (panel titles, save chip, hint text, check list)
- `--text-base`: 13px — body UI text, buttons, input values
- `--text-lg`: 14.5px — paper body text (Source Serif 4)
- `--text-xl`: 17px — step headings (h2), export paper title context
- `--text-2xl`: 22px — paper title (REZONANS MAGNETYCZNY...)

Current issues by site:
- `tcard__icon--badge` uses 10px, `tcard__meta` uses 11.5px, `tcard__title` uses 13.5px — three sizes within one small card, all within 3.5px of each other
- `rail__privacy-sub` is 10.5px, `rail__privacy-title` is 11.5px — 1px apart, nearly indistinguishable
- `brand__name` at 13px and `titlebar__doc` at 12.5px are 0.5px apart
- Section `section__edit` button is 10.5px — already tiny, appears nearly invisible

**Font weight usage is clean** (400/500/600/700 only, no extraneous weights). The three-family system (Inter for UI, Source Serif 4 for paper, monospace for transcript) is semantically correct and well-executed.

**Letter-spacing** is used carefully (negative tracking on headings, positive tracking on uppercase labels) — this is good practice.

---

### Pillar 5: Spacing (3/4)

**What works well:**
- The 12px gap used consistently throughout the dictation workspace (dict grid gap, panel stack gap) creates a coherent spatial rhythm.
- The paper's 56px/72px padding (vertical/horizontal) is generous and appropriate for a document metaphor — it looks like a printed page.
- The rail spacing (14px outer padding, 10px inner, 8px step padding, 2px step gap) follows a rough 2× progression.

**Issues:**

**5a. No explicit spacing scale — values are ad-hoc**
Gap values in use: 2px, 4px, 5px, 6px, 7px, 8px, 9px, 10px, 12px, 14px, 16px, 18px, 24px. There is no `--space-*` token system. Values like 7px (`gap: 7px` on brand), 9px (`gap: 9px` on privacy widget), and 11px (several paddings) fall between the standard 4px/8px/16px grid. This doesn't look wrong visually, but it makes future modifications inconsistent — someone adding a new component would have no reference.

**5b. Paper padding on smaller viewports**
At 1100px, the paper reduces to `padding: 32px 40px 48px`. The asymmetric vertical padding (32px top, 48px bottom) is intentional (more air at bottom), but the 40px horizontal padding is tight when the column is already narrow. The document starts to feel cramped at 1100–1180px. Consider maintaining at least 48px horizontal padding down to 1100px.

**5c. Export paper padding differs from dictation paper**
Dictation paper: `padding: 56px 72px 80px`. Export paper: `padding: 56px 72px` (no explicit bottom). The export paper has `min-height: 600px` which compensates, but the rendered document looks slightly tighter at the bottom compared to the dictation view. A user going from step 3 → step 4 will notice the paper looks slightly different. Use consistent padding in both.

**5d. btn--block has `margin-bottom: 6px` baked in** (`styles.css:369`)
This means spacing between stacked buttons is coupled to the button class, not to the container. If a container uses `gap`, this creates double-spacing. The export panel right column stacks three btn--block buttons — the 6px margin-bottom + any container gap creates inconsistent spacing.

---

### Pillar 6: Experience Design (3/4)

**What works well:**
- The demo automation (`runFullStory`) is the strongest experience design decision in the product. The radiologist clicks one mic button and watches their workflow play out. No fake choice buttons, no manually-triggered steps. This is correct.
- Lock-after-verify is the product's core invariant and it is visualized at exactly the right moment: a toast fires, the section border goes green, a lock icon appears in the seclist — three simultaneous signals that confirm the lock.
- "AI usunął nieistotne linie szablonu" toast + the `sectionRemove` collapse animation demonstrates the "future-template can change" invariant clearly.
- The diff animation (old text strikethrough in red → new text in green → red fades away) is the highest-quality interaction in the mockup. It directly visualizes AI-assisted refinement.
- Export panel is disabled during dictation (`export-panel--disabled`), and buttons are correctly disabled with descriptive `title` attributes.
- The 6-second finale banner with a countdown progress bar, followed by auto-navigation to the export step, is a polished demo-mode touch.
- PDF generation shows a loading state ("Generuję PDF…") and restores state in a `finally` block — correct pattern.

**Issues:**

**6a. Word download lacks try/catch around the primary operation** (`app.js:628-674`)
`downloadWord()` checks if `docx` library loaded (line 629) but the actual `Packer.toBlob(doc)` call (line 671) is unguarded. If the `docx` UMD library throws a serialization error (malformed text, edge-case character), the async function rejects silently — no toast, no button feedback, nothing visible to the user. The PDF counterpart has `try { ... } finally { restore button }` on lines 718–791. Word export needs the same pattern. Fix:

```js
const blob = await Packer.toBlob(doc);
// → wrap in:
try {
  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, makeFileName('docx'));
  showToast('Plik Word zapisany.');
} catch (e) {
  console.error('Word export failed:', e);
  showToast('Błąd generowania pliku Word.');
}
```

**6b. Template picker silently blocks non-demo templates** (`app.js:225-228`)
Clicking a non-active template shows a toast. This is the correct current behaviour for a demo, but it means rail navigation also allows jumping to step 3 (Dictation) directly from the rail, which would show an empty paper with the wrong template ID and start the auto-demo for the wrong template. The storyRunning guard (`if (state.storyRunning) return`) prevents navigation during the demo but not before it starts. A stakeholder exploring the UI could navigate directly to Dyktowanie via the rail without going through template selection.

**6c. Form validation is absent** (`index.html:150`, `app.js:199-210`)
The patient form has no validation. If all fields are emptied and "Dalej" is clicked, the state sets empty strings and proceeds. The dictation workspace would then show "Lekarz: —" and a paper with "Wskazanie: " (empty). For a stakeholder demo this is acceptable (fields are pre-filled), but adding a minimal check (block Dalej if Imię+Nazwisko or examType is empty) would make the form feel real.

**6d. Restart doesn't reset the seclist or paper DOM in dictation** (`app.js:823-838`)
`fullReset()` resets state and calls `showScreen('patient')`. However, it does not clear `$('#sectionList').innerHTML` or `$('#paperBody').innerHTML`. If the user navigates back to dictation after a restart, `initDictation()` is called which re-renders. This is actually fine — but there is a brief flash where the old DOM is visible during the screen transition before `renderSections()` and `renderPaper()` complete. A defensive `if (ul) ul.innerHTML = ''` at the top of `initDictation()` before rendering would eliminate the flash.

**6e. Auto-advance to export (6-second timer) can conflict with manual interactions** (`app.js:544-545`)
The finale timeout `await sleep(6000)` starts as soon as the story finishes. If the user is reading the completed paper and hasn't clicked anything, they are auto-navigated to export. The check `if (!state.manualStop && state.currentScreen === 'dictation')` is correct but `manualStop` is only set if the mic button is clicked to interrupt the demo. A user who is simply reading (not clicking anything) will be taken to export. Consider also setting `manualStop = true` when the user clicks anywhere on the paper, or increase the timeout to 10s.

---

## Files Audited

- `/Users/marek/CODE/opisy/.claude/worktrees/kind-payne-55e517/index.html` (287 lines)
- `/Users/marek/CODE/opisy/.claude/worktrees/kind-payne-55e517/styles.css` (1131 lines)
- `/Users/marek/CODE/opisy/.claude/worktrees/kind-payne-55e517/app.js` (859 lines)
- `/Users/marek/CODE/opisy/.claude/worktrees/kind-payne-55e517/AGENTS.md` (product context)

**Screenshots captured:**
- `.planning/ui-reviews/00-20260428-212546/desktop.png` — Step 1 (patient form), 1440×900
- `.planning/ui-reviews/00-20260428-212546/tablet.png` — Step 1, 768×1024
- `.planning/ui-reviews/00-20260428-212546/mobile.png` — Step 1, 375×812
- `.planning/ui-reviews/00-20260428-212546/dictation_start.png` — Step 3 first dictation step (Łąkotka boczna just locked), 1440×900
- `.planning/ui-reviews/00-20260428-212546/dictation_mid.png` — Step 3 mid-demo (ACL rupture section complete), 1440×900
- `.planning/ui-reviews/00-20260428-212546/export_view.png` — Step 4 (export + download panel), 1440×900
