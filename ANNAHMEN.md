# Angenommene Werte in Version 5.0

Für diese Punkte lagen keine echten Daten vor. Sie stehen als plausible
Annahme im Code und sind dort jeweils auch kommentiert. **Bitte prüfen und
ersetzen, bevor die Seite live geht** — falsche Preise und Kapazitäten
kosten Anfragen, falsche Koordinaten kosten Laufkundschaft.

| Wert | Angenommen | Wo steht das? |
|---|---|---|
| Maximale Personenzahl | **60** (Stehempfang ab ca. 45) | `index.html` und `vermietung/*` (JSON-LD `maximumAttendeeCapacity`) sowie in den Texten |
| Vermietung | **299 € Raummiete** pauschal für den Abend, inkl. MwSt., Getränke nach Verbrauch. Bewusst **kein** Mindestumsatz — der lässt sich vorher nicht schätzen. | `vermietung/index.html`, `vermietung/firmenevents/index.html` (Text + JSON-LD `priceSpecification`), Kacheln auf der Startseite |
| Tasting | **49 € pro Person**, inkl. MwSt., 5 Drinks, 4–15 Personen | `vermietung/tastings/index.html`, erwähnt auf `/vermietung/` |
| Cocktailkurs | **59 € pro Person**, inkl. MwSt., 3 Signature-Drinks nach Barkeeper's Choice, 6–12 Personen, ca. 2,5 h | `cocktailkurse/index.html` |
| Zigarrenabend | **59 € pro Person**, inkl. MwSt., 1 Zigarre + 2 Drinks, 6–20 Personen; Kombi mit Tasting **89 €** | `vermietung/zigarrenabende/index.html` |
| Snackplatte | belegte Brötchen + Snackplatte sind bei **allen** Programmen ohne Aufpreis enthalten | Kurs-, Tasting-, Zigarren- und Firmenseite, FAQ auf `/vermietung/` |
| Kurs unter 6 Personen | ab 2 Personen möglich, dann **individuelles Angebot statt Listenpreis** | FAQ auf `cocktailkurse/index.html` und `/vermietung/` |
| Antwortzeit | „meist noch am selben Abend" | Anfrage-Fenster, Kontaktbereich, Vermietungsseiten |
| Anzahlung | **Pflicht bei jeder Buchung**: Die Raummiete (299 €) wird bei der Zusage im Voraus fällig und mit der Schlussrechnung verrechnet. *Angenommen, dass die volle Raummiete die Anzahlung ist — falls ihr einen anderen Betrag nehmt, hier und in der FAQ ändern.* | FAQ auf `vermietung/index.html` (Text + JSON-LD), `priceSpecification` auf `/vermietung/` und `/vermietung/firmenevents/` |
| Vorlaufzeit | **mindestens 2 Wochen**; das Wunschdatum im Anfrage-Fenster ist technisch auf heute + 14 Tage begrenzt (`VORLAUF_TAGE` in `js/main.js`) | `js/main.js`, FAQ und Fakten auf `vermietung/index.html` |
| Barrierefreiheit | Zugang **nicht** stufenlos | FAQ auf `vermietung/index.html` |
| Geokoordinaten | **50.8318 / 12.9265** (ungefähr Hartmannstraße) | `index.html`, `vermietung/index.html`, `cocktailkurse/index.html` (JSON-LD `geo`) |
| Zahlungsmittel | **Bargeld, EC-Karte** | `index.html` (JSON-LD `paymentAccepted`) |
| Ausstattung | alkoholfreie Cocktails, buchbar für geschlossene Gesellschaften | `index.html` (JSON-LD `amenityFeature`) |
| Ablauf-/Formattexte der Angebotsseiten | frei formuliert im Ton der Startseite | alle Unterseiten |

## Preisangaben: was umgesetzt wurde und warum

Kein Ersatz für anwaltliche Prüfung, aber das ist der Rahmen, an dem sich
die Preisdarstellung jetzt orientiert:

- **§ 3 PAngV (Gesamtpreis).** Gegenüber Verbrauchern ist der Gesamtpreis
  inklusive Umsatzsteuer und aller sonstigen Bestandteile anzugeben.
  Deshalb steht an jedem Preis „inkl. MwSt.", und jede Angebotsgruppe hat
  einen `.preis-hinweis`-Absatz darunter, der sagt, was im Preis steckt
  und was nach Verbrauch dazukommt.
- **„Ab"-Preise.** Ein Startpreis ist nur zulässig, wenn der Endpreis
  vorher wirklich nicht bestimmbar ist. Da alle Positionen inzwischen
  feste Beträge haben, wurde jedes „ab" entfernt: 299 € Raummiete,
  49 € Tasting, 59 € Kurs, 59 € Zigarrenabend, 89 € Kombi. Einzige
  Ausnahme im Ton: auf der Firmenseite steht „49 oder 59 € pro Person",
  weil dort zwei konkrete Programme nebeneinander stehen — beide Beträge
  sind genannt, es bleibt also ein Festpreis je Variante.
- **§ 5a UWG (wesentliche Informationen).** Getränke nach Verbrauch,
  Pauschalcharakter der Raummiete, Anzahlungspflicht und die
  Mindestvorlaufzeit von zwei Wochen stehen sichtbar auf der Seite und
  nicht nur im Kleingedruckten.
- **Individuelle Preise.** Kurse unter sechs Personen laufen bewusst ohne
  Listenpreis. Die FAQ sagt das offen und verspricht einen verbindlichen
  Preis **vor** der Buchung — das ist der Punkt, an dem eine
  Preisangabe sonst angreifbar würde.
- **§ 7 PAngV (Gaststättenpreisverzeichnis).** Betrifft nicht die
  Website, sondern den Aushang vor Ort: Preisverzeichnis am Eingang und
  im Gastraum. Wenn ihr die Kartenpreise ändert, den Aushang mitziehen.
- **Anzahlung.** Dass eine Anzahlung Pflicht ist, muss vor Vertragsschluss
  klar sein — steht jetzt in der FAQ, im `.preis-hinweis` der Firmenseite
  und im JSON-LD. Für die Rückzahlung bei Absagen braucht ihr eine
  Stornoregelung; die steht bewusst **nicht** auf der Website, weil sie in
  eure Bestätigungsmail oder AGB gehört.

## Nicht gesetzt (bewusst)

- **`smokingAllowed`** ist im Schema bewusst nicht gesetzt. Auf der
  Website steht jetzt die Regel, die ihr genannt habt: geraucht wird auf
  der Terrasse, drinnen bleibt es rauchfrei, Ausnahme sind die
  Zigarrenabende in geschlossener Runde. Das Feld im Schema kennt nur
  ja/nein und würde diese Regel falsch abbilden.
- **`aggregateRating`** ist nirgends gesetzt. Google-Rezensionen dürfen
  nicht als eigene Bewertung ausgezeichnet werden; das wäre ein Verstoß
  gegen die Richtlinien.
- **Place ID** steht nicht im Code, sondern gehört als GitHub-Variable
  `GOOGLE_PLACE_ID` in das Repository (siehe ANLEITUNG.md, Abschnitt 3).
- **`events@`-Adresse**: alle Anfrage-Knöpfe schreiben derzeit an
  `info.kuenstlerbar@web.de`. Wenn eine eigene Adresse kommt, in den
  `data-user`/`data-domain`-Attributen der `.js-mail`-Links tauschen.

## Bilder

`vermietung-tafel`, `firmenevents-tische`, `tasting-flight`,
`zigarrenabend-tumbler` und `cocktailkurs-shaker` sind KI-generierte
Stimmungsbilder im Stil der Bar (dunkles Holz, warmes Licht, beleuchtetes
Flaschenregal) — sie zeigen **nicht** die echten Räume. Sobald echte Fotos
dieser Anlässe existieren, bitte unter denselben Dateinamen ersetzen.
