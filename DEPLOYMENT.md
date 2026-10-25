# Portfolio deployment

Website: https://carlshi6.github.io/

The current editable portfolio is in `source/`. The older static files at the
repository root remain for history; GitHub Pages publishes the workflow artifact,
not those files.

## Iterate

1. Edit the website in `source/`.
2. From `source/`, run `npm ci`, then `npm run dev` for local preview.
3. Run `npm run build` to verify the static export.
4. Commit and push to `main`. The Publish portfolio workflow automatically builds
   and deploys `source/dist/client` to GitHub Pages.

The repository is public: do not commit credentials, private documents, or environment
files. Changes made in a separate Sites checkout are not automatically synchronized
to this repository.

Existing routes and public assets are retained. The canonical website origin is
https://carlshi6.github.io/.

## Current synchronized snapshot

Sites version 107, source commit `4642b1c47aa88058fccec966ab9bfb3d22ae3bc1`.
Includes the latest résumé, project copy, skill objects, and Build Hope interactive
workflow, inline roadmap explanations, and recommendation rationale. GitHub Pages
export configuration and its canonical origin are retained. Subsequent AI PC work
is not part of this snapshot.

After building, run `node --test tests/github-pages-export.test.mjs` from `source/`
to verify the static output and synchronized content.
