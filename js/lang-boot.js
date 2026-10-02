/* Runs in <head> before first paint.
   1. marks the page as JS-enabled so reveal animations can start hidden.
   2. picture fallbacks: a picture marked data-fallback is removed (or its card falls back to a plain
      colour) when the file is missing. Done here, not with inline onerror attributes, so the page can
      use a strict Content Security Policy. */
document.documentElement.classList.add("js");
(function () {
  function fall(img) {
    var how = img.getAttribute("data-fallback");
    if (!how) return;
    if (how === "badge" && img.parentNode) img.parentNode.classList.remove("offer__badge--photo");
    if (how === "remove-parent" && img.parentNode) img.parentNode.remove();
    else img.remove();
  }
  document.addEventListener("error", function (e) { if (e.target && e.target.tagName === "IMG") fall(e.target); }, true);
  /* pictures that already failed before this listener could see them */
  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.forEach.call(document.querySelectorAll("img[data-fallback]"), function (i) { if (i.complete && i.naturalWidth === 0 && i.getAttribute("src")) fall(i); });
  });
})();
