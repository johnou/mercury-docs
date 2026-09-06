# Updating the documentation

After changing `assets/site.css`, `assets/content.js`, or `assets/site.js`, refresh the asset versions before committing:

```sh
node scripts/version-assets.mjs
```

Commit the resulting HTML changes with the asset changes.

Check local links, duplicate IDs, and asset versions:

```sh
node scripts/check-docs.mjs
```

Before publishing the Cloud policy pages, confirm that NWGG Pty Ltd is the operator named in the Marketplace listing and add a private security and privacy contact. Do not direct sensitive reports to a public GitHub issue.
