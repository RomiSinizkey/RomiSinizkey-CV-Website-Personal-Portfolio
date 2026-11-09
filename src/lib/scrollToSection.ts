/**
 * Smooth-scrolls to a home-page section, leaving a 24px gap above it.
 *
 * On small phones the fixed navbar wraps onto two rows and can be taller than the
 * section's top padding, so the scroll stops a little earlier when needed to keep
 * the section's heading visible below the navbar. On larger screens this never
 * triggers, so the scroll position is the same as before.
 */
export function scrollToSection(sectionId: string) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  let top = section.getBoundingClientRect().top + window.scrollY - 24;

  const heading = section.querySelector("h1, h2");
  const navbar = document.querySelector(".topNav");
  if (heading && navbar) {
    const headingTop = heading.getBoundingClientRect().top + window.scrollY;
    const navbarBottom = navbar.getBoundingClientRect().bottom;
    top = Math.min(top, headingTop - navbarBottom - 16);
  }

  window.scrollTo({ top, behavior: "smooth" });
}
