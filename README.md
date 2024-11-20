# Didaktischer Template-Prozessor

Ein webbasiertes Tool zum Erstellen und Verwalten von didaktischen Templates mit einem visuellen Flow-Editor. Entwerfen Sie Lernsequenzen, verwalten Sie Akteure und Lernumgebungen und visualisieren Sie den Lernprozess.

## Voraussetzungen

- Node.js (Download unter: https://nodejs.org/)
- npm (wird mit Node.js mitgeliefert)

## Installation

1. Repository klonen
2. Abhängigkeiten installieren:
```bash
npm install
```

## Erste Schritte

### Entwicklungsserver mit Proxy starten:

```bash
# Terminal 1: Proxy-Server starten
npm run proxy

# Terminal 2: Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter `http://localhost:5173` verfügbar.
Der Proxy-Server läuft auf Port 3001 und ermöglicht den Zugriff auf die WLO-API.

## Funktionen

### 1. Template-Verwaltung
- Erstellen und Bearbeiten von didaktischen Templates
- Speichern und Laden von Templates als JSON-Dateien
- Beispiel-Templates enthalten
- PDF-Export mit detaillierter Aufbereitung

### 2. Visuelle Komponenten

#### Allgemeine Einstellungen
- Template-Metadaten festlegen
- Titel, Beschreibung und Schlüsselwörter definieren
- Versionsinformationen verwalten

#### Patternelemente
- Probleme und Lernziele definieren
- Einflussfaktoren festlegen
- Kontext und Lösungen konfigurieren

#### Akteure
- Akteure erstellen und verwalten (Lehrkräfte, Schüler, Gruppen)
- Akteur-Eigenschaften definieren:
  - Demografische Daten
  - Bildungsniveau
  - Kompetenzen
  - Lernanforderungen

#### Lernumgebungen
- Lernräume konfigurieren
- Ressourcen verwalten:
  - Lernmaterialien
  - Werkzeuge
  - Dienste

#### Unterrichtsablauf
- Lernsequenzen gestalten
- Phasen und Aktivitäten erstellen
- Rollen und Aufgaben definieren
- Bewertungskriterien festlegen

#### Vorschau
- Visueller Flow-Graph mit:
  - Sequenzstruktur
  - Prozessablauf
  - Parallele Aktivitäten
  - Rollenbeziehungen
- Tabellenansicht für detaillierte Sequenzinformationen
- Rohdatenansicht für JSON-Struktur

### 3. Visualisierungsmerkmale

Der Flow-Graph verwendet verschiedene Farben und Stile:

- **Strukturelle Beziehungen**
  - Enthält/Implementiert (gestrichelte Linien)
  - Referenzen (gestrichelte Linien)

- **Prozessablauf**
  - Sequenzieller Ablauf (orange, animiert)
  - Parallele Ausführung (lila, animiert)

- **Knotentypen**
  - Lösung/Ansatz (grau)
  - Lernsequenzen (blau)
  - Phasen (grün)
  - Aktivitäten (gelb)
  - Rollen (orange)
  - Akteure (pink)
  - Lernumgebungen (lila)
  - Materialien (rot)
  - Werkzeuge (indigo)
  - Dienste (türkis)

## Projektstruktur

```
src/
├── components/         # Wiederverwendbare UI-Komponenten
│   ├── course/        # Komponenten für den Unterrichtsablauf
│   ├── environments/  # Komponenten für Umgebungsverwaltung
│   └── preview/       # Visualisierungskomponenten
├── pages/             # Hauptseiten-Komponenten
├── store/             # Zustandsverwaltung
└── lib/              # Hilfsfunktionen und Typen
```

## Datenmodell

Die Template-Struktur folgt einem hierarchischen Modell:
- Sequenzen enthalten Phasen
- Phasen enthalten Aktivitäten
- Aktivitäten enthalten Rollen
- Rollen referenzieren Akteure und Umgebungen
- Umgebungen enthalten Materialien, Werkzeuge und Dienste

## Mitwirken

1. Repository forken
2. Feature-Branch erstellen
3. Änderungen committen
4. Zum Branch pushen
5. Pull Request erstellen