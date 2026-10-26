document.addEventListener("keydown", (event) => {
  const menu = document.querySelector(".mobile-nav");
  if (event.key === "Escape" && menu?.open) {
    menu.open = false;
    menu.querySelector("summary").focus();
  }
});
