# Node.js Starter Projekt

Ein grundlegendes Node.js Starter-Projekt mit Express.

## Voraussetzungen

- Node.js muss installiert sein. Download unter: https://nodejs.org/

## Funktionen

- Express.js Server
- CORS aktiviert
- Unterstützung für Umgebungsvariablen
- Fehlerbehandlungs-Middleware
- Hot Reload im Entwicklungsmodus

## Erste Schritte

1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

2. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

3. Für Produktion:
   ```bash
   npm start
   ```

## Umgebungsvariablen

Erstellen Sie eine `.env` Datei im Hauptverzeichnis:

```env
PORT=3000
NODE_ENV=development
```

## Skripte

- `npm run dev` - Startet den Entwicklungsserver mit Hot Reload
- `npm start` - Startet den Produktionsserver
- `npm test` - Führt Tests aus