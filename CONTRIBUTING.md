# Updating the documentation

After changing `assets/site.css`, `assets/content.js`, or `assets/site.js`, refresh the asset versions before committing:

```sh
node scripts/version-assets.mjs
```

Commit the resulting HTML changes with the asset changes.
