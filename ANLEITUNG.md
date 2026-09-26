# Künstlerbar Website 6.0 – Anleitung

Diese Datei erklärt, wie die Website gepflegt wird, ohne
Programmierkenntnisse. Zum Bearbeiten reicht ein Texteditor
(z. B. [VS Code](https://code.visualstudio.com/), kostenlos).

**Neu in Version 6.0**

- **Nur noch ein Design:** schwarz. Der Umschalter hell/dunkel ist weg.
- **Neue Schriften:** Bodoni Moda für Überschriften, Hanken Grotesk für
  Text. Die goldene Schreibschrift in den Überschriften gibt es nicht mehr.
- **Ladescreen:** Beim ersten Aufruf wirft der Angler aus dem Logo die
  Olive aus. Dauert das Laden länger, holt er ein und wirft neu aus, bis
  die Seite fertig ist. Pro Browser-Sitzung nur einmal, bei „weniger
  Bewegung“ gar nicht. Ein Klick überspringt ihn.
- **Logo als echte Vektorgrafik:** `assets/img/logo.svg` (ganzes Logo) und
  `assets/img/logo-teile.svg` (in Teile zerlegt für den Ladescreen).
- **Mobiles Menü** als schwarzer Vollbild-Vorhang von oben, mit neuem
  Menü-Symbol. Sprachwahl DE / EN ganz rechts (Desktop) bzw. ganz unten
  im Menü (Handy).
- **Englische Seiten** unter `/en/` (siehe Abschnitt 10).
- **Bilder** ohne Rahmen und runde Ecken, auf dem Handy randlos. Beim
  Scrollen zoomen große Bilder langsam heraus, Galeriebilder öffnen sich
  wie ein Vorhang.
- **Knöpfe** eckig, Sektionen mit Nummer und Linie klar getrennt.

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
die spitzen Klammern selbst bitte nicht anfassen. Die kleine Zeile über
jeder Sektion (`<p class="marke"><b>02</b>Karte</p>`) ist Nummer und Name
der Sektion.

**Wichtig:** Jede Textänderung auch auf der englischen Seite unter `/en/`
nachziehen (siehe Abschnitt 10).

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

> **Aktuell ausgeschaltet.** In `index.html` (und `en/index.html`) steht
> die Hero-Sektion als `<section class="hero" …>` ohne `data-video`. Zum
> Wiedereinschalten das Attribut ergänzen:
>
> ```html
> <section class="hero" data-video="/assets/video/hero-tresen" aria-label="Künstlerbar">
> ```

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
- Standbild und Poster ist `assets/img/hero-bar-video-poster.jpg`

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
`kuenstlerbar-website-v6/assets/video/` überschreiben. Die Namen müssen
`hero-tresen.mp4` und `hero-tresen.webm` bleiben, dann zieht die Seite das
neue Material ohne weitere Änderung. Nur eine MP4-Datei reicht auch; die
WebM-Datei ist Kür, sie spart Ladezeit. Das Rohmaterial aus dem Drive
liegt hier: `Vorlagen von Künstlerbar/Videos Drive/1.MOV` bis `4.MOV`.

---

## 6. Farben und Schriften

**Datei:** `css/style.css`, ganz oben unter `:root { … }`.

- `--gold` ist die Akzentfarbe (Knöpfe, Logo, Linien)
- `--schwarz` / `--flaeche` sind die beiden Hintergründe, die sich von
  Sektion zu Sektion abwechseln (`sektion--tief` = etwas heller)
- Schriften liegen in `assets/fonts/` und werden nicht von Google geladen

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

## 10. Englische Seiten

| Deutsch | Englisch |
|---|---|
| `/` | `/en/` |
| `/getraenkekarte/` | `/en/drinks/` |
| `/vermietung/` | `/en/private-hire/` |
| `/vermietung/firmenevents/` | `/en/private-hire/corporate-events/` |
| `/vermietung/tastings/` | `/en/private-hire/tastings/` |
| `/vermietung/zigarrenabende/` | `/en/private-hire/cigar-evenings/` |
| `/cocktailkurse/` | `/en/cocktail-classes/` |
| `/impressum/` | `/en/legal-notice/` |
| `/datenschutz/` | `/en/privacy/` |

**Getränkekarte:** Die englische Karte baut sich aus derselben
`js/menu-data.js` wie die deutsche. Preise und Ausblenden also nur
**einmal** ändern. Die Übersetzung der Zutaten und Kategorien steht in
`js/menu-en.js` als kleines Wörterbuch. Taucht bei einem neuen Drink eine
Zutat auf, die dort fehlt, erscheint sie auf Englisch einfach auf Deutsch.
Dann eine Zeile ergänzen, z. B.:

```js
"Holunder": "elderflower",
```

Die PDF-Karte gibt es nur auf Deutsch, die englische Seite weist darauf hin.

## Kurzübersicht

| Ich möchte … | … ändere |
|---|---|
| Preis oder Drink ändern | `js/menu-data.js`, danach `node scripts/build-menu-schema.cjs` |
| Öffnungszeiten ändern | `assets/data/hours.json`, danach `node scripts/build-hours.cjs` |
| Text einer Seite ändern | die jeweilige `index.html` |
| Foto austauschen | Datei in `assets/img/` ersetzen |
| Farben ändern | `css/style.css` |
| Neue Zutat auf Englisch | `js/menu-en.js` |
| Neue Seite | neuer Ordner + `sitemap.xml` |
