# Künstlerbar Website 5.0 – Anleitung

Diese Datei erklärt, wie die Website gepflegt wird, ohne
Programmierkenntnisse. Alle Dateien liegen in diesem Ordner
(`kuenstlerbar-website-v5`). Zum Bearbeiten reicht ein Texteditor
(z. B. [VS Code](https://code.visualstudio.com/), kostenlos).

Öffne eine Datei per Rechtsklick → „Öffnen mit" → Editor
(nicht per Doppelklick, das öffnet sie im Browser).

**Neu in Version 5.0**

- Aus dem One-Pager sind **echte Unterseiten** geworden. Jede hat eigenen
  Titel, eigene Beschreibung und kann bei Google einzeln ranken:
  - `/` Startseite
  - `/getraenkekarte/` vollständige Karte
  - `/vermietung/` plus `/vermietung/firmenevents/`, `/vermietung/tastings/`,
    `/vermietung/zigarrenabende/`
  - `/cocktailkurse/`
  - `/impressum/`, `/datenschutz/`, `404.html`
- **Strukturierte Daten** (JSON-LD) auf jeder Seite: Bar, Website, Seite,
  Brotkrumen, komplette Getränkekarte, Vermietungs-Service, Kurs.
- **Öffnungszeiten** kommen aus `assets/data/hours.json` und können
  wöchentlich automatisch aus dem Google-Business-Profil gezogen werden.
- **Navigation neu**: kein Kapselrahmen, keine Farbfläche mehr, sondern
  eine feine Goldlinie, die zum aktiven Punkt wandert. Reihenfolge:
  Die Bar, Karte, Vermietung, Galerie, Kontakt. Unter **Vermietung**
  klappt ein Untermenü mit allen fünf Angeboten auf, auf dem Handy per
  Tipp auf- und wieder zuklappbar.
- **Anfrage-Fenster**: Knöpfe mit `class="js-anfrage"` öffnen ein Fenster
  mit Anlass, Datum, Personenzahl und Telefon. Daraus entsteht eine
  fertige E-Mail. Nichts wird gespeichert oder im Hintergrund verschickt.
- **Glanz- und Partikeleffekte entfernt** (Bilder, Knöpfe, Hero), ebenso
  der mitlaufende Goldstreifen am oberen Seitenrand.
- **Getränke nur noch auf `/getraenkekarte/`** — dort stehen jetzt auch
  die Barkeeper-Empfehlungen. Die Startseite verweist nur darauf.
- **Hero-Video** möglich, mit Standbild als Rückfall. Derzeit
  ausgeschaltet, siehe Abschnitt 5.

---

## 1. Die Getränkekarte aktualisieren

**Datei:** `js/menu-data.js`

Weiterhin die einzige Datei für Preise, neue Drinks und Verfügbarkeit.
Startseite (Auszug: nur Cocktails) und `/getraenkekarte/` (alles) bauen
sich daraus automatisch.

### Preis ändern

```js
{ name: "Espresso Martini", zutaten: "Vodka, Kahlúa, Espresso, Rohrzucker", preis: "11,00" },
```

`"11,00"` durch den neuen Preis ersetzen. Immer mit Komma, ohne €-Zeichen.

### Drink vorübergehend ausblenden

`, aus: true` ans Ende der Zeile hängen. Zum Wieder-Einblenden löschen.

### Drink löschen / hinzufügen

Zeile komplett löschen bzw. eine bestehende Zeile kopieren und anpassen.
`zutaten` ist optional. `, tipp: true` gibt das goldene Abzeichen
„Empfehlung".

### Neue Kategorie

```js
{
  id: "specials",
  titel: "Specials",
  hinweis: "nur im Sommer",
  items: [
    { name: "Sommerdrink", zutaten: "…", preis: "9,00" },
  ]
},
```

`id` klein, ohne Umlaute und Leerzeichen, einmalig.

### ⚠️ Nach JEDER Kartenänderung: einmal Schema neu bauen

```bash
node scripts/build-menu-schema.cjs
```

Das schreibt die Karte auch in die strukturierten Daten von
`/getraenkekarte/`. Ohne diesen Schritt zeigt Google veraltete Preise.
Wenn kein Node installiert ist: die Seite funktioniert trotzdem, nur die
Suchmaschinen-Auszeichnung ist dann nicht mehr aktuell.

---

## 2. Texte ändern

Jede Seite ist eine eigene Datei:

| Seite | Datei |
|---|---|
| Startseite | `index.html` |
| Getränkekarte | `getraenkekarte/index.html` |
| Vermietung | `vermietung/index.html` |
| Firmenevents | `vermietung/firmenevents/index.html` |
| Tastings | `vermietung/tastings/index.html` |
| Zigarrenabende | `vermietung/zigarrenabende/index.html` |
| Cocktailkurse | `cocktailkurse/index.html` |
| Impressum / Datenschutz | `impressum/index.html`, `datenschutz/index.html` |
| Fehlerseite | `404.html` |

Die ausgelieferten Dateien enthalten bewusst **keine Kommentare**, damit
im Quelltext der Website nichts steht, was Besucher nichts angeht. Zur
Orientierung dienen die `id`-Namen der Abschnitte: `#bar`, `#karte`,
`#gruppen`, `#galerie`, `#kontakt`, auf den Unterseiten `#formate` und
`#fragen`.

Text steht immer zwischen einem öffnenden und einem schließenden Tag;
die spitzen Klammern selbst bitte nicht anfassen. Was zwischen
`<span class="script-accent">` steht, erscheint in goldener
Schreibschrift.

**Wenn sich ein Titel oder eine Beschreibung ändert**, bitte oben im
`<head>` mitziehen: `<title>`, `<meta name="description">`,
`og:title`, `og:description` — und, falls es um die Bar selbst geht,
die entsprechende Stelle im JSON-LD darunter.

---

## 3. Öffnungszeiten

Es gibt jetzt **eine** Quelle: `assets/data/hours.json`.

```json
{
  "updated": "2026-07-27T00:00:00Z",
  "source": "manuell",
  "periods": [
    { "days": ["We", "Th"], "opens": "19:00", "closes": "01:00" },
    { "days": ["Fr", "Sa"], "opens": "19:00", "closes": "03:00" }
  ],
  "closed": ["Su", "Mo", "Tu"]
}
```

Kürzel: `Su Mo Tu We Th Fr Sa`. Zeiten nach Mitternacht bleiben als
`"01:00"` bzw. `"03:00"` stehen — das ist so korrekt.

Nach dem Ändern:

```bash
node scripts/build-hours.cjs
```

Das Skript sucht auf der Startseite die Tabelle `<table class="hours">`
und das `openingHoursSpecification` im JSON-LD und schreibt beide neu.
Fehlt oder klemmt `hours.json`, ändert es nichts und die bisherigen
Zeiten bleiben stehen. Eine leere Tabelle gibt es nie.

### Automatisch mit Google abgleichen

`.github/workflows/sync-hours.yml` holt die Zeiten jeden Sonntag um
04:00 UTC aus dem Google-Business-Profil (über die Places API) und
committet sie, wenn sie sich geändert haben.

Einmalig einzurichten, im GitHub-Repository unter
**Settings → Secrets and variables → Actions**:

| Art | Name | Inhalt |
|---|---|---|
| Secret | `GOOGLE_PLACES_API_KEY` | API-Key, eingeschränkt auf „Places API (New)", **ohne** Referrer-Beschränkung |
| Variable | `GOOGLE_PLACE_ID` | Place ID der Künstlerbar (über den Google Place ID Finder ermitteln) |

Der Key darf **nie** in einer Datei im Ordner `js/` landen — er wäre
sonst öffentlich abrufbar und liefe auf eure Rechnung.

**Wichtig:** Damit spiegelt die Website exakt das Google-Profil. Werden
dort später Montag und Dienstag als Vermietungszeiten eingetragen,
ändert sich automatisch die Website.

---

## 3b. Anfrage-Fenster anpassen

Das Fenster steht als `<dialog id="anfrage-dialog">` am Ende jeder Seite,
auf der angefragt werden kann. Zu ändern gibt es dort selten etwas:

- **Empfängeradresse**: `data-user` und `data-domain` am `<dialog>` —
  und zusätzlich an jedem Knopf mit `class="js-mail"` (der Knopf ist der
  Rückfall, wenn JavaScript aus ist).
- **Auswahlliste „Worum geht es?"**: die `<option>`-Zeilen im Fenster.
  Wer eine neue Zeile ergänzt, sollte sie am passenden Knopf auch als
  `data-anlass="…"` eintragen, dann ist sie dort vorausgewählt.
- **Felder**: jedes Feld ist ein `<div class="feld">` mit `label` und
  `input`. Der Name im `name="…"` landet in der fertigen Mail.
- **Vorlaufzeit fürs Wunschdatum**: In `js/main.js` steht ganz oben im
  Dialog-Abschnitt `var VORLAUF_TAGE = 14;`. Die Zahl ist der einzige
  Ort, an dem die zwei Wochen festgelegt sind — sie setzt das `min` am
  Datumsfeld, blendet den Hinweis darunter ein („Frühestens 14.08.2026 …")
  und blockt das Abschicken bei zu frühen Terminen. Wenn ihr die Frist
  ändert, denkt an die Texte: FAQ „Wie früh müssen wir anfragen?" und die
  Fakten-Kachel „Wie früh" auf `vermietung/index.html`.

## 4. Fotos austauschen

**Ordner:** `assets/img/`

Am einfachsten: neues Foto mit **exakt demselben Dateinamen** ablegen.
Sonst in der jeweiligen HTML-Datei die `<img …>`-Zeile anpassen:

```html
<img src="/assets/img/vermietung-tafel.jpg" width="1264" height="848" alt="Beschreibung" loading="lazy">
```

- `alt` bitte immer sinnvoll ausfüllen (Barrierefreiheit und Google)
- `width`/`height` müssen dem echten Seitenverhältnis entsprechen, sonst
  wackelt das Layout beim Laden

**Bilder der Unterseiten:** `vermietung-tafel` und `firmenevents-tische`
sind echte Fotos aus eurem Bilderordner. `tasting-flight`,
`zigarrenabend-tumbler` und `cocktailkurs-shaker` sind noch generierte
Stimmungsbilder im Stil der Bar. Sobald es echte Fotos von einem Tasting,
einem Zigarrenabend oder einem Kurs gibt, bitte unter demselben
Dateinamen austauschen.

**og:image** (`assets/img/og-kuenstlerbar.jpg`, 1200 × 630) ist der
Ausschnitt, den Facebook, WhatsApp und Co. beim Teilen zeigen. Er ist aus
dem echten Tresen-Foto geschnitten.

---

## 5. Hero-Video

> **Aktuell ausgeschaltet.** In `index.html` steht die Hero-Sektion als
> `<section class="hero">` ohne `data-video`. Zum Wiedereinschalten das
> Attribut ergänzen:
>
> ```html
> <section class="hero" data-video="/assets/video/hero-tresen">
> ```
>
> Der Kommentar direkt darüber in `index.html` erinnert daran.

Die Startseite kann ein leise loopendes Video hinter der Überschrift
zeigen. Erwartet werden zwei Dateien:

```
assets/video/hero-tresen.mp4
assets/video/hero-tresen.webm
```

Ist keine davon vorhanden, bleibt automatisch das Standbild stehen —
kaputt geht nichts.

Regeln, die schon eingebaut sind:
- Auf Handys, bei „weniger Bewegung" und im Datensparmodus wird das Video
  gar nicht erst geladen
- Lädt das Video länger als 5 Sekunden, bricht main.js das Laden ab und es
  bleibt beim Standbild — kein endloses Warten auf langsamen Verbindungen
- Ton ist immer aus, kein Bedienelement
- Poster/Rückfall ist `assets/img/hero-bar-panorama.jpg`, zusätzlich hat
  das `<video>` selbst `assets/img/hero-bar-video-poster.jpg` als `poster`

Aktuell liegt dort ein Ausschnitt aus eurem eigenen Material: ein
Vorwärts-Rückwärts-Loop (Boomerang) aus 1,8 Sekunden Rohmaterial, dadurch
kein harter Sprung zum Anfang, sondern ein Zurückschwenken. Bewusst der
Moment ohne die Pendelleuchten gewählt (Neonschild „Künstler Bar" und
Flaschenregal), damit die Lampen nicht im Bild dominieren. Läuft im
Browser mit `playbackRate 0.45` spürbar langsamer, als das Rohmaterial
hergibt.

Ziel für ein neues Video: unter 3 MB, 1920 × 1080, möglichst ohne
erkennbaren Anfang und Ende. Boomerang-Schnitt (Vorwärts + Rückwärts
aneinandergehängt) plus Umwandlung geht mit ffmpeg:

```bash
ffmpeg -ss 0 -t 1.8 -i rohmaterial.mp4 -filter_complex "[0:v]crop=1080:608:0:490,scale=1920:1080,fps=25,format=yuv420p,split=2[fwd][tmp];[tmp]reverse[rev];[fwd][rev]concat=n=2:v=1:a=0[out]" -map "[out]" -an -c:v libx264 -crf 22 -preset slow -movflags +faststart assets/video/hero-tresen.mp4
ffmpeg -i assets/video/hero-tresen.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 assets/video/hero-tresen.webm
```

**Selbst austauschen, ohne ffmpeg:** einfach die beiden Dateien in
`kuenstlerbar-website-v5/assets/video/` überschreiben. Die Namen müssen
`hero-tresen.mp4` und `hero-tresen.webm` bleiben, dann zieht die Seite das
neue Material ohne weitere Änderung. Nur eine MP4-Datei reicht auch; die
WebM-Datei ist Kür, sie spart Ladezeit. Das Rohmaterial aus dem Drive
liegt hier: `Vorlagen von Künstlerbar/Videos Drive/1.MOV` bis `4.MOV`.

---

## 6. Farben und Schriften

**Datei:** `css/style.css`, ganz oben.

- `:root { … }` = Schema **„Wein"** (Standard)
- `html[data-theme="dark"] { … }` = Schema **„Nacht"**

Gold, Kupfer und Schriften gelten in beiden Schemata. Nach einer
Farbänderung bitte beide Varianten prüfen (Umschalter in der Fußzeile).

---

## 7. Neue Seite anlegen

1. Ordner anlegen, darin `index.html` — der Ordnername ist die URL
   (`/kurse/index.html` wird zu `kuenstlerbar.de/kurse/`)
2. Kopf und Fuß aus einer bestehenden Unterseite kopieren
3. `<title>`, `description`, `canonical`, `og:*` und das JSON-LD anpassen
4. Seite in `sitemap.xml` eintragen
5. Von passenden Seiten aus verlinken

---

## 8. Lokal ansehen

```bash
node .serve.cjs
```

Dann [http://localhost:8099](http://localhost:8099) öffnen. Der kleine
Server wird gebraucht, weil die Unterseiten Ordner-URLs benutzen — ein
Doppelklick auf `index.html` zeigt die Startseite zwar an, die Links auf
die Unterseiten gehen dann aber ins Leere.

---

## 9. Veröffentlichen

Den Inhalt dieses Ordners ins Wurzelverzeichnis der Domain hochladen
(per FTP, Netlify, GitHub Pages …). Es gibt keinen Server-Code.

Beim Hoster darauf achten:
- Ordner-URLs müssen automatisch die `index.html` ausliefern (Standard
  bei allen gängigen Hostern)
- `404.html` als Fehlerseite hinterlegen
- Nach dem Umzug in der Search Console `sitemap.xml` einreichen und die
  neuen URLs zur Indexierung anmelden

---

## Kurzübersicht

| Ich möchte … | … ändere |
|---|---|
| Preis oder Drink ändern | `js/menu-data.js`, danach `node scripts/build-menu-schema.cjs` |
| Öffnungszeiten ändern | `assets/data/hours.json`, danach `node scripts/build-hours.cjs` |
| Text einer Seite ändern | die jeweilige `index.html` |
| Foto austauschen | Datei in `assets/img/` ersetzen |
| Farben ändern | `css/style.css` |
| Neue Seite | neuer Ordner + `sitemap.xml` |
