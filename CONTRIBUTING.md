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

NWGG Pty Ltd is the confirmed Marketplace operator. Keep private security and privacy reports directed to `plugin-support@johno.it`, not a public GitHub issue.
