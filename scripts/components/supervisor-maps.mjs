// Geography is image-space geometry traced from the official county PDFs.
// Current representation always comes from government.json, never the map key.
export function renderSupervisorMaps(model, government, { h, asset }) {
  const path = (rings) => rings.map((ring) => `M${ring.map((p) => p.join(",")).join("L")}Z`).join("");
  const districtLink = (entry) => {
    const supervisor = government.board.districts.find((d) => d.district === entry.district);
    const label = `District ${entry.district}: ${government.people[supervisor.personId].name}`;
    return `<a href="#supervisor-district-${entry.district}" data-map-district="${entry.district}" aria-label="${h(label)}"><path class="district-region" d="${path(entry.rings)}" fill-rule="evenodd"/><g class="district-marker" transform="translate(${entry.label.join(" ")})" aria-hidden="true"><circle r="${entry.label[0] > 500 || entry.label[1] > 680 ? 23 : 13}"/><text text-anchor="middle" dominant-baseline="central">${entry.district}</text></g></a>`;
  };
  return `<div class="supervisor-explorer" data-supervisor-explorer>
    <div class="district-map-main">
      <div class="district-zoom" data-map-zoom hidden><span>Map scale</span><button type="button" data-map-zoom-out aria-label="Zoom map out" disabled>−</button><output data-map-scale>100%</output><button type="button" data-map-zoom-in aria-label="Zoom map in">+</button></div>
      <div class="district-map-switch" role="group" aria-label="Choose a district map" data-map-switch hidden>${model.maps.map((map) => `<button type="button" data-map-view="${h(map.id)}" aria-pressed="${map.id === "county"}" aria-controls="district-map-${h(map.id)}">${h(map.title)}</button>`).join("")}</div>
      ${model.maps.map((map) => {
        const [x, y, width, height] = map.viewBox;
        return `<figure class="district-map" id="district-map-${h(map.id)}" data-district-map="${h(map.id)}"><figcaption>${h(map.title)}</figcaption><div class="district-map-viewport"><svg viewBox="${map.viewBox.join(" ")}" aria-labelledby="district-map-title-${h(map.id)}" role="group"><title id="district-map-title-${h(map.id)}">${h(map.title)} supervisor districts. Select an area to find its supervisor.</title><image href="${asset(map.assetId)}" x="${x}" y="${y}" width="${width}" height="${height}" aria-hidden="true"/>${map.districts.map(districtLink).join("")}${map.detailLink ? `<a href="#district-map-beatrice" data-map-detail="beatrice" aria-label="Explore Beatrice supervisor districts"><path class="district-city" d="${path(map.detailLink.rings)}"/><text class="district-city-label" x="${map.detailLink.label[0]}" y="${map.detailLink.label[1]}" text-anchor="middle" aria-hidden="true">Beatrice ↗</text></a>` : ""}</svg></div></figure>`;
      }).join("")}
    </div>
    <section class="district-map-info" aria-label="Supervisor map selection">
      <p class="eyebrow">Find your supervisor</p><h3>Where in Gage County?</h3>
      <p>Hover over an area to preview its supervisor. Click or tap to keep it selected. Use the Beatrice detail for city neighborhoods. Zoom in for more street detail.</p>
      <nav class="district-picker" aria-label="Choose a supervisor district">${government.board.districts.map((entry) => `<a href="#supervisor-district-${entry.district}" data-map-district="${entry.district}" aria-label="District ${entry.district}: ${h(government.people[entry.personId].name)}">${entry.district}</a>`).join("")}</nav>
      <div class="district-selection" data-district-selection><p>Select a district on the map or choose a district number.</p></div>
      <p class="district-status" role="status" data-district-status></p>
      <p class="gov-small">${h(model.precisionNote)}</p>
    </section>
  </div>`;
}
