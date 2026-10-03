window.introAusgang = function (intro, root) {
  "use strict";
  var art = root.getAttribute("data-ausgang");
  var logo = intro.querySelector(".intro-logo");
  var r = logo.getBoundingClientRect();
  var L = r.width;
  var hero = document.querySelector(".hero");
  var kopf = document.querySelector(".site-header");
  var bg = getComputedStyle(intro).backgroundColor;
  var weich = "cubic-bezier(.16, 1, .3, 1)";

  function punkt(x, y) { return { x: r.left + L * x / 768, y: r.top + L * y / 768 }; }
  function hintergrundWeg(dauer, verz) {
    intro.animate([{ backgroundColor: bg }, { backgroundColor: "rgba(0,0,0,0)" }],
      { duration: dauer, delay: verz || 0, easing: "ease", fill: "forwards" });
  }
  function kopfRein(verz) {
    kopf.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: verz, easing: "ease", fill: "backwards" });
  }

  if (art === "zoom") {
    logo.style.transformOrigin = (200 / 768 * 100) + "% " + (330 / 768 * 100) + "%";
    logo.animate([{ transform: "scale(1)" }, { transform: "scale(38)" }],
      { duration: 1150, easing: "cubic-bezier(.7, 0, .84, 0)", fill: "forwards" });
    logo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, delay: 900, fill: "forwards" });
    hintergrundWeg(550, 450);
    hero.animate([{ transform: "scale(1.22)", filter: "blur(10px)" }, { transform: "none", filter: "none" }],
      { duration: 1300, delay: 420, easing: weich, fill: "backwards" });
    kopfRein(700);
    root.classList.add("intro-los");
    return 1200;
  }

  if (art === "landen") {
    var ziel = document.querySelector(".hero-logo");
    ziel.style.animation = "none";
    ziel.style.opacity = "0";
    var z = ziel.getBoundingClientRect();
    var dx = z.left + z.width / 2 - (r.left + L / 2);
    var dy = z.top + z.height / 2 - (r.top + L / 2);
    logo.animate([{ transform: "none" }, { transform: "translate(" + dx + "px," + dy + "px) scale(" + (z.width / L) + ")" }],
      { duration: 950, easing: "cubic-bezier(.65, 0, .35, 1)", fill: "forwards" });
    hintergrundWeg(800, 150);
    kopfRein(500);
    root.classList.add("intro-los");
    setTimeout(function () { ziel.style.opacity = "1"; }, 950);
    return 980;
  }

  if (art === "kopf") {
    var marke = document.querySelector(".brand-logo");
    marke.style.opacity = "0";
    var m = marke.getBoundingClientRect();
    var mx = m.left + m.width / 2 - (r.left + L / 2);
    var my = m.top + m.height / 2 - (r.top + L / 2);
    logo.animate([{ transform: "none" }, { transform: "translate(" + mx + "px," + my + "px) scale(" + (m.width / L) + ")" }],
      { duration: 1000, easing: "cubic-bezier(.65, 0, .35, 1)", fill: "forwards" });
    hintergrundWeg(800, 200);
    root.classList.add("intro-los");
    setTimeout(function () { marke.style.transition = "opacity .2s"; marke.style.opacity = "1"; logo.style.opacity = "0"; }, 1000);
    return 1100;
  }

  if (art === "iris") {
    var p = punkt(514, 320);
    var w = window.innerWidth, h = window.innerHeight;
    var weit = Math.max(Math.hypot(p.x, p.y), Math.hypot(w - p.x, p.y), Math.hypot(p.x, h - p.y), Math.hypot(w - p.x, h - p.y));
    intro.style.setProperty("--px", p.x + "px");
    intro.style.setProperty("--py", p.y + "px");
    intro.classList.add("a-iris");
    void intro.offsetWidth;
    intro.style.setProperty("--r", (weit + 4) + "px");
    hero.animate([{ transform: "scale(1.06)" }, { transform: "none" }], { duration: 1200, delay: 200, easing: weich });
    root.classList.add("intro-los");
    return 1300;
  }

  if (art === "fokus") {
    logo.animate([{ opacity: 1, transform: "scale(1)", filter: "blur(0)" }, { opacity: 0, transform: "scale(1.12)", filter: "blur(14px)" }],
      { duration: 700, easing: "ease-in", fill: "forwards" });
    hintergrundWeg(800, 200);
    hero.animate([{ filter: "blur(18px)", transform: "scale(1.04)" }, { filter: "none", transform: "none" }],
      { duration: 1100, delay: 200, easing: weich, fill: "backwards" });
    kopfRein(500);
    root.classList.add("intro-los");
    return 1000;
  }

  intro.classList.add("raus");
  root.classList.add("intro-los");
  return 820;
};
