/* Savit Pawar / Field Logbook
   Theme toggle, scroll-spy for the top nav + margin tabs, load sequence. */

(function () {
    "use strict";

    var root = document.documentElement;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- theme ---------- */
    var toggle = document.querySelector(".theme");
    var label = toggle && toggle.querySelector(".theme-label");
    var STORE = "sp-theme";

    function systemTheme() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        if (toggle) {
            var isDark = theme === "dark";
            toggle.setAttribute("aria-pressed", String(isDark));
            if (label) label.textContent = isDark ? "Dark" : "Light";
        }
    }

    var saved = null;
    try { saved = localStorage.getItem(STORE); } catch (e) {}
    applyTheme(saved || systemTheme());

    if (toggle) {
        toggle.addEventListener("click", function () {
            var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            applyTheme(next);
            try { localStorage.setItem(STORE, next); } catch (e) {}
        });
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        var stored = null;
        try { stored = localStorage.getItem(STORE); } catch (err) {}
        if (!stored) applyTheme(e.matches ? "dark" : "light");
    });

    /* ---------- dates ---------- */
    var now = new Date();
    document.querySelectorAll("[data-year]").forEach(function (el) {
        el.textContent = now.getFullYear();
    });
    document.querySelectorAll("[data-updated]").forEach(function (el) {
        el.textContent = now.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    });

    /* ---------- load sequence ---------- */
    var sheet = document.querySelector(".sheet");
    var hero = document.querySelector(".hero");
    window.addEventListener("load", function () {
        if (reduceMotion) return;
        if (sheet) sheet.classList.add("draw");
        if (hero) hero.classList.add("tick");
    });

    /* ---------- scroll spy ---------- */
    var sections = Array.prototype.slice.call(document.querySelectorAll(".entry[id], .entry.hero"));
    var navLinks = {};
    document.querySelectorAll(".topnav a").forEach(function (a) {
        navLinks[a.getAttribute("href").slice(1)] = a;
    });

    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                entry.target.classList.toggle("in-view", entry.isIntersecting);
                if (entry.isIntersecting) {
                    var id = entry.target.id;
                    Object.keys(navLinks).forEach(function (key) {
                        navLinks[key].classList.toggle("is-active", key === id);
                    });
                }
            });
        }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

        sections.forEach(function (s) { io.observe(s); });
    }
})();
