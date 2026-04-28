# Opisy — asystent radiologa (mockup)

Mockup aplikacji do tworzenia opisów badań radiologicznych głosem.
Pokazuje pełne flow: setup → wybór szablonu → dyktowanie → eksport.

## Co pokazuje demo

1. **Ekran startowy** — wgranie szablonów Word i własnych opisów do nauki stylu, status anonimizacji.
2. **Wybór szablonu** — lista typów badań (w demo aktywny: MR kolana prawego).
3. **Ekran dyktowania** — szablon po lewej zmienia się na żywo w opis na podstawie krótkich skrótów wypowiedzianych głosem. Po prawej widać transkrypt i symulację dyktatu (klikalne skróty).
4. **Eksport** — gotowy opis w formacie do druku, statystyki, opcje pobrania.

## Jak uruchomić lokalnie

Otwórz `index.html` w przeglądarce. To statyczna strona (HTML + CSS + JS), nie wymaga serwera.

## Jak zobaczyć preview online

Po włączeniu GitHub Pages dla tego repo (Settings → Pages → branch `claude/radiology-voice-reports-zTMWC`, folder `/`), preview będzie dostępne pod adresem:

```
https://marekrogala.github.io/opisy/
```

## Ważne

To **mockup demonstracyjny** — głos jest symulowany przez przyciski "🎤 …".
Prawdziwy ASR (Whisper) i LLM (Claude) zostaną podłączone na kolejnym etapie po decyzjach architektonicznych.

## Stack

- Czysty HTML / CSS / JavaScript (vanilla, bez frameworków)
- Brak dependencies, brak buildu
- Działa offline w przeglądarce
