
(function () {
  "use strict";

  var root = document.documentElement;

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
  } else {
    root.classList.add("intro-los");
  }
})();

(function () {
  "use strict";

  var reduzierteBewegung = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  var toggleTheme = document.querySelector(".theme-toggle");
  var metaTheme = document.getElementById("meta-theme");

  function themeAnwenden(theme, speichern) {
    var dunkel = theme === "dark";
    if (dunkel) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (toggleTheme) {
      toggleTheme.setAttribute("aria-pressed", dunkel ? "true" : "false");
      toggleTheme.setAttribute("aria-label",
        dunkel ? "Helles Design einschalten" : "Dunkles Design einschalten");
    }
    if (metaTheme) metaTheme.setAttribute("content", dunkel ? "#0d0407" : "#340810");
    if (speichern) {
      try { localStorage.setItem("kb-theme", theme); } catch (e) { }
    }
  }

  themeAnwenden(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "wein", false);

  if (toggleTheme) {
    toggleTheme.addEventListener("click", function () {
      var dunkel = document.documentElement.getAttribute("data-theme") === "dark";
      var wechseln = function () { themeAnwenden(dunkel ? "wein" : "dark", true); };
      if (document.startViewTransition && !reduzierteBewegung) {
        var r = toggleTheme.getBoundingClientRect();
        document.documentElement.style.setProperty("--vt-x", (r.left + r.width / 2) + "px");
        document.documentElement.style.setProperty("--vt-y", (r.top + r.height / 2) + "px");
        document.startViewTransition(wechseln);
      } else {
        wechseln();
      }
    });
  }

  if (window.matchMedia) {
    var systemDunkel = window.matchMedia("(prefers-color-scheme: dark)");
    var aufSystem = function (e) {
      var gespeichert;
      try { gespeichert = localStorage.getItem("kb-theme"); } catch (err) { gespeichert = null; }
      if (!gespeichert) themeAnwenden(e.matches ? "dark" : "wein", false);
    };
    if (systemDunkel.addEventListener) systemDunkel.addEventListener("change", aufSystem);
    else if (systemDunkel.addListener) systemDunkel.addListener(aufSystem);
  }

  var menuRoot = document.getElementById("menu-root");
  var menuNav = document.getElementById("menu-nav");

  if (menuRoot && typeof KARTE !== "undefined") {
    var nurListe = (menuRoot.getAttribute("data-kategorien") || "")
      .split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var mitTabs = menuRoot.getAttribute("data-tabs") !== "nein" && !!menuNav;

    KARTE.forEach(function (kat) {
      if (nurListe.length && nurListe.indexOf(kat.id) === -1) return;

      var sichtbare = kat.items.filter(function (item) { return !item.aus; });
      if (sichtbare.length === 0) return;

      if (mitTabs) {
        var tab = el("a", "menu-pill", kat.titel);
        tab.href = "#karte-" + kat.id;
        menuNav.appendChild(tab);
      }

      var section = el("section", "menu-cat");
      section.id = "karte-" + kat.id;

      var head = el("div", "menu-cat-head reveal");
      head.appendChild(el("h3", "menu-cat-title", kat.titel));
      if (kat.hinweis) head.appendChild(el("p", "menu-cat-note", kat.hinweis));
      section.appendChild(head);

      var list = el("div", "menu-items");
      sichtbare.forEach(function (item, i) {
        var wrapper = el("div", "menu-item reveal-item");
        wrapper.id = "drink-" + item.name.toLowerCase()
          .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
          .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        wrapper.style.setProperty("--reveal-delay", Math.min(i * 35, 300) + "ms");

        var row = el("div", "menu-item-row");
        var name = el("span", "menu-item-name", item.name);
        if (item.tipp) name.appendChild(el("span", "badge-tipp", "Empfehlung"));
        row.appendChild(name);
        row.appendChild(el("span", "menu-item-dots"));
        row.appendChild(el("span", "menu-item-price", item.preis + " €"));
        wrapper.appendChild(row);

        if (item.zutaten) wrapper.appendChild(el("p", "menu-item-zutaten", item.zutaten));
        list.appendChild(wrapper);
      });
      section.appendChild(list);
      menuRoot.appendChild(section);
    });

    if (mitTabs) menuNav.appendChild(el("span", "menu-indicator"));
  }

  function linieBauen(container, indicator) {
    if (!container || !indicator) return function () {};

    var setzen = function (ziel) {
      if (!ziel) { indicator.classList.remove("sichtbar"); return; }
      var box = ziel.getBoundingClientRect();
      var rahmen = container.getBoundingClientRect();
      var x = box.left - rahmen.left + container.scrollLeft;
      indicator.style.width = box.width + "px";
      indicator.style.transform = "translateX(" + x + "px)";
      indicator.classList.add("sichtbar");
    };

    var aktualisieren = function () {
      setzen(container.querySelector(":scope > .active, :scope > .nav-gruppe > .active"));
    };

    var obersteEbene = function (node) {
      if (!node || !node.tagName) return null;
      if (node.parentElement === container &&
          (node.tagName === "A" || node.classList.contains("nav-gruppe-knopf"))) return node;
      if (node.classList && node.classList.contains("nav-gruppe-knopf")) return node;
      return null;
    };
    container.addEventListener("pointerover", function (e) {
      var ziel = obersteEbene(e.target);
      if (ziel) setzen(ziel);
    });
    container.addEventListener("focusin", function (e) {
      var ziel = obersteEbene(e.target);
      if (ziel) setzen(ziel);
    });
    container.addEventListener("pointerleave", aktualisieren);
    container.addEventListener("focusout", aktualisieren);
    container.addEventListener("scroll", aktualisieren, { passive: true });
    window.addEventListener("resize", aktualisieren);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(aktualisieren);

    aktualisieren();
    return aktualisieren;
  }

  var hauptNav = document.querySelector(".main-nav");
  var hauptLinie = hauptNav ? hauptNav.querySelector(".nav-indicator") : null;

  if (hauptNav) {
    var pfad = location.pathname.replace(/index\.html$/, "");
    if (pfad !== "/" && pfad !== "") {
      var beste = null;
      Array.prototype.forEach.call(hauptNav.querySelectorAll("a[href]"), function (a) {
        var ziel = a.getAttribute("href").split("#")[0];
        if (!ziel || ziel === "/") return;
        if (pfad.indexOf(ziel) === 0 && (!beste || ziel.length > beste.ziel.length)) {
          beste = { link: a, ziel: ziel };
        }
      });
      if (beste) {
        beste.link.classList.add("active");
        beste.link.setAttribute("aria-current", "page");
        var gruppe = beste.link.closest(".nav-gruppe");
        if (gruppe) {
          var knopf = gruppe.querySelector(".nav-gruppe-knopf");
          if (knopf) knopf.classList.add("active");
        }
      }
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll(".nav-gruppe"), function (gruppe) {
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
      if (!gruppe.contains(e.target)) zu();
    });
  });

  var hauptLinieAktualisieren = linieBauen(hauptNav, hauptLinie);
  var menuLinieAktualisieren = linieBauen(menuNav, menuNav ? menuNav.querySelector(".menu-indicator") : null);

  if (menuRoot && menuNav) {
    var tabs = Array.prototype.slice.call(menuNav.querySelectorAll(".menu-pill"));
    var cats = Array.prototype.slice.call(menuRoot.querySelectorAll(".menu-cat"));

    var setActive = function (id) {
      tabs.forEach(function (p) {
        var on = p.getAttribute("href") === "#" + id;
        p.classList.toggle("active", on);
        if (on) {
          p.setAttribute("aria-current", "true");
          var mitte = p.offsetLeft + p.offsetWidth / 2 - menuNav.clientWidth / 2;
          var maximal = menuNav.scrollWidth - menuNav.clientWidth;
          var ziel = Math.max(0, Math.min(mitte, maximal));
          if (Math.abs(menuNav.scrollLeft - ziel) > 1) {
            menuNav.scrollTo({ left: ziel, behavior: reduzierteBewegung ? "auto" : "smooth" });
          }
        } else {
          p.removeAttribute("aria-current");
        }
      });
      menuLinieAktualisieren();
    };

    if (tabs.length) {
      tabs[0].classList.add("active");
      tabs[0].setAttribute("aria-current", "true");
      menuLinieAktualisieren();
    }

    if ("IntersectionObserver" in window && cats.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: "-35% 0px -60% 0px" });
      cats.forEach(function (c) { spy.observe(c); });
    }
  }

  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".main-nav a[href*='#'], .main-nav [data-spy]"));
  if (navLinks.length && "IntersectionObserver" in window) {
    var navZiele = navLinks
      .map(function (a) {
        var spy = a.getAttribute("data-spy");
        if (spy) {
          var abschnitt = document.getElementById(spy);
          return abschnitt ? { link: a, ziel: abschnitt } : null;
        }
        var href = a.getAttribute("href") || "";
        var raute = href.indexOf("#");
        if (raute === -1) return null;
        var pfadTeil = href.slice(0, raute).replace(/index\.html$/, "");
        if (pfadTeil && pfadTeil !== location.pathname.replace(/index\.html$/, "")) return null;
        var ziel = document.getElementById(href.slice(raute + 1));
        return ziel ? { link: a, ziel: ziel } : null;
      })
      .filter(Boolean);

    if (navZiele.length) {
      var navAktiv = function (id) {
        navZiele.forEach(function (paar) {
          var on = paar.ziel.id === id;
          paar.link.classList.toggle("active", on);
          if (on) paar.link.setAttribute("aria-current", "true");
          else paar.link.removeAttribute("aria-current");
        });
        hauptLinieAktualisieren();
      };

      var navSpy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) navAktiv(entry.target.id);
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      navZiele.forEach(function (paar) { navSpy.observe(paar.ziel); });
    }
  }

  var header = document.querySelector(".site-header");
  var heroBg = document.querySelector(".hero-bg");
  var menuLeiste = document.querySelector(".menu-nav");
  var scrollTickt = false;

  var haftGrenze = 0;

  function haftGrenzeMessen() {
    var stil = getComputedStyle(document.documentElement);
    var hoehe = parseFloat(stil.getPropertyValue("--header-h")) || 0;
    var abstand = parseFloat(stil.getPropertyValue("--header-gap")) || 0;
    haftGrenze = hoehe + abstand;
  }

  if (menuLeiste) haftGrenzeMessen();

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
    if (menuLeiste) {
      document.body.classList.toggle(
        "leiste-haftet",
        menuLeiste.getBoundingClientRect().top <= haftGrenze + 1
      );
    }
    if (heroBg && !reduzierteBewegung && window.scrollY < window.innerHeight * 1.2) {
      heroBg.style.transform = "translate3d(0," + (window.scrollY * 0.22).toFixed(1) + "px,0)";
    }
    scrollTickt = false;
  }
  window.addEventListener("scroll", function () {
    if (!scrollTickt) {
      scrollTickt = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  if (menuLeiste) {
    window.addEventListener("resize", function () {
      haftGrenzeMessen();
      onScroll();
    }, { passive: true });
  }
  onScroll();

  var hero = document.querySelector(".hero[data-video]");
  if (hero && !reduzierteBewegung &&
      window.matchMedia && window.matchMedia("(min-width: 860px)").matches &&
      !(navigator.connection && navigator.connection.saveData)) {

    var basis = hero.getAttribute("data-video");
    var video = document.createElement("video");
    video.className = "hero-video";
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true");
    video.setAttribute("tabindex", "-1");
    video.preload = "metadata";
    video.poster = "/assets/img/hero-bar-video-poster.jpg";
    video.playbackRate = 0.45;

    var geladen = false;
    var wartezeit = setTimeout(function () {
      if (!geladen) video.remove();
    }, 5000);

    var formate = ["webm", "mp4"];
    var gescheitert = 0;
    formate.forEach(function (typ) {
      var q = document.createElement("source");
      q.src = basis + "." + typ;
      q.type = typ === "webm" ? "video/webm" : "video/mp4";
      q.addEventListener("error", function () {
        gescheitert++;
        if (gescheitert >= formate.length) { clearTimeout(wartezeit); video.remove(); }
      });
      video.appendChild(q);
    });

    video.addEventListener("canplay", function () {
      geladen = true;
      clearTimeout(wartezeit);
      video.playbackRate = 0.45;
      video.classList.add("bereit");
    });
    video.addEventListener("error", function () { clearTimeout(wartezeit); video.remove(); });

    var schleier = hero.querySelector(".hero-schleier");
    if (schleier) hero.insertBefore(video, schleier);
    else hero.insertBefore(video, hero.firstChild);

    var abspielen = video.play();
    if (abspielen && abspielen.catch) abspielen.catch(function () { });
  }

  var toggle = document.querySelector(".nav-toggle");
  if (toggle && hauptNav) {
    toggle.addEventListener("click", function () {
      var open = hauptNav.classList.toggle("open");
      document.body.classList.toggle("nav-offen", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });
    hauptNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        hauptNav.classList.remove("open");
        document.body.classList.remove("nav-offen");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll(".reveal-group").forEach(function (group) {
    var kinder = group.querySelectorAll(".reveal");
    kinder.forEach(function (kind, i) {
      kind.style.setProperty("--reveal-delay", Math.min(i * 90, 450) + "ms");
    });
  });

  var reveals = document.querySelectorAll(".reveal, .reveal-item, .ornament");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -4% 0px" });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("visible"); });
  }

  if (window.matchMedia && window.matchMedia("(hover: hover)").matches && !reduzierteBewegung) {
    document.querySelectorAll(".reco-card").forEach(function (card) {
      card.addEventListener("pointerenter", function () { card.classList.add("tilt"); });
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "translateY(-8px) perspective(900px) rotateX(" +
          (-y * 3.5).toFixed(2) + "deg) rotateY(" + (x * 4.5).toFixed(2) + "deg)";
      });
      card.addEventListener("pointerleave", function () {
        card.classList.remove("tilt");
        card.style.transform = "";
      });
    });
  }

  var wochentage = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  var heute = new Date().getDay();
  var tagZeile = {};

  document.querySelectorAll(".hours tr[data-tage]").forEach(function (tr) {
    var tage = tr.getAttribute("data-tage").split(",").map(Number);
    var zelle = tr.querySelector("td");
    tage.forEach(function (tag) { tagZeile[tag] = zelle; });
    if (tage.indexOf(heute) !== -1) tr.classList.add("heute");
  });

  function kurzeZeit(text) {
    return text.replace(/(\d{2}):00/g, function (_, stunde) {
      return String(parseInt(stunde, 10));
    });
  }

  function ersteStunde(text) {
    var treffer = text.match(/^(\d{2}):00/);
    return treffer ? String(parseInt(treffer[1], 10)) : "";
  }

  var status = document.getElementById("offen-status");
  var heutigeZelle = tagZeile[heute];
  if (status && heutigeZelle) {
    var heutigerText = heutigeZelle.textContent.trim();
    if (heutigerText.toLowerCase() !== "geschlossen") {
      status.textContent = "Heute für euch geöffnet, " + kurzeZeit(heutigerText);
    } else {
      for (var i = 1; i <= 7; i++) {
        var tag = (heute + i) % 7;
        var zelle = tagZeile[tag];
        if (!zelle) continue;
        var text = zelle.textContent.trim();
        if (text.toLowerCase() !== "geschlossen") {
          var stunde = ersteStunde(text);
          status.textContent = i === 1
            ? "Heute Ruhetag. Morgen ab " + stunde + " Uhr sind wir wieder da"
            : "Heute Ruhetag. " + wochentage[tag] + " ab " + stunde + " Uhr geht es weiter";
          break;
        }
      }
    }
  }

  var jahr = document.getElementById("jahr");
  if (jahr) jahr.textContent = new Date().getFullYear();

  Array.prototype.forEach.call(document.querySelectorAll(".js-mail"), function (node) {
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
  var anfrageKnoepfe = document.querySelectorAll(".js-anfrage");

  var feldDatum = dialog ? dialog.querySelector("#anfrage-datum") : null;
  var VORLAUF_TAGE = 14;

  var alsIsoDatum = function (d) {
    return d.getFullYear() + "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
      ("0" + d.getDate()).slice(-2);
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
        hinweis.textContent = "Frühestens " +
          grenze.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) +
          ", wir brauchen zwei Wochen Vorlauf.";
      }
    };

    datumPruefen = function () {
      if (!feldDatum.value) {
        feldDatum.setCustomValidity("");
        return;
      }
      var gewaehlt = new Date(feldDatum.value + "T00:00:00");
      feldDatum.setCustomValidity(
        gewaehlt < fruehesterTermin()
          ? "Bitte wählt einen Termin, der mindestens zwei Wochen in der Zukunft liegt."
          : ""
      );
    };

    datumGrenzeSetzen();
    feldDatum.addEventListener("input", datumPruefen);
    feldDatum.addEventListener("change", datumPruefen);
  }

  if (dialog && anfrageKnoepfe.length && typeof dialog.showModal === "function") {
    var form = dialog.querySelector("form");
    var feldAnlass = dialog.querySelector("#anfrage-anlass");
    var zuKnopf = dialog.querySelector(".anfrage-zu");
    var letzterKnopf = null;

    var feldNachricht = dialog.querySelector("#anfrage-nachricht");
    var feldPersonen = dialog.querySelector("#anfrage-personen");
    var STANDARD_PLATZHALTER = feldPersonen ? feldPersonen.placeholder : "";
    var letzteAutoNachricht = "";

    var oeffnenDialog = function (knopf) {
      letzterKnopf = knopf;
      var anlass = knopf.getAttribute("data-anlass");
      if (anlass && feldAnlass) {
        Array.prototype.forEach.call(feldAnlass.options, function (o) {
          if (o.value === anlass) feldAnlass.value = anlass;
        });
      }
      var paket = knopf.getAttribute("data-paket");
      var neueAutoNachricht = paket ? "Wir möchten das Paket „" + paket + "“ buchen." : "";
      if (feldNachricht && (feldNachricht.value === "" || feldNachricht.value === letzteAutoNachricht)) {
        feldNachricht.value = neueAutoNachricht;
      }
      letzteAutoNachricht = neueAutoNachricht;

      var minPersonen = knopf.getAttribute("data-min");
      if (feldPersonen) feldPersonen.placeholder = minPersonen ? "mindestens " + minPersonen : STANDARD_PLATZHALTER;

      if (feldDatum) datumGrenzeSetzen();

      dialog.showModal();
      var erstes = dialog.querySelector("select, input");
      if (erstes) erstes.focus();
    };

    Array.prototype.forEach.call(anfrageKnoepfe, function (knopf) {
      knopf.addEventListener("click", function (e) {
        e.preventDefault();
        oeffnenDialog(knopf);
      });
    });

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
          if (!feldDatum.checkValidity()) {
            feldDatum.reportValidity();
            return;
          }
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
          var t = datum.split("-");
          datum = t[2] + "." + t[1] + "." + t[0];
        }

        var anlass = wert("anlass") || "Anfrage";
        var zeilen = [
          "Anlass: " + anlass,
          "Wunschdatum: " + (datum || "noch offen"),
          "Uhrzeit: " + (wert("uhrzeit") || "noch offen"),
          "Anzahl Personen: " + (wert("personen") || "noch offen"),
          "Name: " + wert("name"),
          "Telefon für Rückfragen: " + wert("telefon")
        ];
        var nachricht = wert("nachricht");
        if (nachricht) zeilen.push("", nachricht);

        var adresse = dialog.getAttribute("data-user") + "@" + dialog.getAttribute("data-domain");
        window.location.href = "mailto:" + adresse +
          "?subject=" + encodeURIComponent("Anfrage " + anlass) +
          "&body=" + encodeURIComponent(zeilen.join("\n") + "\n");

        dialog.close();
      });
    }
  }

  var galerieBilder = document.querySelectorAll(".gallery figure img");
  if (galerieBilder.length) {
    var lightbox = el("div", "lightbox");
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Bildansicht");
    var grossbild = el("img");
    grossbild.setAttribute("alt", "");
    var schliessen = el("button", "lightbox-close");
    schliessen.type = "button";
    schliessen.setAttribute("aria-label", "Bildansicht schließen");
    schliessen.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
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

    lightbox.addEventListener("click", function (e) {
      if (e.target !== grossbild) zu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("open")) zu();
    });
  }
})();

(function () {
  "use strict";

  var ns = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(ns, "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  svg.innerHTML =
    '<filter id="glas-linse" primitiveUnits="objectBoundingBox">' +
    '<feImage result="karte" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" href="/Kuenstlerbar/assets/img/glas-linse.png"/>' +
    '<feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="weich"/>' +
    '<feDisplacementMap in="weich" in2="karte" scale="0.5" xChannelSelector="R" yChannelSelector="G"/>' +
    '</filter>';
  document.body.insertBefore(svg, document.body.firstChild);

  Array.prototype.forEach.call(document.querySelectorAll(".btn"), function (knopf) {
    var zeit;
    var an = function () {
      clearTimeout(zeit);
      knopf.classList.remove("gedrueckt");
      void knopf.offsetWidth;
      knopf.classList.add("gedrueckt");
    };
    var aus = function () {
      zeit = setTimeout(function () { knopf.classList.remove("gedrueckt"); }, 480);
    };
    knopf.addEventListener("pointerdown", an);
    knopf.addEventListener("pointerup", aus);
    knopf.addEventListener("pointerleave", aus);
    knopf.addEventListener("pointercancel", aus);
  });
})();
