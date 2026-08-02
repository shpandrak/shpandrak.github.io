# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

ShpanBlog — a family travel blog in **Hebrew (RTL)**, built with **Hugo** and the **PaperMod** theme, hosted on GitHub Pages at https://shpandrak.github.io/.

## Commands

```bash
# First-time setup: PaperMod theme is a git submodule
git submodule update --init --recursive

# Local dev server (drafts included), http://localhost:1313
hugo server -D

# Production build (what CI runs)
hugo --minify --baseURL "https://shpandrak.github.io/"
```

There are no tests or linters. Verification = build succeeds + visual check of the local server.

## Deployment

Pushing to **`main`** triggers `.github/workflows/hugo.yml`, which builds with Hugo (extended, latest) and deploys `public/` to GitHub Pages. Note: `origin/HEAD` points at `master`, but **`main` is the branch that actually publishes** — work and merge there. `public/` and `resources/_gen/` are gitignored build output; never edit them.

## Content structure

Each trip is a Hugo **series** under `content/posts/<trip><year>/`:

- `_index.md` — the series landing page. Front matter sets `type: "series"`, a `cover.jpg`, and a `cascade` that applies to all chapters: `series: ["<trip><year>"]`, nav/breadcrumb params, and `build.publishResources: false` (see image pipeline below).
- One subdirectory per chapter (Hebrew folder names, sometimes numbered like `01-...` for ordering), each a page bundle: `index.md` + its photos alongside it.
- Post body embeds photos as `![](IMG_xxx.jpg "caption")` — the caption in the title position becomes the `<figcaption>`.

Chapter prev/next navigation is series-based via the overridden `layouts/partials/post_nav_links.html` (sorts by date).

## Image pipeline (the non-obvious part)

`layouts/_default/_markup/render-image.html` is a render hook that handles every markdown image:

- Local non-GIF images are resized to **800px-wide thumbnails** by Hugo; only the thumbnail is published (the `publishResources: false` cascade keeps full-size originals out of the deployed site).
- The thumbnail links to the **full-size original served from jsDelivr CDN**, which pulls straight from this GitHub repo: `https://cdn.jsdelivr.net/gh/shpandrak/shpandrak.github.io@main/content/<page path>/<image>`. This means full-size images only work after the commit is pushed to `main`.
- Figure/caption styling and the RTL forcing live in `assets/css/extended/custom.css` (PaperMod's extended-CSS mechanism).

`layouts/partials/templates/opengraph.html` overrides the theme's OpenGraph partial (og:image sizing fixes for link previews).

## Comments ("shpan-comments")

Comments are a self-hosted widget, not a theme feature:

- `layouts/partials/comments.html` renders the `#comments-container` div pointing at the backend on Google Cloud Run (`https://shpan-comments-762084116292.me-west1.run.app`); `layouts/partials/extend_footer.html` loads its `widget.js`. Both files contain commented-out `localhost` variants for local development against a local backend.
- Currently anonymous-only commenting.
- `tools/comentario/` holds docker-compose/Dockerfile/deploy scripts for the comment server (Comentario-based). The `secrets*.yaml` files there are deployment config — don't commit new secrets or echo their contents.

## Adding a new trip

1. Create `content/posts/<trip><year>/` (e.g. `japan2026`) with a `cover.jpg` and an `_index.md`:

```yaml
---
title: "<שם הטיול בעברית> <year>"
date: 2026-08-02T05:34:00Z
tags: ["<מדינה בעברית>"]
author: "Shpandrak"
type: "series"
cascade:
  params:
    ShowPostNavLinks: true
    ShowBreadCrumbs: true
    series: ["<trip><year>"]
    build:
      publishResources: false

cover:
  image: "cover.jpg"
  responsiveImages: true
  relative: true
---
```

2. For each chapter, create a subdirectory (Hebrew name; prefix `01-`, `02-`, … when album-style ordering matters) containing the photos and an `index.md`:

```yaml
---
title: "<כותרת הפרק>"
date: 2026-08-02 11:58:00 +0000 UTC
updated: 2026-08-02 11:58:00 +0000 UTC
author: "Shpandrak"
cover:
  image: "cover.jpg"        # or any photo in the bundle
  responsiveImages: true
  hiddenInSingle: true      # cover shows in lists only, not atop the post
  relative: true
---
```

Conventions to keep:
- Every chapter needs a `cover` block — without one the post card in list pages has no image (this has been fixed retroactively before).
- Chapter `date` values drive prev/next ordering within the series; give each chapter a distinct, chronological date.
- Photos go in the chapter's own directory and are embedded as `![](photo.jpg "caption")` — caption optional but the quotes style is `![](x.jpg "")` when empty.
- Tag with the country name in Hebrew, matching existing tags where possible.
- Body text is Hebrew; RTL is handled globally by `custom.css`, no per-post work needed.

3. Preview with `hugo server -D`, then commit and push to `main`. Remember full-size image links (jsDelivr) resolve only after the push lands on `main` — locally and in PR previews only the 800px thumbnails work.

## Site config notes (`hugo.yaml`)

- Language is `he` (Hebrew); menu labels are Hebrew (ארכיון/archives, טיולים/posts, חיפוש/search).
- Home output includes JSON — required by PaperMod's search page (`content/search.md`). `content/archives.md` is the archive page.
- Taxonomies: tags, categories, and `series` (series drives trip grouping).
- `.gitmodules` lists a stray duplicate submodule entry (`themes/themes/PaperMod`) — harmless, but don't "fix" submodules blindly.
