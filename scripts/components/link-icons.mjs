// Vector paths avoid platform font and emoji substitutions for link affordances.
const paths = {
  "up-right": "M3 13 13 3M3 3h10v10",
  right: "M2 8h12M9 3l5 5-5 5",
  left: "M14 8H2M7 3 2 8l5 5",
  up: "M8 14V2M3 7l5-5 5 5",
  down: "M8 2v12M3 9l5 5 5-5",
};
export function arrowSvg(direction = "up-right", size = "1em") {
  if (!paths[direction]) throw Error(`Unknown arrow direction: ${direction}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${paths[direction]}"/></svg>`;
}
export function arrowIcon(direction = "up-right") {
  return `<span class="link-arrow" aria-hidden="true">${arrowSvg(direction)}</span>`;
}
