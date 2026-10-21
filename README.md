# Dan Stingaciu — personal portfolio

A static, dependency-free portfolio at [dstingaciu.com](https://dstingaciu.com/). The page is served directly from `index.html`; there is no framework, bundler, package installation, or runtime dependency.

## Local preview

From this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173`. JavaScript enhancements are optional: content, navigation, résumé links, and expandable experience entries work without it.

## Checks and optional production package

Node.js 22 or newer is required only for the development checks and packaging. No `npm install` is needed.

```sh
npm run lint   # JavaScript syntax checks; no third-party linter
npm run check  # local links, metadata, dimensions, IDs, and accessibility references
npm test       # production packaging and progressive-enhancement regression tests
npm run build  # verified static publication files in dist/
```

`dist/` includes only the current page and its required assets. The existing root-serving deployment remains compatible; the optional package does not change hosting. Existing `deploy.sh` and CircleCI deployment configuration have been preserved. No deployment is performed by these commands.

## Where to edit

- `index.html`: semantic content and metadata. No content is fetched or generated on page load.
- `assets/css/main.css`: maintained stylesheet. Colors, type families, and layout tokens are at the top; responsive and reduced-motion rules follow the section styles.
- `assets/js/main.js`: layer selection, active navigation, and the footer year. No dependencies or scroll event handlers.
- `images/social-preview.png`: 1200 × 630 social sharing artwork matching the site.
- `site.webmanifest`, `sitemap.xml`, `robots.txt`: discovery and browser metadata.
- `scripts/`: optional validation and publication packaging.

The old Stellar Sass files, vendor scripts, fonts, and photographs remain in the repository as historical assets; the redesigned page does not load them. `assets/sass/main.scss` is **not** the source of the new CSS and should not be compiled over it. Old résumé variants are retained in the source checkout and excluded from the optional package.

## Design and content decisions

The warm paper, charcoal, and vermilion palette and editorial typography keep the site personal and restrained. Georgia italic adds a distinctive emphasis without loading a webfont. A native SVG diagram explains the relationship between interfaces, services, and infrastructure; its controls reveal actual areas of experience, not live telemetry or an internal IBM architecture.

Engineering accomplishments lead the narrative. The 90% claim is explicitly qualified as “up to”; its bar illustration is labelled illustrative. Patent wording preserves “co-authored” and “selected for publication” and makes no claim of grant or completed publication. Professional descriptions stay at the level provided in the brief.

Native `<details>` entries offer progressive disclosure and keyboard support without a custom accordion. Reduced motion disables smooth scrolling and transitions. Image dimensions reserve layout space. Email links use `mailto:`. Existing verified GitHub and LinkedIn URLs are retained. The original section fragments (`intro`, `first`, `second`, `third`, `fourth`) remain available for old bookmarks.

The original site had no standalone personal-project catalogue or verified repository links for the community work. RU Hacks and CanSat are presented as real team contributions without invented demos, repositories, or technologies. Personal social profiles are omitted from the professional contact section.

## Content provenance and remaining assets

The supplied redesign brief and current `assets/files/Dan_Stingaciu_Resume.pdf` are the sources for current IBM roles, accomplishments, technical expertise, community leadership, and completed education. Existing website content and archived résumé PDFs corroborate earlier roles and team work. Both résumé buttons link to the current PDF, which is included in the build.

- **Dates verified.** The current résumé and supplied brief agree on January 2022 for Shomigo; the older archived résumé had listed December 2021.
- **Optional additions.** A current portrait, verified public project links, and publicly shareable patent publication links would add supporting material. Existing portrait and assets are preserved; no missing details have been invented.

## Validation status

JavaScript syntax checks, site checks, all three regression tests, and the static build pass. The page returns HTTP 200 from the local preview server. The social preview image was visually inspected.

Browser-based desktop/tablet/mobile review and Lighthouse were **not completed**: the in-app browser failed to attach, Chrome browser control was unavailable, and native browser access stalled. Responsive CSS includes breakpoints at 1100, 760, and 480 px, plus reduced-motion and print styles; these still need browser visual verification before deployment. No Lighthouse scores are claimed.
