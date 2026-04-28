# Opisy — Mockup Agent Context

Polish radiology report assistant. Voice dictation → full Polish-styled descriptions. Single-user (one radiologist). Windows desktop target. Local-leaning (Whisper local + LLM hybrid with PII anonymization).

## Mockup goal

Pure HTML/JS + CSS demo for GitHub Pages. No backend. Must feel like a **solid desktop app**, NOT a landing page. The whole point is to convince stakeholder this is the right product direction.

Output formats: **only PDF and Word (.docx)**. No "send to PACS", no clipboard-only.

## Core product invariants (READ THIS)

1. **Lock-after-verify:** When doctor dictates a section and reads the generated text, that text becomes LOCKED. The model NEVER rewrites locked content. Doctor can manually edit locked sections, but the AI cannot.
2. **Future-template can change:** AI may modify, delete, or rearrange sentences in the **yet-unverified** part of the template. E.g. "łąkotka boczna prawidłowa" can vanish if it later becomes irrelevant — but only while still unverified.
3. **Live streaming:** When doctor dictates, words appear LEFT in real-time (Whisper-style streaming). On the RIGHT, the description sentences form/refine. Irrelevant template lines fade out.
4. **No fake clicking:** The doctor clicks ONE mic button → a realistic dictation simulation plays. They do NOT click pre-canned "say this phrase" buttons. The auto-demo plays the whole story.
5. **PII:** All output must show "[zanonimizowano]" or similar in the demo. Privacy is a selling point.

## Demo flow (story)

1. **Patient entry** — quick form: imię/nazwisko (gets anonymized live → shown as `[zanonimizowano]`), PESEL/data ur., typ badania. Feels like opening a chart.
2. **Template pick** — list of templates (MR kolano, MR bark, MR kręgosłup L-S, etc.). One is featured/active.
3. **Dictation workspace** — three-column desktop layout:
   - LEFT: live transcript words streaming as doctor "speaks"
   - CENTER: the report. Locked sections greyed with a lock chip. Currently-generating section animated. Yet-unverified template content faded/dim.
   - RIGHT: section progress, mic controls, dictation tips, export buttons
4. **Export** — generate ACTUAL downloadable .docx and .pdf files in browser. Use libraries from CDN (e.g. `docx` package via UMD, `jspdf`).

## What was wrong with v1

- Mixed landing page (hero + cards) into the workspace. Drop the marketing.
- Required user to click pre-baked "say X" buttons. Should just click mic and watch.
- No patient data entry. No real PDF/Word download.
- "Irrelevant lines" feature didn't exist.
- "Lock after verify" wasn't visualized.

## Stack constraints

- Plain HTML, CSS, vanilla JS. No build step.
- CDN libraries OK (preferably ESM imports from esm.sh / unpkg) for docx/PDF generation.
- Must work as static site on GitHub Pages.
- Polish UI text. Code/comments in English.

## Non-goals (do not add)

- No marketing copy / hero pages.
- No fake "send to PACS" buttons.
- No multi-user accounts.
- No login screens.

## User answers (latest)

- **Volume:** ~kilkadziesiąt opisów. Per opis: dyktuje kilka zdań na raz, łącznie kilka minut nagrania (max kilkanaście).
- **Other dictation tools:** doctor doesn't use any. Past tools didn't work.
- **Source data:** ma szablony i opisy, wiadomo które opisy są z którego szablonu.
- **Speech:** Whisper na pewno. LLM — pomyślimy potem.
- **Form factor:** webowo na razie.
- **Live preview:** spoko, ale nie krytyczne.
- **Output:** PDF (dodaj też Word jako bonus, ale PDF jest must).
