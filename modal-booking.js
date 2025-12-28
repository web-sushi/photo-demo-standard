/* =========================
   BOOKING MODAL
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector(".modal");
  if (!modal) return;

  /* MODAL HTML (INJECTED ONLY IF MODAL IS EMPTY) */
  if (!modal.querySelector(".modal-card")) {
    modal.innerHTML = `
      <div class="modal-backdrop"></div>

      <div class="modal-card">
        <button class="modal-close" aria-label="Close booking form">&times;</button>

        <h2 class="modal-title">Book a Session</h2>
        <p class="muted modal-sub">
          Share a few details and I'll get back to you within 24 hours.
        </p>

        <form class="modal-form">
          <label>
            Name
            <input type="text" name="name" required />
          </label>

          <div class="row">
            <label>
              Email
              <input type="email" name="email" required />
            </label>

            <label>
              Phone
              <input type="tel" name="phone" />
            </label>
          </div>

          <label>
            Session Type
            <select name="type">
              <option>Portrait</option>
              <option>Wedding</option>
              <option>Event</option>
              <option>Editorial</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Preferred Date
            <input type="date" name="date" />
          </label>

          <label>
            Message
            <textarea name="message" rows="4"></textarea>
          </label>

          <button class="btn primary full" type="submit">
            Send Inquiry
          </button>

          <p class="micro muted modal-note">
            This does not confirm a booking yet.
          </p>
        </form>
      </div>
    `;
  }

  const backdrop = modal.querySelector(".modal-backdrop");
  const closeBtn = modal.querySelector(".modal-close");

  /* OPEN MODAL */
  function openModal() {
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
  }

  /* CLOSE MODAL */
  function closeModal() {
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }

  /* OPEN BUTTONS */
  document.querySelectorAll(".js-open-booking").forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  /* CLOSE ACTIONS */
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }
  if (backdrop) {
    backdrop.addEventListener("click", closeModal);
  } else {
    // If no backdrop, close on modal click (for pages with existing modal HTML)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* FORM SUBMIT (NO BACKEND YET) */
  const form = modal.querySelector(".modal-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you! I'll get back to you shortly.");
      closeModal();
      form.reset();
    });
  }
});
