const TASKS = ["add", "update", "stop", "interest"];
export const CONSENT_VERSION = "contact-notices-v1";

export function validateContact(values) {
  const errors = {};
  const limits = { name: 100, email: 254, mobile: 40, community: 100, previous: 254, committee: 100, message: 2000 };
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof values[key] !== "string" || values[key].length > limit) errors[key] = `Please keep this field within ${limit} characters.`;
  }
  if (!TASKS.includes(values.task)) errors.task = "Choose what you would like to do.";
  if (!values.name?.trim()) errors.name = "Enter your name.";
  if (!values.email && !values.mobile) errors.email = "Provide an email address or mobile number so we can find or contact you.";
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter an email address such as name@example.com.";
  const digits = (values.mobile || "").replace(/\D/g, "");
  if (values.mobile && (!/^[+\d() .-]+$/.test(values.mobile) || digits.length < 10 || digits.length > 15)) errors.mobile = "Enter a mobile number with area code.";
  if (!["email", "text", "both", "reply"].includes(values.notices) || (values.task === "stop" && values.notices === "reply")) errors.notices = "Choose which notices you want to receive or stop.";
  if (values.task !== "stop") {
    if (["email", "both"].includes(values.notices) && !values.email) errors.email = "Provide your email address for email notices.";
    if (["text", "both"].includes(values.notices) && !values.mobile) errors.mobile = "Provide your mobile number for text notices.";
  }
  return errors;
}

export async function sendContact(endpoint, submission, fetcher = fetch, signal) {
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint)) throw new Error("The contact service is temporarily unavailable. Please email the county party.");
  const response = await fetcher(endpoint, { method: "POST", body: new URLSearchParams({ payload: JSON.stringify(submission) }), mode: "cors", credentials: "omit", redirect: "follow", referrerPolicy: "no-referrer", signal });
  const receipt = await response.json();
  if (!response.ok || receipt.ok !== true || receipt.requestId !== submission.requestId) throw new Error("We could not confirm receipt. Your details are still here. Try again, or email the county party.");
  return receipt;
}

function initializeContactForm() {
  const dialog = document.querySelector("[data-contact-dialog]");
  const form = dialog?.querySelector("[data-contact-form]");
  if (!form || typeof dialog.showModal !== "function") return;
  const fields = form.elements;
  const errorSummary = dialog.querySelector("[data-contact-errors]");
  const editor = dialog.querySelector("[data-contact-editor]");
  const receipt = dialog.querySelector("[data-contact-receipt]");
  const progress = dialog.querySelector("[data-contact-progress]");
  const submit = form.querySelector("[data-contact-submit]");
  let opener, pending = false, unviewedReceipt = false, previousPayload = "", requestId = "";

  function clearErrors() {
    errorSummary.hidden = true;
    errorSummary.replaceChildren();
    form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
    form.querySelectorAll("[data-field-error]").forEach((field) => { field.hidden = true; field.textContent = ""; });
  }
  function updatePurpose() {
    const stopping = fields.task.value === "stop";
    dialog.querySelector("#contact-title").textContent = ({ add: "Stay informed.", update: "Update details.", stop: "Stop notices.", interest: "Get involved." })[fields.task.value];
    const replyChoice = form.querySelector("[data-reply-choice]");
    replyChoice.hidden = stopping;
    replyChoice.querySelector("input").disabled = stopping || pending;
    if (stopping && fields.notices.value === "reply") fields.notices.value = "";
    form.querySelector("[data-notice-legend]").textContent = stopping ? "Which notices should we stop? (required)" : "How would you like to hear from us? (required)";
    form.querySelector("[data-contact-previous]").hidden = !["update", "stop"].includes(fields.task.value);
    form.querySelector("[data-contact-involvement]").hidden = stopping;
    form.querySelector("[data-contact-consent]").textContent = stopping ? "Your request asks the team to stop the selected notices. It will be reviewed before your record is changed." : "Your chosen channels apply to ongoing notices. “Reply to this request only” does not sign you up for notices. You can update your details or stop notices here.";
    fields.email.required = !stopping && ["email", "both"].includes(fields.notices.value);
    fields.mobile.required = !stopping && ["text", "both"].includes(fields.notices.value);
  }
  function openForm(task = "add", team = "", trigger) {
    opener = trigger || opener || document.activeElement;
    if (unviewedReceipt) {
      if (!dialog.open) dialog.showModal();
      document.documentElement.classList.add("contact-modal-open");
      receipt.querySelector("h3").focus();
      unviewedReceipt = false;
      return;
    }
    if (!pending) {
      if (!receipt.hidden) { form.reset(); previousPayload = ""; requestId = ""; clearErrors(); }
      editor.hidden = false;
      receipt.hidden = true;
      fields.task.value = TASKS.includes(task) ? task : "add";
      if (task === "interest") fields.notices.value = "reply";
      if (team && [...fields.committee.options].some((option) => option.value === team)) fields.committee.value = team;
      updatePurpose();
    }
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add("contact-modal-open");
    dialog.querySelector("#contact-title").focus({ preventScroll: true });
  }
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-contact-open]");
    if (!trigger) return;
    event.preventDefault();
    openForm(trigger.dataset.contactOpen, trigger.dataset.contactTeam, trigger);
  });
  dialog.querySelectorAll("[data-contact-close]").forEach((button) => button.addEventListener("click", () => dialog.close()));
  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("contact-modal-open");
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled):not([tabindex="-1"]), select:not(:disabled), textarea:not(:disabled), a[href]')].filter((control) => control.getClientRects().length && !control.closest("[hidden]"));
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement))) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  form.addEventListener("change", updatePurpose);
  form.addEventListener("input", (event) => {
    const error = form.querySelector(`[data-field-error="${event.target.name}"]`);
    if (error) { error.hidden = true; event.target.removeAttribute("aria-invalid"); }
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (pending) return;
    clearErrors();
    const data = Object.fromEntries(new FormData(form));
    const values = Object.fromEntries(["task", "name", "email", "mobile", "notices", "community", "previous", "committee", "message", "website"].map((key) => [key, String(data[key] || "").trim()]));
    if (values.task === "stop") values.committee = "";
    const errors = validateContact(values);
    if (Object.keys(errors).length) {
      const intro = document.createElement("p"); intro.textContent = "Please check the highlighted details.";
      errorSummary.append(intro);
      const list = document.createElement("ul");
      for (const [name, text] of Object.entries(errors)) {
        const field = form.querySelector(`[name="${name}"]`);
        const hint = form.querySelector(`[data-field-error="${name}"]`);
        field?.setAttribute("aria-invalid", "true");
        if (hint) { hint.textContent = text; hint.hidden = false; }
        const item = document.createElement("li"), link = document.createElement("a");
        link.href = `#${field?.id || "contact-name"}`; link.textContent = text;
        link.addEventListener("click", (click) => { click.preventDefault(); field?.focus(); });
        item.append(link); list.append(item);
      }
      errorSummary.append(list); errorSummary.hidden = false; errorSummary.focus();
      return;
    }
    const serialized = JSON.stringify(values);
    if (serialized !== previousPayload) { requestId = crypto.randomUUID(); previousPayload = serialized; }
    const submission = { ...values, requestId, consentVersion: CONSENT_VERSION };
    pending = true;
    form.setAttribute("aria-busy", "true");
    progress.textContent = "Saving your request…";
    [...form.elements].forEach((field) => { field.disabled = true; });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000);
    try {
      await sendContact(form.dataset.endpoint, submission, fetch, controller.signal);
      editor.hidden = true; receipt.hidden = false;
      unviewedReceipt = !dialog.open;
      if (dialog.open) { dialog.querySelector(".contact-dialog-body").scrollTop = 0; receipt.querySelector("h3").focus(); }
    } catch (error) {
      errorSummary.textContent = error.message.includes("temporarily unavailable") ? error.message : "We could not confirm receipt. Your details are still here. Try again, or email the county party. Retrying the same request will not add a duplicate.";
      const emailLink = form.querySelector('a[href^="mailto:"]').cloneNode(true);
      emailLink.textContent = "Email the county party";
      errorSummary.append(document.createTextNode(" "), emailLink);
      errorSummary.hidden = false;
      if (dialog.open) errorSummary.focus();
    } finally {
      clearTimeout(timeout); pending = false; form.removeAttribute("aria-busy");
      [...form.elements].forEach((field) => { field.disabled = false; });
      updatePurpose(); progress.textContent = ""; submit.disabled = false;
    }
  });
  if (location.pathname.endsWith("/updates.html") && TASKS.includes(location.hash.slice(1))) openForm(location.hash.slice(1));
}
if (typeof document !== "undefined") initializeContactForm();
