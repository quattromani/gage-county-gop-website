export function renderPolicyPage(policy, { policies, pageHero, email, h }) {
  const href = (value) => value === "party-email" ? `mailto:${email}` : value === "accessibility-email" ? `mailto:${email}?subject=Website%20accessibility` : value;
  return pageHero("Website information", h(policy.title), h(policy.intro)) +
    `<article class="wrap section policy-page" aria-label="${h(policy.title)} details"><p class="policy-updated">Last updated <time datetime="${h(policies.updated)}">${h(policies.updatedLabel)}</time></p>${policy.sections.map((section) => `<section id="${h(section.id)}"><h2>${h(section.title)}</h2>${section.paragraphs.map((text) => `<p>${h(text)}</p>`).join("")}${section.links ? `<ul class="policy-links">${section.links.map((link) => `<li><a href="${h(href(link.href))}">${h(link.label)}</a></li>`).join("")}</ul>` : ""}</section>`).join("")}</article>`;
}
