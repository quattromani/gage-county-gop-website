const search = document.querySelector("[data-archive-search]");
const entries = [...document.querySelectorAll("[data-archive-entry]")];
const status = document.querySelector("[data-search-status]");
search?.addEventListener("input", () => {
  const term = search.value.trim().toLowerCase();
  let count = 0;
  for (const entry of entries) {
    entry.hidden = !entry.textContent.toLowerCase().includes(term);
    if (!entry.hidden) count++;
  }
  status.textContent = `${count} source ${count === 1 ? "page" : "pages"} found`;
});
function openSource() {
  const target = document.getElementById(
    decodeURIComponent(location.hash.slice(1)),
  );
  if (target?.matches("details")) target.open = true;
}
openSource();
window.addEventListener("hashchange", openSource);
document.addEventListener("keydown", (event) => {
  const menu = document.querySelector(".mobile-nav");
  if (event.key === "Escape" && menu?.open) {
    menu.open = false;
    menu.querySelector("summary").focus();
  }
});
