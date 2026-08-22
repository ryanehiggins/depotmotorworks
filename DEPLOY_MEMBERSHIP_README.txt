THE DEPOT MOTORWORKS — MEMBERSHIP PAGE DEPLOYMENT

Upload the contents of this package to the ROOT of the existing GitHub repository, preserving folders.

NEW FILES
/membership.html
/css/membership.css
/images/membership-lounge-hero.jpg
/images/lounge-concept-sketch-square.jpg
/images/detail-bay-concept-sketch-square.jpg

REPLACE EXISTING FILES
/js/main.js
/_redirects
/sitemap.xml

WHAT THIS DEPLOYMENT DOES
- Adds the new Depot Membership subpage.
- Adds Membership to the primary navigation on the existing site through the shared js/main.js.
- Adds a dedicated Founding Member interest form using the site's existing Formspree endpoint.
- Adds /membership -> /membership.html routing.
- Adds the Membership page to sitemap.xml.
- Adds an approved lounge visual to the Membership hero.
- Adds two 1:1 concept-sketch images:
  • Lounge: approximately 25' x 25', comfortable seating, coffee, compact wet bar with sink and mini fridge; no commercial bar.
  • DIY detail bay: located in the building's drive-through section, with wash/vacuum capability, supplies, and compressed air.
- Keeps DIY mechanical/lift work explicitly outside the member amenity concept.
- Keeps final membership pricing and exact benefits described as still in development.
- Does not collect payment; the Founding Member form is an interest list only.

DEPLOYMENT
1. Open the GitHub repository root.
2. Upload the files/folders from this ZIP, preserving the css/, images/, and js/ folders.
3. Allow GitHub to replace the three existing files listed above.
4. Commit the upload.
5. Verify:
   - /membership.html
   - /membership
   - Membership appears in navigation on Home, CarPlay, Diagnostics, Dispatch, and other existing pages.
   - Founding Member form submits.
   - Both concept sketches display as square images on desktop and mobile.

No live deployment was performed by ChatGPT.


MANDATORY DEPOT WEBSITE DEPLOYMENT CHECKLIST
===========================================
These checks are required for EVERY future Depot website deployment:

1. NAVIGATION MUST BE UPDATED IN THE HTML ITSELF.
   - Do not rely on JavaScript to inject new navigation links.
   - When a new top-level page is added, physically add its navigation link to EVERY current HTML page, including legacy/alias pages.
   - Verify the same navigation destinations are present across all pages before packaging.

2. _redirects MUST ALWAYS BE REVIEWED AND INCLUDED.
   - _redirects must be at the repository root of the deployment ZIP.
   - Add/update routes for every new or renamed subpage.
   - Never bury _redirects inside an extra enclosing folder.

3. SITEMAP MUST BE REVIEWED.
   - Add new public pages to sitemap.xml and confirm canonical URLs.

4. PACKAGE STRUCTURE MUST MATCH THE REPOSITORY ROOT.
   - index.html, _redirects, sitemap.xml, and top-level pages belong at ZIP root.
   - css/, js/, and images/ retain their repository-relative paths.

5. PRE-DELIVERY VERIFICATION.
   - Scan every HTML file in the package for the new nav link.
   - Verify every referenced new asset exists in the ZIP.
   - Verify _redirects exists at ZIP root.
   - Do not call a package deployment-ready until all checks pass.
