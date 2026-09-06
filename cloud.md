# Mercury Cloud

Mercury Cloud is in development. It replaces the Server product with JavaScript scripts that run after Jira Cloud workflow transitions.

The Cloud design uses Atlassian Forge. The planned workflow editor will store each script with its configuration. Scripts will receive issue data and call authenticated Jira API helpers to read and update issues. A sample-data simulation will let you inspect intended updates before using a script in a workflow.

This is not yet a released Cloud app. Installation instructions will follow live testing on a Jira development site.

## Moving from Server

Server scripts run inside Jira's JVM and can use Jira Java classes and server files. Cloud scripts use JavaScript and Jira REST APIs. Port each script and test its behavior on a development site.

For example, a Server script that calls `issue.setFixVersions(...)` must instead submit a Jira issue update using the appropriate Cloud version IDs.

Cloud post-functions run after the transition. Do not assume that separate post-functions execute in a particular order. A failed script cannot roll back a Jira update that already succeeded.

## Development site

Atlassian provides a [free Cloud developer site](https://go.atlassian.com/cloud-dev) for app development and testing. See the [Forge setup guide](https://developer.atlassian.com/platform/forge/getting-started/).

## Legacy availability

The existing Server documentation, source history, and tags remain in this public documentation repository. Legacy Marketplace downloads remain subject to Atlassian's availability.

The Server privacy and licensing statements in the existing documentation apply to the legacy product. Cloud terms and data-handling documentation must be published before the Cloud app is released.
