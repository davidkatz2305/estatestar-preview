# ESTATESTAR – responsive Website-Vorschau

Statische, eigenständig lauffähige Vorschau mit originalem ESTATESTAR-Material, acht vertikalen Abschnitten, nativem Scroll Snap auf Desktop und Mobil sowie einer zusätzlichen KI-Sektion. Stand: 18.10.2026.

## Betrieb

Kein Build, keine Installation: `index.html`, `styles.css`, `app.js`, `data.js`, `assets/` und `docs/` werden direkt ausgeliefert. GitHub Pages: Branch `main`, Verzeichnis `/`. `.nojekyll` verhindert unnötige Verarbeitung. Die Testseite besitzt `noindex,nofollow` und keine eigene Domain-Konfiguration.

Lokal: `python3 -m http.server 8766 --bind 127.0.0.1` im Projektordner.

## Inhalte und Funktionen

- Logo, Originalfotografien, Filmvorschauen, Filme und Team stammen von der öffentlich erreichbaren Website estatestar.de. 117 Fotografien, 18 Filmeinträge (17 unterschiedliche Filme), sechs externe Rundgänge.
- Bilder sind als WebP optimiert, die Galerie öffnet große Ansichten mit Tastaturbedienung.
- Portfolio-Videos liegen als 1280×720 H.264/AAC-Versionen vor; Dauer, Bildformat und Bildrate bleiben erhalten. Größere Originaldownloads sind außerhalb des Repositorys lokal gesichert.
- Der Hintergrundfilm wählt Hoch-/Querformat, pausiert außerhalb des sichtbaren Abschnitts und respektiert reduzierte Bewegung. Der Nutzer kann die Wiedergabe steuern.
- Rundgänge werden erst nach Klick von Matterport/MPskin geladen. Ihre interaktiven Inhalte werden dort weiterhin gehostet.
- Kontakt öffnet ein E-Mail-Programm. Kein Formularserver und keine automatische Übermittlung.
- Die KI-Angebote sind ausdrücklich Leistungsentwürfe. Bestehende Originalfotos dienen als mögliches Ausgangsmaterial; sie sind keine KI-Referenzen.

## Bearbeiten

Inhalte: `index.html`; Gestaltung und Breakpoints: `styles.css`; Verhalten: `app.js`; Portfoliozuordnung: `data.js`. Native Scroll-Snap-Punkte liegen auf `.panel`. Keine blockierenden Wheel- oder Touch-Handler. Höhere Abschnitte bleiben innerhalb ihrer Grenzen scrollbar. Im Footer lässt sich Einrasten deaktivieren. Bilder und Texte behalten ihre natürliche Höhe.

## Dokumentation

`docs/analyse.html` enthält Ausgangsbefunde, Änderungen, KI-Empfehlungen, Primärquellen und Grenzen. `docs/datenschutz.html` beschreibt die Technik der Testseite.

Eine spätere Elementor-Übernahme erfordert einen gesonderten Umsetzungsschritt. Alternativ kann diese statische Seite auf geeigneten Webspace übernommen werden. Der bestehende Strato-Auftritt wird durch dieses Repository nicht geändert.

## Rechte

Portfolio, Marke, Fotos, Filme und Porträts: ESTATESTAR bzw. jeweilige Rechteinhaber. Veröffentlichung ausschließlich als vom Auftraggeber autorisierte ESTATESTAR-Testseite. Die lokal bereitgestellte Michroma-Schrift stammt aus der Originalwebsite; siehe `assets/OFL-Michroma.txt`.
