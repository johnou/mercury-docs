# Mercury Cloud

Mercury Cloud runs JavaScript after Jira Cloud workflow transitions. The development build also has an administrator workbench for console runs, saved scripts, history, listeners, and scheduled jobs.

Mercury uses Atlassian Forge and a backend QuickJS runtime. Guest scripts receive Jira data and named helpers. They do not receive Forge credentials, Node.js globals, arbitrary network access, or filesystem access.

## Availability

Workflow post-functions and backend validation and simulation are implemented. The workbench and all eight Jira helpers are implemented as a development preview. Live verification continues on the private Mercury demo site.

Live console saving, execution, and a label update are verified. Workflow configuration storage is also verified. Template-literal execution is undergoing its final check, and index and history verification continues.

Mercury Cloud is not available for public installation. It does not claim full ScriptRunner feature parity.

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

Write JavaScript template literals normally. Mercury preserves expressions such as `${status}` when it stores workflow configuration; no special escaping is required.

## Use the console

The console offers two execution paths:

1. Select **Simulate** to run against the DEMO-1 sample. Simulation records proposed writes and never changes Jira.
   Sample search accepts only `project = DEMO` or `key = DEMO-n`. The sample transitions are `11` To Do, `31` In Progress, and `41` Done.
2. Enter one issue key and select **Review live run** to prepare a live run.
3. Review the exact source and issue key.
4. Select **Run live** within five minutes.

The live confirmation token works once. Mercury consumes the token and creates the running history record in one atomic operation. Live console runs execute with the Mercury app identity. The backend checks that the current user is a Jira administrator before it creates the token or runs the script.

## Save scripts and revisions

Select **Save revision** to create an immutable source revision. Loading a saved script copies its source into the console editor. Saving the edited source creates another immutable revision.

Listeners and scheduled jobs pin one revision ID. A later script save does not change existing automation. Archiving a script prevents an automation from being newly enabled against it. Archive does not disable an automation that already uses one of its revisions.

## Read run history

The **History** view retains records for 30 days. Each record includes the origin, issue key, start time, duration, Jira call count, logs, and any failure code.

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
