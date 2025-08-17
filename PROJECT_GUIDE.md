# PROJECT_GUIDE.md

## Project Name
Personal AI Assistant (Mirror of Mateusz)

## Project Goal
Asystent AI, który:
- działa jak „lustro” – zna mnie lepiej niż ja sam.
- uczy się na podstawie moich rozmów (np. WhatsApp export).
- odpowiada na pytania z mojego życia prywatnego i zawodowego.
- codziennie synchronizuje dane i tworzy z nich wiedzę.
- w przyszłości integruje się z modelami AI (fine-tuning, embeddingi, API).

---

## Core Features
1. **Data Import**
   - Eksport WhatsApp/iMessage → pliki txt/zip.
   - Parsowanie i zapis do JSON.
2. **Data Sync**
   - Harmonogram (node-cron) do codziennego wczytywania nowych danych.
   - Logowanie statusów w konsoli.
3. **Data Processing**
   - Czyszczenie i normalizacja wiadomości.
   - Proste statystyki (np. liczba wiadomości, najczęstsze słowa).
4. **AI Integration (future)**
   - Endpoint `/ask` → pytania o dane.
   - Integracja z OpenAI lub innym LLM.

---

## Tech Stack
- **Node.js** + **Yarn**
- `node-cron`, `fs-extra`
- JSON (na start), później **PostgreSQL** lub **SQLite**
- PM2 (do uruchamiania na serwerze)
- Ubuntu (Linux env)

---

## My Rules & Preferences

### Coding Style
- Zawsze pełny kod przy zmianach (żadnych skrótów typu `{/* ... */}`).
- Na górze pliku ścieżka w komentarzu:
  ```js
  // /project-path/syncData.js
  ```

* `console.log` i błędy po angielsku, z nazwą zmiennej lub funkcji:

  ```js
  console.log("syncData: file found", filePath);
  console.error("parseData error: invalid format", err);
  ```
* Nie używać `try-catch`, tylko `.catch()` albo alternatywne mechanizmy.
* Nazwy zmiennych i funkcji → angielski.
* Stały tekst w kodzie → niemiecki.
* Komentarze → polski lub krótkie po niemiecku (3–4 słowa).
* Kod powinien być kompletny (100–200 linii max w jednym pliku). Większe → dziel na moduły.

### Workflow

* Konsola ma być gadatliwa (więcej `console.log` gdy problem).
* Endpointy mają być **zabezpieczone** – tylko moja strona może je wywołać.
* Aplikacja ma mieć dostęp do plików w dowolnym miejscu na dysku.
* Może uruchamiać komendy wymagające sudo (`sudo -S` z hasłem).
* Docelowo: integracja z Google Calendar, Trello, smart home (Chromecast, Google Hub).

### Project Style

* Unikać powtarzalności w kodzie i w rozmowach.
* Wszystko ma być jasne, praktyczne, bez owijania w bawełnę.
* Zawsze dawaj linki do dokumentacji, jeśli używasz biblioteki.
* Instrukcje krok po kroku (przy trudniejszych tematach).
* Lubię checklisty i roadmapy.

---

## Roadmap

### Phase 1 – Setup

* [x] Repo + Git init
* [x] Node.js + Yarn init
* [ ] Dodanie paczek: `node-cron`, `fs-extra`
* [ ] Pierwszy commit

### Phase 2 – Data Import

* [ ] Skrypt importujący pliki WhatsApp
* [ ] Konwersja do JSON

### Phase 3 – Data Sync

* [ ] Skrypt `syncData.js` odpalany cronem
* [ ] Logowanie w konsoli

### Phase 4 – Data Processing

* [ ] Czyszczenie i normalizacja danych
* [ ] Tworzenie statystyk

### Phase 5 – AI Integration

* [ ] Endpoint `/ask`
* [ ] Integracja z OpenAI (klient API)

---

## Notes for Copilot

* Ten plik to źródło prawdy o projekcie.
* Trzymaj się moich reguł (pełny kod, console.log po angielsku, brak try-catch).
* Jeśli zmiana jest mała, pokaż całą funkcję, nie fragment.
* Jeśli kod przekracza 200 linii → podziel na moduły.
* Styl rozmowy: swobodny, ale precyzyjny.
* Zawsze pokazuj praktyczne przykłady z moim stackiem (Node.js, Next.js, Strapi, Docker, PostgreSQL).
* Dbaj, żeby nie było powtarzalności.
