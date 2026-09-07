# Mercury Cloud

Mercury Cloud runs JavaScript after Jira Cloud workflow transitions. Its administrator workbench provides console runs, saved scripts, history, listeners, and scheduled jobs.

Mercury uses Atlassian Forge and a backend QuickJS runtime. Guest scripts receive Jira data and named helpers. They do not receive Forge credentials, Node.js globals, arbitrary network access, or filesystem access.

## Jira helpers

Workflow and workbench scripts can call:

- `jira.getIssue(key)`
- `jira.updateIssue(key, { fields })`
- `jira.searchIssues(jql, options?)`
- `jira.createIssue({ fields })`
- `jira.addComment(key, adfDocument)`
- `jira.getTransitions(key)`
- `jira.transitionIssue(key, { transition, fields? })`
- `jira.linkIssues({ type, inwardIssue, outwardIssue })`

Await every helper call. A script can make no more than ten Jira calls. Workbench scripts can use up to 24 KiB. A workflow configuration has a 32 KiB limit, so workflow source must stay slightly below 24 KiB. Jira writes that finish before a later failure cannot be rolled back.

Write JavaScript template literals normally. Mercury preserves expressions such as `${status}` without special escaping.

## Use the console

The console offers two execution paths:

1. Select **Simulate** to run against the DEMO-1 sample. Simulation records proposed writes and never changes Jira.
   Sample search accepts only `project = DEMO` or `key = DEMO-n`. The sample transitions are `11` To Do, `31` In Progress, and `41` Done.
2. Enter one issue key and select **Review live run** to prepare a live run.
3. Review the exact source and issue key.
4. Select **Run live** within five minutes.

The live confirmation token works once. Mercury consumes the token and creates the running history record in one atomic operation. Live console runs execute with the Mercury app identity. The backend checks that the current user is a Jira administrator before it creates the token or runs the script.

Sample simulation is subject to the same installation usage limits as other admitted runs.

## Dry-run a real issue

A Jira administrator can select **Dry-run real issue** to run source against one real issue. Mercury reads current Jira data with the app identity. Read helpers call Jira. Write helpers validate their arguments and append to `proposedWrites` without sending a write request.

A dry run can show how the script behaves with current issue data. Synthetic issues created during the run use collision-safe `dry-run:N` keys, and transitions for synthetic issues are unsupported. Proposed writes can total up to 256 KiB.

A dry run does not prove that Jira permissions, workflow conditions, or field rules would accept the proposed writes in a live run. The immediate result includes proposed writes and console values, but retained history contains outcome metadata rather than guest logs, Jira response values, or proposed-write payloads.

## Save scripts and revisions

Select **Save revision** to create an immutable source revision. Loading a saved script copies its source into the console editor. Saving the edited source creates another immutable revision.

Listeners and scheduled jobs pin one revision ID. A later script save does not change existing automation. Archiving a script prevents an automation from being newly enabled against it. Archive does not disable an automation that already uses one of its revisions.

## Read run history

The **History** view retains operational records for 30 days. Open **History**, then select **Refresh** to load runs completed since the page opened. Each record includes the origin, issue key, start time, duration, Jira call count, and any fixed failure code. Guest console values and arbitrary error text are returned to an interactive caller when available but are not stored in history.

A record can remain `running` if the Forge invocation crashes after Mercury writes the initial history entry. In that case, the Jira outcome is uncertain. Mercury does not retry the run automatically.

If the script finishes but the final history write fails, Mercury returns the actual script result and logs with a `finalization-failed` warning. It does not rerun the script to repair history.

## Create a listener

A listener runs a saved revision when Jira creates or updates an issue in one required project:

1. Open **Listeners**.
2. Choose **Issue created** or **Issue updated**.
3. Enter the project key and select a saved revision.
4. Save the listener. New listeners start disabled.
5. Review the settings, then enable the listener.

Mercury skips events marked `selfGenerated` and events with a Mercury trace value. This stops direct automation loops.

Created events use the Jira issue ID as their stable identity. Updated events require both the issue ID and a changelog ID. Mercury skips an updated event when the changelog identity is missing. It also drops an event whose timestamp is more than 24 hours from receipt.

Mercury keeps event claims for 30 days to suppress duplicates, including claims for runs that later fail. A claim uses the automation ID and stable event identity. Editing, disabling, or re-enabling the listener does not run the same claimed event again. This does not make Jira writes exactly once.

## Create a scheduled job

A scheduled job runs a saved revision against one issue:

1. Open **Scheduled jobs**.
2. Enter one issue key and select a saved revision.
3. Choose **Every hour**, **Every day**, or **Every week**.
4. Save the job. New jobs start disabled.
5. Review the settings, then enable the job.

One coarse hourly Forge trigger checks all enabled jobs. Intervals use 1, 24, or 168-hour UTC epoch buckets. The first trigger after enablement can run a job. If Forge misses intervals, Mercury coalesces them into the current bucket instead of replaying every missed run.

The claim uses the automation ID and bucket identity. Editing, disabling, or re-enabling a job does not run the same claimed bucket again.

## Control usage and pause execution

Mercury admits at most 100 runs per installation in one UTC hour and 10,000 runs in one UTC month. A Jira administrator can lower either limit. The server caps cannot be raised.

An admitted run counts even when it later fails. Sample simulations also count. Duplicate or rejected runs do not count. These counters limit app executions. They are not a spending meter or billing ledger, and Forge can still charge platform overhead for invocations and admission checks.

Emergency pause blocks new workflow, console, dry-run, listener, and scheduled admissions. It does not cancel a run that already started. A scheduled job rejected while paused or over limit is not replayed automatically.

## Read automation health

**Usage & health** shows the latest bounded success or failure for workflows and each automation. It also reports failures that happen before normal run history starts. Health records expire after 365 days. Health storage is best effort and never retries a script. Mercury records the Atlassian account ID of the administrator who last changed usage limits or pause state.

## Back up configuration

**Backup** can export configuration while automations are enabled, but every automation in the emitted bundle is disabled. The bundle includes each script's current source, its personal-data declarations, including author account IDs, an archived current source, and older source snapshots required by pinned automations. It can contain at most 10 source snapshots, 25 automation definitions, and 256 KiB of UTF-8 JSON. It excludes history, delivery claims, confirmations, usage, health, pause state, license state, and installation identifiers.

Restore validates the complete bundle before writing. It creates each source snapshot as a new standalone script with a new local ID rather than recreating a script's complete revision chain. Imported automations also receive new IDs and remain disabled. Repeating the same bundle import is idempotent while the app is installed; reusing its bundle ID with changed content is rejected. Review imported source and settings before enabling an automation.

## Manage personal data

Open **Privacy** to review declared subjects, reporting state, pending erasure, and legacy source that still needs review. Privacy controls remain available when the app does not have an active license.

Mercury records the author of retained source and configuration automatically. When you save source, prepare a console run, save an automation, change an authored control reason, or import configuration, declare up to 20 Atlassian account IDs for other people whose personal data appears in the authored content. An empty declaration means you reviewed that content and assert that it contains no other person's personal data. Mercury does not infer every person represented in free-form text.

Mercury checks hourly for privacy work that is due. Personal-data reporting uses a seven-day default cycle. After reporting, Mercury keeps a keyed pseudonymous receipt until that subject's next report is allowed, then removes it. The receipt does not store the raw account ID.

When Atlassian reports an account as closed or updated, Mercury queues removal of declared content. Erasing one subject deletes each associated script or revision and any dependent automation, which can affect other administrators. An administrator's manual erasure removes the data Mercury currently holds for that subject; a later explicit author action can declare and store fresh data for the account. Only a closed response from Atlassian's Privacy API creates a keyed pseudonymous barrier that blocks recollection while the app is installed. The barrier is pseudonymous data, not anonymous data. The **Privacy** view also provides typed confirmations for one-subject erasure, installation-wide purge, legacy review, and a maintenance run.

Installation-wide purge removes tracked content and leaves execution paused. It preserves keyed closed-account barriers so that purged closed accounts cannot be collected again. It does not remove copies from old Jira workflow configurations, exported files, or Forge platform logs.

Legacy source is marked unreviewed because Mercury cannot invent subjects for existing free-form content. Review every script and its complete revision history, then declare the represented account IDs or confirm that none are present. Backup contains current and pinned source but can omit older unpinned revisions, so it is not a complete legacy inspection path.

Schema 1 and 2 workflow configurations embed source in Jira outside Mercury's KVS erasure path. The runtime rejects those old rules. Reopen and save each rule to migrate it to a schema 3 revision reference, or remove it. Public rollout requires verification that no old embedded configuration remains.

Mercury stops writing guest logs and arbitrary errors to persistent history and Forge logs. Older Forge platform logs remain subject to Atlassian's retention and cannot be purged programmatically by Mercury. KVS erasure also cannot remove copies from old Jira workflow configurations or exported bundle files; those copies require the separate steps above.

Exports contain source and declarations and can create copies outside Mercury. Store and delete those copies according to your organization's policy. See [Mercury Cloud privacy](cloud-privacy.html) and [data retention](data-retention.html).

## Automation limits and failure behavior

Each installation can store 25 listener and scheduled-job definitions. Five definitions can be enabled at once.

Mercury does not retry failed automation runs. A script can leave partial Jira writes when one helper succeeds and a later helper fails. The 30-day claim blocks a known duplicate dispatch, but Mercury does not promise exactly-once effects.

## Moving from Server

Mercury Server scripts run inside Jira's JVM and can use Jira Java classes and server files. Mercury Cloud scripts use JavaScript and checked Jira helpers. Port the intent of each script and test the result on a Jira development site.

For example, a Server script that calls `issue.setFixVersions(...)` must submit a Jira Cloud issue update with the required version IDs.

Cloud post-functions run after the transition. Do not assume that separate post-functions execute in a particular order. A failed script cannot roll back a Jira update that already succeeded.

## Development site

Atlassian provides a [free Cloud developer site](https://go.atlassian.com/cloud-dev) for app development and testing. See the [Forge setup guide](https://developer.atlassian.com/platform/forge/getting-started/).

## Legacy availability

The [Mercury Server documentation](legacy.html) contains the original guide, privacy policy, terms, and EULA. The text remains unchanged.

## Policies and support

- [Mercury Cloud privacy](cloud-privacy.html)
- [Data retention](data-retention.html)
- [Mercury Cloud terms](cloud-terms.html)
- [Support](support.html)
- Private support, security, and privacy: [plugin-support@johno.it](mailto:plugin-support@johno.it)
