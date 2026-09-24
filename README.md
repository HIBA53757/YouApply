# YouApply

YouApply is a responsive frontend portal for browsing, filtering, and saving internship and work-study opportunities. It is designed for students who need one place to discover relevant offers and keep track of the ones that interest them.

## Current Features

- Dynamic offer cards loaded from a local JSON file.
- Keyword and city search.
- Filters for contract type, technologies, work mode, and duration.
- Sorting by publication date.
- Client-side pagination.
- Detailed offer pages selected through the `id` URL parameter.
- Follow and unfollow actions persisted in browser `localStorage`.
- A followed-offers page with an automatic empty state.
- Responsive layouts and mobile navigation.
- Responsive submission and administration interface prototypes.

> The submission and administration pages currently provide the user interface only. They are not connected to a backend or database yet.

## Tech Stack

- HTML5
- Tailwind CSS through the CDN
- Custom CSS
- Vanilla JavaScript with ES modules
- JSON for offer data
- Browser `localStorage` for followed offers
- Git and GitHub
- Figma and Jira for design and project planning

No package installation or build step is required.

## Run the Project Locally

### Prerequisites

- Git
- A modern web browser
- A local HTTP server, such as the VS Code Live Server extension or Python

### Installation

```bash
git clone https://github.com/Mehdi-133/YouApply.git
cd YouApply
```

### Start a Local Server

With the VS Code Live Server extension, open `pages/index.html` using **Open with Live Server**.

Alternatively, start a server from the project root with Python:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500/pages/index.html
```

A local server is required because the application uses JavaScript modules and `fetch()` to load `data/offers.json`.

## Application Pages

| Page | Path | Purpose |
| --- | --- | --- |
| Offers | `pages/index.html` | Browse, search, filter, sort, and follow offers. |
| Offer details | `pages/offre-detail.html?id=1` | Display the complete information for a selected offer. |
| Followed offers | `pages/offer-suivies.html` | Display offers saved in the current browser. |
| Submit an offer | `pages/deposer-offer.html` | Responsive offer-submission interface prototype. |
| Administration | `pages/administration.html` | Responsive administration interface prototype. |

## Project Structure



## JavaScript Modules

| Module | Responsibility |
| --- | --- |
| `data.js` | Loads offers from `data/offers.json`. |
| `render.js` | Builds offer cards and handles follow/unfollow actions. |
| `filters.js` | Manages search, filters, sorting, and result counts. |
| `pagination.js` | Splits offers into pages and renders pagination controls. |
| `offer-details.js` | Reads the offer ID from the URL and renders its details. |
| `followed-offers.js` | Loads saved offer IDs and renders the followed-offers page. |
| `storage.js` | Reads and writes followed offer IDs in `localStorage`. |
| `app.js` | Initializes the offer list, pagination, and shared mobile menu behavior. |

## Data and Browser Storage

Offer content is stored in `data/offers.json`. Each offer has a numeric `id` used by the listing, details, and followed-offers pages.

Followed offer IDs are stored under the `followedOffers` key in the current browser's `localStorage`. Saved offers are therefore specific to the browser and device being used.

## Current Limitations

- No backend API or database.
- No user authentication or role management.
- Submission and administration actions are not persisted.
- Followed offers are not synchronized between browsers or devices.

## Project Documentation

- [Requirements analysis](docs/analyse-cahier-des-charges.md)
- [Figma reference](docs/figma-link.md)
- [Jira export](docs/jira-export.md)
