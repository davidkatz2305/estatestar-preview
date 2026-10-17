# ESTATESTAR – Originalkopie, Schritt 1

Stand: 18.10.2026. Diese Testseite bildet den öffentlich erreichbaren Auftritt von https://estatestar.de/ nach. Davids Korrektur ist maßgeblich: zuerst die bestehende Website vollständig übernehmen, anschließend einzelne Elemente gezielt verbessern. Der vorherige Neuentwurf ist durch diese Originalkopie ersetzt; er bleibt in der Git-Historie und lokal unter `research/entwurf-vor-originalabgleich/` erhalten.

## Umfang

14 deutsche und englische Seiten: Startseite, vier Foto-Unterseiten je Sprache sowie Impressum und Datenschutz. Originales HTML, CSS, Schriften, Bilder und Frontend-Skripte erhalten Anordnung, Typografie, Abstände, responsive Varianten, Filter, Foto-Slider, Film-Lightbox, Team-Effekte und Menüs. Die visuellen Assets werden lokal ausgeliefert. Externe 360-Touren bleiben bei Matterport/MPskin.

Keine neue Gestaltung, keine KI-Sektion und kein zusätzliches magnetisches Einrasten in dieser Ausgangsfassung. Diese Änderungen gehören zu Schritt 2 und sollen einzeln vergleichbar umgesetzt werden.

## Betrieb

GitHub Pages: `main`, Verzeichnis `/`, `.nojekyll`. Vorschau: https://davidkatz2305.github.io/estatestar-preview/

Alle lokalen URLs verwenden den Projektpfad `/estatestar-preview/`. Zur lokalen Prüfung den übergeordneten Ordner mit `python3 -m http.server 8766 --bind 127.0.0.1` bereitstellen und `http://127.0.0.1:8766/estatestar-preview/` aufrufen.

`index.html` und die Unterordner enthalten die statischen Seiten. `wp-content/` und `wp-includes/` enthalten die übernommenen öffentlichen Frontend-Dateien. `scripts/mirror-original.py` dokumentiert den Import; Rohsnapshots und Prüfungen liegen im nicht veröffentlichten Verzeichnis `research/original-mirror/`.

## Grenzen der Testkopie

- Das ursprüngliche WordPress-/Elementor-Backend ist nicht zugänglich. Diese Kopie ist eine eigenständige statische Website, kein importiertes Elementor-Projekt.
- Das Kontaktformular sieht aus wie im Original. `preview-guard.js` verhindert jede Formularübermittlung und zeigt beim Absenden einen Hinweis mit der Kontaktadresse. Telefon und E-Mail-Links funktionieren.
- Die 17 Portfoliofilme werden aus den bereits erstellten 720p-Testdateien abgespielt, damit alle Dateien unter GitHubs Einzeldateigrenze bleiben. Inhalt, Dauer und Bildrate bleiben erhalten. Originale liegen lokal unter `research/originale-und-pruefung/original-videos/`. Die Showreels und Digital-Lab-Hintergründe verwenden die Originalfassungen.
- Die Originaldatei `EurostileExtended.ttf` antwortet bereits auf estatestar.de mit 404. Die gleichen vorhandenen Schrift-Alternativen greifen auch hier. Es wurde keine Ersatzgestaltung eingeführt.
- Alle Seiten tragen `noindex,nofollow`. Die rechtlichen Texte wurden als Teil der Originalkopie unverändert übernommen; eine Anpassung an den späteren Produktivbetrieb ist ein eigener Schritt.

## Prüfung

14 HTML-Seiten und 150 eingebettete Skripte syntaktisch geprüft; keine fehlenden direkt verlinkten lokalen Dateien und keine internen Seitenlinks zurück zum Live-Auftritt. Im Browser geprüft: Desktop 1440×900, Mobil 390×844, Tablet 820×1180; Foto-Filter, Navigation, Foto-Unterseite, Video-Lightbox, mobile Hintergrundwiedergabe und unterbundener Formularversand. Abschnittsmaße mit dem Original verglichen. Bildschirmnachweise und Prüfprotokolle liegen unter `research/`.

## Rechte

Marke, Portfolio, Fotos, Filme und Porträts: ESTATESTAR bzw. die jeweiligen Rechteinhaber. Die öffentliche Testkopie ist vom Auftraggeber autorisiert. Originale Lizenzhinweise in Drittanbieterdateien bleiben erhalten. Die produktive Strato-Website wird nicht verändert.
