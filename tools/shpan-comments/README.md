# shpan-comments moderation

The shpan-comments backend (`~/personal/shpan-comments`, Cloud Run) puts every anonymous
comment into `moderation` status, but there is no working approve/reject path in the product:
the admin UI is a placeholder, `GET /api/admin/pending-review-comments` returns a hardcoded
empty array, and the widget's Google login is commented out. `ApproveComment`/`RejectComment`
exist in the Firestore repo layer but nothing calls them.

So moderation is done by hand against Firestore (GCP project `shpan-comments`, default database).
Comments live at `posts/<postPath with "/" -> "-" and "." -> "_">/comments/<autoId>`; the `status`
field is one of `moderation` / `active` / `rejected`. Only `active` comments render on the blog.

## Usage

Needs `gcloud auth login` with an account that can write to the `shpan-comments` project.

```bash
./moderate.sh list                   # everything currently in moderation
./moderate.sh approve <DOC_PATH>     # status -> active
./moderate.sh reject  <DOC_PATH>     # status -> rejected
```

`list` prints the DOC_PATH of each pending comment, e.g.

    posts/-posts-austria2026-01-בוואריה/comments/XBj3LAH1lj0dDCGMktvS

Paths contain Hebrew; the script percent-encodes them, so paste them as-is (quoted).

Firestore console:
https://console.cloud.google.com/firestore/databases/-default-/data?project=shpan-comments
