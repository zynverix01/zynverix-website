# Zynverix website

A static site (HTML/CSS/JS). It needs no build step and works on any static host (Netlify, Cloudflare Pages, cPanel).

## Clean URLs
Every page lives in its own folder as `index.html`, so it gets a clean address:

| Page | URL |
|---|---|
| Home | zynverix.com/ |
| Services | /services/ |
| Speed to Lead | /services/speed-to-lead/ |
| Lead Qualification | /services/lead-qualification/ |
| Appointment Booking & Reminders | /services/appointment-booking-reminders/ |
| Automated Lead Follow-Up | /services/lead-follow-up/ |
| CRM Pipeline Setup | /services/crm-setup/ |
| Weekly Lead Reporting | /services/lead-reporting/ |
| Facebook & Instagram Ads | /services/facebook-instagram-ads/ |
| Website Design | /services/web-design/ |
| Social Media Management | /services/social-media-management/ |
| Complete Digital Marketing | /services/digital-marketing/ |
| Industries | /industries/ |
| Real Estate | /industries/real-estate/ |
| Roofing | /industries/roofing/ |
| HVAC | /industries/hvac/ |
| Plumbing | /industries/plumbing/ |
| Contractors & Remodelers | /industries/contractors/ |
| About / Team / Projects / Contact | /about/ /team/ /projects/ /contact/ |
| Privacy / Terms (drafts) | /privacy/ /terms/ |

## View it locally (VS Code)
Folder URLs need a local server. Double-clicking the files won't follow the links correctly.
1. Open the `zynverix` folder in VS Code.
2. Install the **Live Server** extension, open `index.html`, and click **Go Live**.

## SEO, GEO & AEO checklist (built in)
| # | Item | Status |
|---|---|---|
| 1 | Server-side rendering | Every page is pre-rendered static HTML. All text is in the HTML source, with no JavaScript needed to read it |
| 2 | robots.txt | Allows all search engines and AI assistants (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…), links the sitemap |
| 3 | sitemap.xml | 24 public URLs with last-modified dates |
| 4–6 | Unique titles, meta descriptions, one H1 | Every page, keyword-targeted (see keyword map) |
| 7 | Canonical tags | Every page, plus `index, follow, max-image-preview:large` |
| 8 | Open Graph images | 1200×630 preview image + alt text on every page |
| 9 | Custom 404 | `404.html` (Netlify and .htaccess both use it) |
| 10 | 301 redirects | `_redirects` (Netlify/Cloudflare) and `.htaccess` (Apache): http→https, www→non-www, old .html URLs and renamed service pages |
| 11–13 | Alt text, WebP, lazy loading | All images WebP, all have alt text, below-the-fold images lazy-load |
| 14 | Schema | Organization (founders, contact, services), WebSite, WebPage, BreadcrumbList, Service, FAQPage (16 pages), Person (team) |
| 15–16 | Breadcrumbs, internal links | Visible breadcrumbs + BreadcrumbList schema; services ↔ industries ↔ home linking |
| 17 | Google Analytics 4 | Built in: paste your ID into `gaMeasurementId` in `assets/config.js`. Tracks audit-button clicks and form leads |
| 18 | Search Console | See steps below |
| 19 | Privacy policy | Covers the contact form, booking tools, Google Analytics and cookies (draft, needs legal review) |
| 20 | Working contact form | Netlify Forms: real submissions, spam honeypot, required SMS-consent checkbox (unchecked) |
| GEO/AEO | AI answer engines | `llms.txt` summary for AI assistants, FAQPage schema, question-style headings, plain-language answers, clear entity facts |

## Launch steps (in order)
1. **Deploy on Netlify:** drag the folder into app.netlify.com/drop. The `_redirects` and `_headers` files are applied automatically.
2. **Domain:** add `zynverix.com` in Netlify → Domain management. Set `zynverix.com` (no www) as primary. Change only A/CNAME records and never touch MX/SPF/DKIM/DMARC (email).
3. **Contact form:** in Netlify → Forms, enable form detection, then redeploy. Add an email notification to info@zynverix.com under Forms → Notifications. Send one test message.
4. **Google Analytics:** create a GA4 property at analytics.google.com → copy the Measurement ID (G-…) → paste into `assets/config.js` → redeploy.
5. **Google Search Console:** search.google.com/search-console → Add property → **Domain** → `zynverix.com` → add the TXT record it gives you at your domain registrar → Verify. Then go to Sitemaps → submit `sitemap.xml`. Use URL Inspection → "Request indexing" for the homepage and top service and industry pages.
6. **Bing Webmaster Tools:** bing.com/webmasters → import from Search Console. Bing also powers ChatGPT search and Copilot, so this matters for AI visibility.
7. **Company LinkedIn:** once it exists, send the URL to be added to `linkedinUrl` and to the Organization schema (`sameAs`).

## Before launch: edit `assets/config.js`
| Setting | What happens while it's empty |
|---|---|
| `bookingUrl` | Every "Book a free audit" button opens a pre-filled email. Paste your Calendly link and they all switch to it. |
| `linkedinUrl` | LinkedIn links stay hidden. |
| `setupTime` | The homepage FAQ shows only the general answer. |
| `demos.*` | "Demo coming soon" placeholders show. Paste an MP4 or a YouTube/Loom embed URL. |
| `team.*` | Initials show. Add a photo path (e.g. `assets/team/ash.jpg`) and a LinkedIn URL. |
| `contactForm.provider` | `"netlify"` (default) sends real submissions on Netlify. Use `"mailto"` if you host elsewhere. |
| `gaMeasurementId` | No analytics code loads. Paste your GA4 ID (G-…). |

## Deploy
**Netlify:** drag the folder into app.netlify.com/drop, then add `zynverix.com` under Domain management. Change only the A/CNAME records. Do not touch MX, SPF, DKIM, or DMARC (email).
**Cloudflare Pages:** Direct upload, then Custom domains.

## Notes
- No invented results, clients, prices, or stats. All mockups are labeled "Demo" or "Illustrative".
- Privacy and Terms are drafts with [PLACEHOLDERS] and need legal review.
- The contact form has the required unchecked SMS consent checkbox. It is optional, and leads who leave it unchecked get email replies only.
