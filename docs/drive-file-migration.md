# Migrating Google Drive from `drive.readonly` to `drive.file`

## Why

`https://www.googleapis.com/auth/drive.readonly` is a **restricted** scope under
Google's OAuth policy. Publishing an app that uses it requires:

- OAuth app verification (brand review of the homepage, privacy policy, and a demo video), **and**
- an annual **CASA Tier 2 security assessment** by a Google-designated third-party
  assessor — paid, and typically several weeks of back-and-forth.

`https://www.googleapis.com/auth/drive.file` is **non-sensitive**. It needs no
verification and no CASA assessment at all. The trade-off is real:
`drive.file` grants access only to files the user hands the app through Google's
own file picker, so HypeMuzik can no longer enumerate a Drive by itself.

## What changes for the user

| | `drive.readonly` (today) | `drive.file` (after) |
|---|---|---|
| First connect | App lists every audio file in Drive automatically | User picks folders/files once through the Google Picker |
| Adding new music | Appears on next scan | User re-opens the picker to grant the new items |
| Access granted | Everything in the Drive, read-only | Only what was picked |
| Verification burden | Full review + CASA Tier 2, annually | None |

Files granted via `drive.file` stay granted, so this is a one-time cost per
folder rather than per session — but a user who drops a new album into an
already-granted folder will *not* see it until they re-pick. That is the
sharpest edge of the migration and worth surfacing in the app's connect screen.

## Code to change

### Desktop — `hypemuzik-desktop/src-tauri/src/cloud.rs`

1. `DRIVE_SCOPE` (line 27) → `https://www.googleapis.com/auth/drive.file`.
2. The listing calls that walk the Drive by query must be replaced. With
   `drive.file`, `files.list` returns only granted files, so the current
   "find every audio file" query silently returns an empty list rather than
   erroring — a failure mode that will look like a broken connection, not a
   scope problem. Add an explicit empty-state that says *"pick a folder to get
   started"* rather than *"no music found"*.
3. Add a picker entry point. The Google Picker API is JavaScript-only, so the
   desktop needs it in a webview window that posts the selected file ids back
   to Rust, then persists those ids locally as the user's granted set.

### Mobile — `hype/lib/services/cloud_auth_service.dart`

1. `_driveScope` (line 13) → `drive.file`.
2. Same listing consequence as above.
3. Android/iOS have no native Google Picker; the usual route is a WebView
   hosting the Picker JS, or `google_sign_in` plus a small hosted picker page.

### Site — `hypemuzik-site/src/lib/legal.ts`

One line. Change the import site to use `GOOGLE_DRIVE_SCOPE_FILE` instead of
`GOOGLE_DRIVE_SCOPE`; the privacy policy and the homepage `#data` block both
read from that constant and update themselves.

## Sequencing

The privacy policy must describe what the consent screen actually requests at
the moment Google reviews it. So the order is:

1. Ship the app change (both platforms) with `drive.file`.
2. Flip the constant in `legal.ts`, redeploy the site.
3. Update the scope list on the OAuth consent screen.
4. Submit for verification — which, with only non-sensitive scopes, should
   need no CASA assessment.

Doing step 2 before step 1 publishes a policy that does not match the shipped
apps, which is exactly the mismatch verification looks for.
