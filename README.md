# Personal AI Assistant — README

Krótkie podsumowanie projektu dla współpracowników.

Projekt: Personal AI Assistant
Cel: Asystent prywatny, który uczy się z moich rozmów i pomaga w codziennych zadaniach.

Quickstart
1. Zainstaluj zależności:

```bash
yarn install
```

2. Uruchom lokalnie (dev):

```bash
node syncData.js
```

Usage
- Skonfiguruj zmienne środowiskowe (opcjonalnie):
  - `INPUT_DIR` — folder z eksportami (domyślnie `./eingang`)
  - `OUTPUT_DIR` — miejsce zapisu JSON (domyślnie `./ausgabe`)
  - `CRON_SCHEDULE` — harmonogram cron (domyślnie `0 2 * * *`)

Contributing
1. Fork repozytorium, stwórz branch feature/my-feature
2. Wprowadź zmiany, uruchom testy (jeśli są)
3. Commituj zgodnie z konwencją (chore|feat|fix)
4. Push i stwórz pull request

Git i deployment
- Repo jest powiązane z `origin` na GitHubie. Aby wypchnąć lokalnie:

```bash
git add .
git commit -m "feat: opis"
git push origin HEAD
```

Struktura
- `syncData.js` — synchronizacja danych
- `PROJECT_GUIDE.md` — szczegółowy przewodnik i preferencje

Kontakt
Mati — właściciel projektu
