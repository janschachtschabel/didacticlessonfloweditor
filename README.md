# KI Assistent für Unterrichtsabläufe

Ein webbasiertes Tool zur Erstellung und Optimierung von didaktischen Templates mit KI-Unterstützung und WLO-Integration.

## Features

- Erstellung und Bearbeitung von didaktischen Templates
- KI-gestützte Generierung und Optimierung von Unterrichtsabläufen
- KI-basierte Filterkriterien für Bildungsressourcen
- Integration mit der Wirlernenonline.de (WLO) Plattform
- Visualisierung von Lernsequenzen als Graph und Tabelle
- PDF-Export von Templates

## Voraussetzungen

- Node.js (Version 18 oder höher)
- npm (wird mit Node.js mitgeliefert)

## Installation

1. Repository klonen oder herunterladen
2. Abhängigkeiten installieren:
```bash
npm install
```

## Entwicklung starten

1. Proxy-Server für WLO-Zugriff starten (in einem separaten Terminal):
```bash
npm run proxy
```

2. Entwicklungsserver starten (in einem anderen Terminal):
```bash
npm run dev
```

Die Anwendung ist dann unter `http://localhost:5173` verfügbar.

## Proxy Server

Der Proxy Server ist erforderlich für den Zugriff auf die WLO-API und läuft standardmäßig auf Port 3001. Er bietet:

- `/proxy` - Hauptendpunkt für WLO-API-Anfragen
- `/health` - Gesundheitscheck des Proxy-Servers

## Projektstruktur

```
src/
  ├── components/         # React-Komponenten
  │   ├── course/        # Komponenten für Unterrichtsablauf
  │   ├── environments/  # Komponenten für Lernumgebungen
  │   ├── preview/       # Komponenten für Vorschau
  │   └── wlo/          # Komponenten für WLO-Integration
  ├── lib/              # Hilfsfunktionen und Utilities
  ├── pages/            # Hauptseiten der Anwendung
  ├── server/           # Proxy-Server für WLO-Zugriff
  └── store/            # Zustand-Management mit Zustand

public/                 # Statische Assets
```

## Wichtige Hinweise

- Der Proxy Server muss laufen, damit WLO-Inhalte abgerufen werden können
- Alle API-Anfragen werden über den Proxy geleitet, um CORS-Probleme zu vermeiden
- OpenAI API-Key wird für KI-Funktionen benötigt
- URLs für WLO-Anfragen werden automatisch bereinigt (Kommas werden entfernt)

## Workflow

1. Allgemeines - Grundlegende Informationen festlegen
2. Didaktische Grundlagen - Probleme, Ziele und Lösungsansätze definieren
3. Akteure - Beteiligte Personen und Gruppen anlegen
4. Lernumgebungen - Ressourcen, Werkzeuge und Dienste zuordnen
5. Unterrichtsablauf - Sequenzen, Phasen und Aktivitäten gestalten
6. KI Ablauf - Template optimieren und WLO-Inhalte integrieren

## Bekannte Einschränkungen

- Der Proxy Server muss manuell gestartet werden
- Nur GET-Anfragen an die WLO-API werden unterstützt
- Maximale Timeout-Zeit für WLO-Anfragen: 60 Sekunden