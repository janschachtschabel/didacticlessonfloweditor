# KI Assistent für Unterrichtsabläufe

Ein webbasiertes Tool zur Erstellung und Optimierung von didaktischen Templates mit KI-Unterstützung und WLO-Integration.

## Features

- Erstellung und Bearbeitung von didaktischen Templates
- KI-gestützte Generierung und Optimierung von Unterrichtsabläufen
- KI-basierte Filterkriterien für Bildungsressourcen
- Integration mit der Wirlernenonline.de (WLO) Plattform
- Visualisierung von Lernsequenzen als Graph und Tabelle
- PDF-Export von Templates
- Warenkorb-System für WLO-Ressourcen
- Community-Templates zum Laden und Anpassen

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

Entwicklungsserver starten:
```bash
npm run dev
```

Die Anwendung ist dann unter `http://localhost:5173` verfügbar.

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
  └── store/            # Zustand-Management mit Zustand

public/                 # Statische Assets
  └── community-templates/ # Vordefinierte Templates
```

## Workflow

1. Allgemeines - Grundlegende Informationen festlegen
2. Didaktische Grundlagen - Probleme, Ziele und Lösungsansätze definieren
3. Akteure - Beteiligte Personen und Gruppen anlegen
4. Lernumgebungen - Ressourcen, Werkzeuge und Dienste zuordnen
5. Warenkorb - WLO-Ressourcen suchen und vormerken
6. Unterrichtsablauf - Sequenzen, Phasen und Aktivitäten gestalten
7. KI Ablauf - Template optimieren und WLO-Inhalte integrieren
8. Vorschau - Ergebnisse visualisieren und exportieren

## Features im Detail

### KI-Unterstützung
- Generierung und Optimierung von Unterrichtsabläufen
- Intelligente Filterkriterien für WLO-Ressourcen
- Lernen aus Community-Templates

### WLO-Integration
- Direkte Suche in der WLO-Datenbank
- Warenkorb-System für Ressourcen
- Automatische Metadaten-Extraktion
- Filterung nach Bildungsstufe, Fach und Inhaltstyp

### Visualisierung
- Interaktiver Ablaufgraph
- Tabellarische Übersicht
- WLO-Ressourcen-Vorschau
- PDF-Export

### Template-Management
- Speichern/Laden von Templates
- Community-Templates
- Beispiel-Templates
- JSON-Export/Import

## Lizenz

Apache 2.0