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

## Dry run with a real issue

A Jira administrator can dry run source against one real issue. Mercury reads current Jira data with the app identity. Read helpers call Jira. Write helpers validate their arguments and append to `proposedWrites` without sending a write request.

A dry run can show how the script behaves with current issue data. It does not prove that Jira permissions, workflow conditions, or field rules would accept the proposed writes in a live run.

## Save scripts and revisions

Select **Save revision** to create an immutable source revision. Loading a saved script copies its source into the console editor. Saving the edited source creates another immutable revision.

Listeners and scheduled jobs pin one revision ID. A later script save does not change existing automation. Archiving a script prevents an automation from being newly enabled against it. Archive does not disable an automation that already uses one of its revisions.

## Read run history

The **History** view retains records for 30 days. Open **History**, then select **Refresh** to load runs completed since the page opened. Each record includes the origin, issue key, start time, duration, Jira call count, logs, and any failure code.

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

An admitted run counts even when it later fails. Duplicate or rejected runs do not count. These counters limit app executions. They are not a spending meter or billing ledger, and Forge can still charge platform overhead for invocations and admission checks.

Emergency pause blocks new workflow, console, dry-run, listener, and scheduled admissions. It does not cancel a run that already started. A scheduled job rejected while paused or over limit is not replayed automatically.

## Read automation health

Usage & health shows the latest bounded success or failure for workflows and each automation. It also reports failures that happen before normal run history starts. Health storage is best effort and never retries a script.

## Back up configuration

Backup exports current scripts, source snapshots required by pinned revisions, and up to 25 automation definitions. A bundle can contain at most 10 source entries and 256 KiB of UTF-8 JSON. It excludes history, logs, account IDs, delivery claims, confirmations, usage, health, pause state, license state, and installation identifiers.

Restore validates the complete bundle before writing. It creates new local IDs, keeps every imported automation disabled, and makes repeated import of the same bundle idempotent. Review imported source and settings before enabling an automation.

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
