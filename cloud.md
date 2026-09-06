# Mercury Cloud

Mercury Cloud runs JavaScript after Jira Cloud workflow transitions. The current development build uses Atlassian Forge and a backend QuickJS runtime. Guest scripts receive Jira data and named helpers. They do not receive Forge credentials, Node.js globals, arbitrary network access, or filesystem access.

The first implemented helpers are:

- `jira.getIssue(key)`
- `jira.updateIssue(key, { fields })`

Backend validation and simulation run in Forge. The editor uses Forge functions for both operations, so it works with Forge's default browser content security policy.

## Feature availability

Workflow post-functions, backend validation, backend simulation, and the two helpers above are implemented in the current development build. The Cloud app is not available for public installation yet.

The following features are planned. Their names and APIs can change before release:

- A script console
- A saved script library
- Run history
- More task-oriented Jira helpers
- Jira event listeners
- Scheduled jobs

Mercury does not claim full ScriptRunner feature parity.

## Moving from Server

Mercury Server scripts run inside Jira's JVM and can use Jira Java classes and server files. Mercury Cloud scripts use JavaScript and checked Jira helpers. Port the intent of each script and test the result on a Jira development site.

For example, a Server script that calls `issue.setFixVersions(...)` must submit a Jira Cloud issue update with the required version IDs.

Cloud post-functions run after the transition. Do not assume that separate post-functions execute in a particular order. A failed script cannot roll back a Jira update that already succeeded.

## Development site

Atlassian provides a [free Cloud developer site](https://go.atlassian.com/cloud-dev) for app development and testing. See the [Forge setup guide](https://developer.atlassian.com/platform/forge/getting-started/).

## Legacy availability

The [Mercury Server documentation](legacy.html) contains the original guide, privacy policy, terms, and EULA. The text remains unchanged.
