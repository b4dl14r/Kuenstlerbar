(function () {
  "use strict";

  var root = document.documentElement;
  var variante = root.getAttribute("data-variante");
  var seite = root.getAttribute("data-seite");
  var start = root.getAttribute("data-start");
  var wenigBewegung = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!variante) return;

  function schicht(cls) {
    var d = document.createElement("div");
    d.className = cls;
    d.setAttribute("aria-hidden", "true");
    document.body.appendChild(d);
    return d;
  }

  if (seite === "karte") {
    var ziel = document.querySelector(".ue-ankunft");
    if (ziel) {
      var weg = function () {
        if (variante === "einschenken") ziel.classList.add("faellt");
        else ziel.classList.add("weg");
        setTimeout(function () { ziel.remove(); }, 1000);
      };
      var warten = variante === "angler" ? 350 : 120;
      if (document.readyState === "complete") setTimeout(weg, warten);
      else window.addEventListener("load", function () { setTimeout(weg, warten); });
      setTimeout(weg, 2500);
    }
    return;
  }

  if (seite !== "start" || wenigBewegung) return;
  if (variante === "bild" || variante === "blende") return;

  var links = document.querySelectorAll('a.btn[href$="getraenkekarte/"]');
  Array.prototype.forEach.call(links, function (link) {
    link.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      var nach = link.href;
      var los = function (ms) { setTimeout(function () { location.href = nach; }, ms); };

      if (variante === "einschenken") {
        var f = schicht("ue-fluessig");
        void f.offsetWidth;
        f.classList.add("steigt");
        los(780);
      } else if (variante === "knopf") {
        var r = link.getBoundingClientRect();
        var k = schicht("ue-knopf");
        k.style.top = r.top + "px";
        k.style.left = r.left + "px";
        k.style.width = r.width + "px";
        k.style.height = r.height + "px";
        k.style.borderRadius = getComputedStyle(link).borderRadius;
        void k.offsetWidth;
        k.style.top = "0px";
        k.style.left = "0px";
        k.style.width = "100vw";
        k.style.height = "100vh";
        k.style.borderRadius = "0px";
        k.style.boxShadow = "0 0 0 0 rgba(227,189,122,0)";
        los(640);
      } else if (variante === "angler") {
        var intro = document.querySelector(".intro");
        if (!intro) { location.href = nach; return; }
        intro.classList.remove("raus", "warten");
        root.classList.remove("intro-fertig");
        root.classList.add("mit-intro");
        intro.style.display = "none";
        void intro.offsetWidth;
        intro.style.display = "";
        los(1750);
      }
    });
  });
})();
