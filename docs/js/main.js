(function () {
  "use strict";

  var root = document.documentElement;
  var EN = root.lang === "en";
  var reduzierteBewegung = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var T = EN ? {
    menueAuf: "Open menu", menueZu: "Close menu",
    empfehlung: "Recommended",
    offenHeute: "Open tonight, ",
    ruhetagMorgen: function (h) { return "Closed today. Back tomorrow from " + h; },
    ruhetagTag: function (tag, h) { return "Closed today. Back on " + tag + " from " + h; },
    tage: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    geschlossen: "closed",
    uhr: function (s) { return s; },
    fruehestens: function (d) { return "The earliest possible date is " + d + ". We need two weeks to prepare."; },
    zuFrueh: "Please pick a date at least two weeks from today.",
    datumLocale: "en-GB",
    paket: function (p) { return "We would like to book the “" + p + "” package."; },
    mindestens: function (n) { return "at least " + n; },
    mail: ["Occasion", "Preferred date", "Time", "Number of guests", "Name", "Phone"],
    offen: "not decided yet",
    betreff: "Enquiry",
    bildZu: "Close image", bildansicht: "Image view"
  } : {
    menueAuf: "Menü öffnen", menueZu: "Menü schließen",
    empfehlung: "Empfehlung",
    offenHeute: "Heute geöffnet, ",
    ruhetagMorgen: function (h) { return "Heute Ruhetag. Morgen ab " + h + " sind wir wieder da"; },
    ruhetagTag: function (tag, h) { return "Heute Ruhetag. " + tag + " ab " + h + " geht es weiter"; },
    tage: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    geschlossen: "geschlossen",
    uhr: function (s) { return s + " Uhr"; },
    fruehestens: function (d) { return "Frühestens " + d + ", wir brauchen zwei Wochen Vorlauf."; },
    zuFrueh: "Bitte wählt einen Termin, der mindestens zwei Wochen in der Zukunft liegt.",
    datumLocale: "de-DE",
    paket: function (p) { return "Wir möchten das Paket „" + p + "“ buchen."; },
    mindestens: function (n) { return "mindestens " + n; },
    mail: ["Anlass", "Wunschdatum", "Uhrzeit", "Anzahl Personen", "Name", "Telefon für Rückfragen"],
    offen: "noch offen",
    betreff: "Anfrage",
    bildZu: "Bildansicht schließen", bildansicht: "Bildansicht"
  };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function alle(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }


  var intro = document.querySelector(".intro");
  if (intro && root.classList.contains("mit-intro")) {
    var geladen = document.readyState === "complete";
    var ersterWurfFertig = false;
    var weg = false;

    var raus = function () {
      if (weg) return;
      weg = true;
      intro.classList.add("raus");
      root.classList.add("intro-los");
      setTimeout(function () {
        root.classList.remove("mit-intro");
        root.classList.add("intro-fertig");
      }, 820);
    };

    var pruefen = function () {
      if (!ersterWurfFertig || weg) return;
      if (geladen) {
        if (intro.classList.contains("warten")) {
          intro.addEventListener("animationiteration", function einmal(e) {
            if (!e.target.classList.contains("intro-rute")) return;
            intro.removeEventListener("animationiteration", einmal);
            raus();
          });
        } else {
          raus();
        }
      } else {
        intro.classList.add("warten");
      }
    };

    window.addEventListener("load", function () { geladen = true; pruefen(); });
    setTimeout(function () { ersterWurfFertig = true; pruefen(); }, 2100);
    setTimeout(raus, 12000);
    intro.addEventListener("click", raus);
    try { sessionStorage.setItem("kb-intro", "1"); } catch (e) { }
  } else {
    root.classList.add("intro-los");
  }


  var menuRoot = document.getElementById("menu-root");
  var menuNav = document.getElementById("menu-nav");

  var UEB = EN && typeof KARTE_EN !== "undefined" ? KARTE_EN : null;

  function uebersetzeZutaten(text) {
    if (!UEB) return text;
    return text.split(/(,\s*|\s+\/\s+)/).map(function (teil) {
      if (/^(,\s*|\s+\/\s+)$/.test(teil)) return teil;
      if (UEB.woerter[teil]) return UEB.woerter[teil];
      return teil.split(" ").map(function (w) { return UEB.woerter[w] || w; }).join(" ");
    }).join("");
  }

  if (menuRoot && typeof KARTE !== "undefined") {
    KARTE.forEach(function (kat) {
      var sichtbare = kat.items.filter(function (item) { return !item.aus; });
      if (sichtbare.length === 0) return;

      var titel = UEB && UEB.kategorien[kat.id] ? UEB.kategorien[kat.id] : kat.titel;
      var hinweis = kat.hinweis ? (UEB && UEB.woerter[kat.hinweis] ? UEB.woerter[kat.hinweis] : kat.hinweis) : "";

      if (menuNav) {
        var tab = el("a", "menu-pill", titel);
        tab.href = "#karte-" + kat.id;
        menuNav.appendChild(tab);
      }

      var section = el("section", "menu-cat");
      section.id = "karte-" + kat.id;

      var head = el("div", "menu-cat-head");
      head.appendChild(el("h2", "menu-cat-title", titel));
      if (hinweis) head.appendChild(el("p", "menu-cat-note", hinweis));
      section.appendChild(head);

      var list = el("div", "menu-items");
      sichtbare.forEach(function (item) {
        var wrapper = el("div", "menu-item");
        wrapper.id = "drink-" + item.name.toLowerCase()
          .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
          .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

        var row = el("div", "menu-item-row");
        var name = el("span", "menu-item-name", UEB && UEB.namen[item.name] ? UEB.namen[item.name] : item.name);
        if (item.tipp) name.appendChild(el("span", "badge-tipp", T.empfehlung));
        row.appendChild(name);
        row.appendChild(el("span", "menu-item-dots"));
        var preis = EN ? "€" + item.preis.replace(",", ".") : item.preis + " €";
        row.appendChild(el("span", "menu-item-price", preis));
        wrapper.appendChild(row);

        if (item.zutaten) wrapper.appendChild(el("p", "menu-item-zutaten", uebersetzeZutaten(item.zutaten)));
        list.appendChild(wrapper);
      });
      section.appendChild(list);
      menuRoot.appendChild(section);
    });

    if (location.hash) {
      var ziel = document.getElementById(location.hash.slice(1));
      if (ziel) setTimeout(function () { ziel.scrollIntoView(); }, 60);
    }
  }

  if (menuRoot && menuNav) {
    var tabs = alle(".menu-pill", menuNav);
    var cats = alle(".menu-cat", menuRoot);

    var setActive = function (id) {
      tabs.forEach(function (p) {
        var on = p.getAttribute("href") === "#" + id;
        p.classList.toggle("active", on);
        if (on) {
          p.setAttribute("aria-current", "true");
          var mitte = p.offsetLeft + p.offsetWidth / 2 - menuNav.clientWidth / 2;
          menuNav.scrollTo({ left: Math.max(0, mitte), behavior: reduzierteBewegung ? "auto" : "smooth" });
        } else {
          p.removeAttribute("aria-current");
        }
      });
    };
    if (tabs[0]) tabs[0].classList.add("active");

    if ("IntersectionObserver" in window && cats.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: "-35% 0px -60% 0px" });
      cats.forEach(function (c) { spy.observe(c); });
    }
  }


  var hauptNav = document.querySelector(".main-nav");
  var toggle = document.querySelector(".nav-toggle");

  if (hauptNav) {
    alle(":scope > a, :scope > .nav-gruppe > .nav-gruppe-knopf, :scope > .sprache", hauptNav)
      .forEach(function (node, i) { node.style.setProperty("--i", i); });

    var pfad = location.pathname.replace(/index\.html$/, "");
    var marke = document.querySelector(".brand");
    var start = marke ? marke.getAttribute("href") : (EN ? "/en/" : "/");
    if (pfad !== start) {
      var beste = null;
      alle("a[href]", hauptNav).forEach(function (a) {
        if (a.closest(".sprache")) return;
        var ziel = a.getAttribute("href").split("#")[0];
        if (!ziel || ziel === start) return;
        if (pfad.indexOf(ziel) === 0 && (!beste || ziel.length > beste.ziel.length)) {
          beste = { link: a, ziel: ziel };
        }
      });
      if (beste) {
        beste.link.classList.add("active");
        beste.link.setAttribute("aria-current", "page");
        var gruppe = beste.link.closest(".nav-gruppe");
        if (gruppe) gruppe.querySelector(".nav-gruppe-knopf").classList.add("active");
      }
    }
  }

  var navSchliessen = function () {
    if (!hauptNav || !toggle) return;
    hauptNav.classList.remove("open");
    document.body.classList.remove("nav-offen");
    root.classList.remove("nav-offen");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", T.menueAuf);
  };

  if (toggle && hauptNav) {
    toggle.addEventListener("click", function () {
      var open = hauptNav.classList.toggle("open");
      document.body.classList.toggle("nav-offen", open);
      root.classList.toggle("nav-offen", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? T.menueZu : T.menueAuf);
    });
    hauptNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) navSchliessen();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && hauptNav.classList.contains("open")) { navSchliessen(); toggle.focus(); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && hauptNav.classList.contains("open")) navSchliessen();
    });
  }

  alle(".nav-gruppe").forEach(function (gruppe) {
    var knopf = gruppe.querySelector(".nav-gruppe-knopf");
    var liste = gruppe.querySelector(".nav-untermenue");
    if (!knopf || !liste) return;
    var zu = function () {
      liste.classList.remove("offen");
      knopf.setAttribute("aria-expanded", "false");
    };
    knopf.addEventListener("click", function () {
      var offen = liste.classList.toggle("offen");
      knopf.setAttribute("aria-expanded", offen ? "true" : "false");
    });
    gruppe.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { zu(); knopf.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!gruppe.contains(e.target) && window.innerWidth > 900) zu();
    });
  });

  var navZiele = alle(".main-nav a[href*='#'], .main-nav [data-spy]")
    .map(function (a) {
      var spyId = a.getAttribute("data-spy");
      if (spyId) {
        var abschnitt = document.getElementById(spyId);
        return abschnitt ? { link: a, ziel: abschnitt } : null;
      }
      var href = a.getAttribute("href") || "";
      var raute = href.indexOf("#");
      var pfadTeil = href.slice(0, raute).replace(/index\.html$/, "");
      if (pfadTeil && pfadTeil !== location.pathname.replace(/index\.html$/, "")) return null;
      var ziel = document.getElementById(href.slice(raute + 1));
      return ziel ? { link: a, ziel: ziel } : null;
    })
    .filter(Boolean);

  if (navZiele.length && "IntersectionObserver" in window) {
    var navSpy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navZiele.forEach(function (paar) {
          var on = paar.ziel === entry.target;
          paar.link.classList.toggle("active", on);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navZiele.forEach(function (paar) { navSpy.observe(paar.ziel); });
  }


  var header = document.querySelector(".site-header");
  var fxBilder = alle("[data-fx='zoom'], [data-fx='schieben']");
  var sichtbareFx = [];
  var tickt = false;

  if ("IntersectionObserver" in window && !reduzierteBewegung) {
    var fxBeobachter = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var i = sichtbareFx.indexOf(entry.target);
        if (entry.isIntersecting && i === -1) sichtbareFx.push(entry.target);
        if (!entry.isIntersecting && i !== -1) sichtbareFx.splice(i, 1);
      });
      anstossen();
    }, { rootMargin: "10% 0px 10% 0px" });
    fxBilder.forEach(function (b) { fxBeobachter.observe(b); });
  }

  function fxRechnen() {
    var h = window.innerHeight;
    sichtbareFx.forEach(function (b) {
      var r = b.getBoundingClientRect();
      var p = (h - r.top) / (h + r.height);
      p = Math.max(0, Math.min(1, p));
      if (b.getAttribute("data-fx") === "zoom") {
        var z = 1.18 - 0.18 * Math.min(1, p / 0.62);
        b.style.setProperty("--zoom", z.toFixed(4));
      } else {
        b.style.setProperty("--versatz", (-16 * p).toFixed(2) + "%");
      }
    });
  }

  var heroBild = document.querySelector(".hero-bild");

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
    if (heroBild && !reduzierteBewegung && window.scrollY < window.innerHeight * 1.2) {
      heroBild.style.transform = "translate3d(0," + (window.scrollY * 0.3).toFixed(1) + "px,0)";
    }
    fxRechnen();
    tickt = false;
  }
  function anstossen() {
    if (!tickt) { tickt = true; window.requestAnimationFrame(onScroll); }
  }
  window.addEventListener("scroll", anstossen, { passive: true });
  window.addEventListener("resize", anstossen, { passive: true });
  onScroll();

  var reveals = alle(".reveal, [data-fx='vorhang']");
  alle(".reveal-group").forEach(function (group) {
    alle(".reveal, [data-fx='vorhang']", group).forEach(function (kind, i) {
      kind.style.setProperty("--reveal-delay", Math.min(i * 90, 450) + "ms");
      kind.style.transitionDelay = Math.min(i * 90, 450) + "ms";
    });
  });
  if ("IntersectionObserver" in window && !reduzierteBewegung) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible", "sichtbar");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("visible", "sichtbar"); });
  }


  var hero = document.querySelector(".hero[data-video]");
  if (hero && !reduzierteBewegung &&
      window.matchMedia("(min-width: 860px)").matches &&
      !(navigator.connection && navigator.connection.saveData)) {
    var basis = hero.getAttribute("data-video");
    var video = document.createElement("video");
    video.className = "hero-video";
    video.muted = true; video.defaultMuted = true; video.loop = true; video.autoplay = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true");
    video.setAttribute("tabindex", "-1");
    video.preload = "metadata";
    video.poster = hero.querySelector(".hero-bild img").getAttribute("src");
    var videoDa = false;
    var wartezeit = setTimeout(function () { if (!videoDa) video.remove(); }, 5000);
    var gescheitert = 0;
    ["webm", "mp4"].forEach(function (typ) {
      var q = document.createElement("source");
      q.src = basis + "." + typ;
      q.type = "video/" + typ;
      q.addEventListener("error", function () {
        if (++gescheitert >= 2) { clearTimeout(wartezeit); video.remove(); }
      });
      video.appendChild(q);
    });
    video.addEventListener("canplay", function () {
      videoDa = true; clearTimeout(wartezeit);
      video.playbackRate = 0.45;
      video.classList.add("bereit");
    });
    hero.querySelector(".hero-bild").appendChild(video);
    var abspielen = video.play();
    if (abspielen && abspielen.catch) abspielen.catch(function () { });
  }


  var heute = new Date().getDay();
  var tagZeile = {};
  alle(".hours tr[data-tage]").forEach(function (tr) {
    var tage = tr.getAttribute("data-tage").split(",").map(Number);
    var zelle = tr.querySelector("td");
    tage.forEach(function (tag) { tagZeile[tag] = zelle; });
    if (tage.indexOf(heute) !== -1) tr.classList.add("heute");
  });

  function stunde(text) {
    var t = text.match(/(\d{1,2})(?::00)?\s*(am|pm)?/i);
    if (!t) return "";
    return T.uhr(t[2] ? t[1] + " " + t[2] : String(parseInt(t[1], 10)));
  }

  var status = document.getElementById("offen-status");
  var heutigeZelle = tagZeile[heute];
  if (status && heutigeZelle) {
    var heutigerText = heutigeZelle.textContent.trim();
    if (heutigerText.toLowerCase() !== T.geschlossen) {
      status.textContent = T.offenHeute + heutigerText.replace(/(\d{2}):00/g, function (_, h) { return String(parseInt(h, 10)); });
    } else {
      for (var i = 1; i <= 7; i++) {
        var tag = (heute + i) % 7;
        var zelle = tagZeile[tag];
        if (!zelle) continue;
        var text = zelle.textContent.trim();
        if (text.toLowerCase() !== T.geschlossen) {
          status.textContent = i === 1 ? T.ruhetagMorgen(stunde(text)) : T.ruhetagTag(T.tage[tag], stunde(text));
          break;
        }
      }
    }
  }

  var jahr = document.getElementById("jahr");
  if (jahr) jahr.textContent = new Date().getFullYear();


  alle(".js-mail").forEach(function (node) {
    var adresse = node.getAttribute("data-user") + "@" + node.getAttribute("data-domain");
    var ziel = "mailto:" + adresse;
    var teile = [];
    if (node.getAttribute("data-betreff")) teile.push("subject=" + node.getAttribute("data-betreff"));
    if (node.getAttribute("data-body")) teile.push("body=" + node.getAttribute("data-body"));
    if (teile.length) ziel += "?" + teile.join("&");
    node.setAttribute("href", ziel);
    var textEl = node.querySelector(".js-mail-text");
    if (textEl) textEl.textContent = adresse;
  });

  var dialog = document.getElementById("anfrage-dialog");
  var anfrageKnoepfe = alle(".js-anfrage");
  var feldDatum = dialog ? dialog.querySelector("#anfrage-datum") : null;
  var VORLAUF_TAGE = 14;

  var alsIsoDatum = function (d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  };
  var fruehesterTermin = function () {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + VORLAUF_TAGE);
    return d;
  };
  var datumGrenzeSetzen = function () {};
  var datumPruefen = function () {};

  if (feldDatum) {
    datumGrenzeSetzen = function () {
      var grenze = fruehesterTermin();
      feldDatum.min = alsIsoDatum(grenze);
      var hinweis = dialog.querySelector("#anfrage-datum-hinweis");
      if (hinweis) {
        hinweis.textContent = T.fruehestens(grenze.toLocaleDateString(T.datumLocale,
          { day: "2-digit", month: "2-digit", year: "numeric" }));
      }
    };
    datumPruefen = function () {
      if (!feldDatum.value) { feldDatum.setCustomValidity(""); return; }
      var gewaehlt = new Date(feldDatum.value + "T00:00:00");
      feldDatum.setCustomValidity(gewaehlt < fruehesterTermin() ? T.zuFrueh : "");
    };
    datumGrenzeSetzen();
    feldDatum.addEventListener("input", datumPruefen);
    feldDatum.addEventListener("change", datumPruefen);
  }

  if (dialog && anfrageKnoepfe.length && typeof dialog.showModal === "function") {
    var form = dialog.querySelector("form");
    var feldAnlass = dialog.querySelector("#anfrage-anlass");
    var feldNachricht = dialog.querySelector("#anfrage-nachricht");
    var feldPersonen = dialog.querySelector("#anfrage-personen");
    var STANDARD_PLATZHALTER = feldPersonen ? feldPersonen.placeholder : "";
    var letzteAutoNachricht = "";
    var letzterKnopf = null;

    anfrageKnoepfe.forEach(function (knopf) {
      knopf.addEventListener("click", function (e) {
        e.preventDefault();
        letzterKnopf = knopf;
        var anlass = knopf.getAttribute("data-anlass");
        if (anlass && feldAnlass) {
          alle("option", feldAnlass).forEach(function (o) {
            if (o.value === anlass) feldAnlass.value = anlass;
          });
        }
        var paket = knopf.getAttribute("data-paket");
        var neu = paket ? T.paket(paket) : "";
        if (feldNachricht && (feldNachricht.value === "" || feldNachricht.value === letzteAutoNachricht)) {
          feldNachricht.value = neu;
        }
        letzteAutoNachricht = neu;
        var minPersonen = knopf.getAttribute("data-min");
        if (feldPersonen) feldPersonen.placeholder = minPersonen ? T.mindestens(minPersonen) : STANDARD_PLATZHALTER;
        datumGrenzeSetzen();
        dialog.showModal();
        var erstes = dialog.querySelector("select, input");
        if (erstes) erstes.focus();
      });
    });

    var zuKnopf = dialog.querySelector(".anfrage-zu");
    if (zuKnopf) zuKnopf.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("close", function () {
      if (letzterKnopf && letzterKnopf.focus) letzterKnopf.focus();
    });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var wert = function (name) {
          var f = form.elements[name];
          return f && f.value ? f.value.trim() : "";
        };
        var datum = wert("datum");
        if (feldDatum && datum) {
          datumPruefen();
          if (!feldDatum.checkValidity()) { feldDatum.reportValidity(); return; }
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
          var t = datum.split("-");
          datum = EN ? t[2] + "/" + t[1] + "/" + t[0] : t[2] + "." + t[1] + "." + t[0];
        }
        var anlass = wert("anlass") || T.betreff;
        var m = T.mail;
        var zeilen = [
          m[0] + ": " + anlass,
          m[1] + ": " + (datum || T.offen),
          m[2] + ": " + (wert("uhrzeit") || T.offen),
          m[3] + ": " + (wert("personen") || T.offen),
          m[4] + ": " + wert("name"),
          m[5] + ": " + wert("telefon")
        ];
        var nachricht = wert("nachricht");
        if (nachricht) zeilen.push("", nachricht);
        var adresse = dialog.getAttribute("data-user") + "@" + dialog.getAttribute("data-domain");
        window.location.href = "mailto:" + adresse +
          "?subject=" + encodeURIComponent(T.betreff + " " + anlass) +
          "&body=" + encodeURIComponent(zeilen.join("\n") + "\n");
        dialog.close();
      });
    }
  }


  var galerieBilder = alle(".gallery figure img");
  if (galerieBilder.length) {
    var lightbox = el("div", "lightbox");
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", T.bildansicht);
    var grossbild = el("img");
    grossbild.alt = "";
    var schliessen = el("button", "lightbox-close");
    schliessen.type = "button";
    schliessen.setAttribute("aria-label", T.bildZu);
    schliessen.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>';
    lightbox.appendChild(grossbild);
    lightbox.appendChild(schliessen);
    document.body.appendChild(lightbox);

    var vorherFokus = null;
    var oeffnen = function (img) {
      grossbild.src = img.currentSrc || img.src;
      grossbild.alt = img.alt || "";
      vorherFokus = document.activeElement;
      lightbox.classList.add("open");
      schliessen.focus();
    };
    var zu = function () {
      lightbox.classList.remove("open");
      if (vorherFokus && vorherFokus.focus) vorherFokus.focus();
    };
    galerieBilder.forEach(function (img) {
      img.setAttribute("role", "button");
      img.setAttribute("tabindex", "0");
      img.addEventListener("click", function () { oeffnen(img); });
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); oeffnen(img); }
      });
    });
    lightbox.addEventListener("click", function (e) { if (e.target !== grossbild) zu(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("open")) zu();
    });
  }
})();
