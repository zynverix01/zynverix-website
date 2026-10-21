/*
 * ZYNVERIX SITE CONFIG — the only file you need to edit before launch.
 *
 * bookingUrl   Your Calendly (or other) booking link, e.g. "https://calendly.com/zynverix/audit".
 *              While empty, every "Book a free audit" button opens a pre-filled email instead,
 *              so no visitor ever lands on a broken link.
 * linkedinUrl  Company LinkedIn page URL. While empty, LinkedIn links stay hidden.
 * email        Public contact address.
 * setupTime    Approved setup-time wording for the homepage FAQ. While empty, only the general answer shows.
 *
 * gaMeasurementId  Google Analytics 4 ID, e.g. "G-ABC123XYZ". While empty, no analytics code loads.
 *
 * contactForm.provider  How the Contact page form is sent:
 *   "netlify"  (default) Real submissions go to Netlify > Forms (free) and can be emailed to you; visitor sees /thank-you/.
 *              Requires hosting on Netlify. If sending fails, the visitor is shown the email address instead.
 *   "mailto"   Opens the visitor's email app with the message filled in. Works on any host.
 *   "https://formspree.io/f/XXXX"  Any form endpoint URL that accepts POST (e.g. Formspree).
 *
 * team         Optional photo and LinkedIn for each partner. Put photos in assets/team/
 *              e.g. photo: "assets/team/ash.jpg". While empty, initials are shown and the LinkedIn button is hidden.
 * demos        Paste a video URL (MP4, or a YouTube/Loom/Vimeo embed URL) to replace a
 *              "coming soon" placeholder with the real video.
 */
window.ZYNVERIX_CONFIG = {
  bookingUrl: "",
  linkedinUrl: "",
  email: "info@zynverix.com",
  setupTime: "",

  gaMeasurementId: "",

  contactForm: { provider: "https://formspree.io/f/mwlvgqyr" },

  team: {
    ash:     { photo: "assets/team/ash.webp", linkedin: "" },
    zack:    { photo: "assets/team/zack.webp", linkedin: "" },
    michael: { photo: "assets/team/michael.webp", linkedin: "" }
  },

  demos: {
    instantResponse: "",   // homepage Demo 01
    followUpPipeline: "",  // homepage Demo 02
    realEstate: "",        // Projects page Demo 01
    homeServices: ""       // Projects page Demo 02
  }
};
