window.MERCURY_DOCS = Object.freeze({
  helpers: [
    {
      id: 'get-issue',
      name: 'jira.getIssue',
      signature: 'jira.getIssue(key)',
      description: 'Reads one Jira issue by key. The promise resolves to Jira issue JSON.',
      notes: ['The issue key must use Jira key format.', 'The call runs with the Mercury app identity in a workflow.', 'Await every Jira helper call.'],
      example: "const current = await jira.getIssue(issue.key);\nconsole.log(current.fields.summary);"
    },
    {
      id: 'update-issue',
      name: 'jira.updateIssue',
      signature: 'jira.updateIssue(key, { fields })',
      description: 'Updates fields on one Jira issue. The current API accepts only a fields object.',
      notes: ['The issue key must use Jira key format.', 'Mercury rejects extra top-level properties.', 'A completed update cannot be rolled back by a later script error.'],
      example: "await jira.updateIssue(issue.key, {\n  fields: { labels: ['reviewed'] }\n});"
    },
    {
      id: 'search-issues',
      name: 'jira.searchIssues',
      signature: 'jira.searchIssues(jql, options?)',
      description: 'Searches with JQL. Options can set maxResults, nextPageToken, and fields.',
      notes: ['maxResults must be from 1 through 100.', 'Pass the returned nextPageToken to read the next page.', 'Simulation accepts only project = DEMO or key = DEMO-n searches. Live runs accept Jira JQL.'],
      example: "const page = await jira.searchIssues(\n  'project = MERC AND statusCategory != Done',\n  { maxResults: 25, fields: ['summary', 'status'] }\n);"
    },
    {
      id: 'create-issue',
      name: 'jira.createIssue',
      signature: 'jira.createIssue({ fields })',
      description: 'Creates one issue and returns Jira response JSON.',
      notes: ['Supply project, issue type, summary, and any fields Jira requires.', 'Only the fields property is accepted at the top level.', 'A later script failure cannot remove an issue that Jira already created.'],
      example: "const created = await jira.createIssue({\n  fields: {\n    project: { key: 'MERC' },\n    issuetype: { name: 'Task' },\n    summary: 'Review automation result'\n  }\n});"
    },
    {
      id: 'add-comment',
      name: 'jira.addComment',
      signature: 'jira.addComment(key, adfDocument)',
      description: 'Adds an Atlassian Document Format comment and returns Jira response JSON.',
      notes: ['The document must use ADF version 1 and type doc.', 'Plain strings are not accepted.', 'A later script failure cannot remove a comment that Jira already added.'],
      example: "await jira.addComment(issue.key, {\n  version: 1,\n  type: 'doc',\n  content: [{\n    type: 'paragraph',\n    content: [{ type: 'text', text: 'Checked by Mercury.' }]\n  }]\n});"
    },
    {
      id: 'get-transitions',
      name: 'jira.getTransitions',
      signature: 'jira.getTransitions(key)',
      description: 'Returns the transitions currently available for one issue.',
      notes: ['Transition availability depends on the issue and workflow.', 'Simulation provides 11 To Do, 31 In Progress, and 41 Done.', 'Use the returned transition ID with transitionIssue.'],
      example: "const available = await jira.getTransitions(issue.key);\nconsole.log(available.transitions);"
    },
    {
      id: 'transition-issue',
      name: 'jira.transitionIssue',
      signature: 'jira.transitionIssue(key, { transition, fields? })',
      description: 'Moves an issue through a transition by ID. It can set fields in the same Jira request.',
      notes: ['transition.id is required.', 'Simulation accepts 11 To Do, 31 In Progress, and 41 Done.', 'A completed transition cannot be rolled back by a later script error.'],
      example: "await jira.transitionIssue(issue.key, {\n  transition: { id: '21' },\n  fields: { resolution: { name: 'Done' } }\n});"
    },
    {
      id: 'link-issues',
      name: 'jira.linkIssues',
      signature: 'jira.linkIssues({ type, inwardIssue, outwardIssue })',
      description: 'Creates a named link between two Jira issues.',
      notes: ['Use issue keys for both ends.', 'The link type name must already exist in Jira.', 'Direction follows Jira inward and outward issue semantics.'],
      example: "await jira.linkIssues({\n  type: { name: 'Blocks' },\n  inwardIssue: { key: 'MERC-41' },\n  outwardIssue: { key: issue.key }\n});"
    }
  ],
  features: [
    { name: 'Workflow JavaScript', detail: 'Run isolated JavaScript, including template strings, after Jira Cloud transitions.' },
    { name: 'Backend validation and simulation', detail: 'Validate and simulate in Forge without browser eval or WebAssembly.' },
    { name: 'Script console', detail: 'Simulate safely or confirm one live app-identity run against an issue.' },
    { name: 'Saved script library', detail: 'Save indexed immutable revisions, load source, and archive or restore scripts.' },
    { name: 'Run history', detail: 'Inspect console, workflow, listener, and job runs for 30 days; select Refresh for new entries.' },
    { name: 'Eight Jira helpers', detail: 'Read, search, create, update, comment, transition, and link issues.' },
    { name: 'Event listeners', detail: 'Run a pinned revision for issue-created or issue-updated events in one project.' },
    { name: 'Scheduled jobs', detail: 'Run a pinned revision hourly, daily, or weekly against one issue.' },
    { name: 'Dry-run real issue', detail: 'Read current Jira data while Mercury intercepts and returns every proposed write.' },
    { name: 'Usage and pause controls', detail: 'Lower hourly or monthly run limits and pause new admissions without hiding history.' },
    { name: 'Automation health', detail: 'Inspect the latest success or failure, including errors before execution starts.' },
    { name: 'Backup and restore', detail: 'Move current and pinned source snapshots as standalone imported scripts with disabled automations.' },
    { name: 'Personal-data controls', detail: 'Review declared subjects, reporting state, legacy source, and pending erasure without a license gate.' }
  ],
  modes: [
    { id: 'sample', name: 'Sample simulation', reads: 'DEMO sample data', writes: 'Returned only', confirmation: 'Not required', history: 'Metrics retained for 30 days', note: 'Counts toward usage limits. Guest console values are available in the live result and are not retained.' },
    { id: 'dryrun', name: 'Dry-run real issue', reads: 'Current Jira data as app', writes: 'Intercepted and returned', confirmation: 'Jira administrator', history: 'Metrics retained for 30 days', note: 'Guest logs, proposed writes, and Jira response values are excluded from retained history. Jira does not validate or accept those writes.' },
    { id: 'live', name: 'Live console run', reads: 'Current Jira data', writes: 'Sent to Jira', confirmation: 'One use, five minutes', history: 'Retained for 30 days', note: 'Review the exact source and issue key before you confirm.' },
    { id: 'automatic', name: 'Listener or job', reads: 'Current Jira data', writes: 'Sent to Jira', confirmation: 'Enabled definition', history: 'Retained for 30 days', note: 'The pinned revision runs within installation limits. A rejected job is not replayed automatically.' }
  ],
  privacyStages: [
    { id: 'declare', name: 'Declare', title: 'Name the people in authored content', detail: 'Mercury records the author automatically. Add up to 20 Atlassian account IDs for other people whose personal data appears in source, names, settings, or imported content. Empty means you reviewed the content and assert that no other person is represented.' },
    { id: 'report', name: 'Report', title: 'Report retained subjects to Atlassian', detail: 'Hourly maintenance processes work when it is due. A keyed pseudonymous receipt prevents early repeat reporting, contains no raw account ID, and is removed when the next reporting cycle becomes due.' },
    { id: 'erase', name: 'Erase', title: 'Remove declared content and dependants', detail: 'Manual erasure removes current declared data; a later explicit author action can store fresh data. Only an Atlassian API closed response creates the installation-long keyed barrier that prevents recollection.' },
    { id: 'legacy', name: 'Review legacy', title: 'Classify every older source copy', detail: 'Review scripts and all revision history. Old schema 1 and 2 Jira workflow configurations store source outside KVS; reopen and save or remove each rule. Old exports and Forge platform logs need separate handling.' }
  ],
  search: [
    { title: 'Write your first script', section: 'Get started', href: '#start', text: 'workflow transition add post function validate simulate JavaScript' },
    { title: 'Runtime isolation', section: 'Runtime model', href: '#how-it-runs', text: 'QuickJS Forge backend CSP memory time quota fetch require process' },
    { title: 'jira.getIssue', section: 'API', href: '#reference', text: 'read get issue key fields helper' },
    { title: 'jira.updateIssue', section: 'API', href: '#reference', text: 'write update issue fields helper' },
    { title: 'jira.searchIssues', section: 'API', href: '#reference', text: 'JQL search pagination maxResults nextPageToken fields helper' },
    { title: 'jira.createIssue', section: 'API', href: '#reference', text: 'create issue project issue type summary fields helper' },
    { title: 'jira.addComment', section: 'API', href: '#reference', text: 'comment Atlassian Document Format ADF helper' },
    { title: 'jira.getTransitions', section: 'API', href: '#reference', text: 'available issue workflow transitions helper' },
    { title: 'jira.transitionIssue', section: 'API', href: '#reference', text: 'move issue transition ID fields helper' },
    { title: 'jira.linkIssues', section: 'API', href: '#reference', text: 'link inward outward issue key type helper' },
    { title: 'Use the workbench', section: 'How-to', href: '#workbench', text: 'console saved scripts revisions archive live run confirmation history refresh listeners scheduled jobs' },
    { title: 'Safe operations', section: 'Controls', href: '#operations', text: 'real issue dry run usage hourly monthly budget pause health export import disabled configuration' },
    { title: 'Personal-data lifecycle', section: 'Privacy', href: '#privacy-lifecycle', text: 'declare account IDs author report seven day erase legacy review privacy controls' },
    { title: 'Automation limits and delivery', section: 'How-to', href: '#automation-delivery', text: '25 five deduplication self generated trace retry partial writes hourly daily weekly UTC' },
    { title: 'Cloud features', section: 'Features', href: '#roadmap', text: 'console saved scripts library history helpers listeners scheduled jobs available behavior' },
    { title: 'Move from Server', section: 'Migration', href: '#migration', text: 'Groovy JavaScript JVM Cloud port migrate fix versions' },
    { title: 'Legacy documentation', section: 'Legacy', href: './legacy.html', text: 'Server privacy terms EULA installation Groovy' }
  ],
  recipes: [
    { title: 'Search the sample project', helper: 'searchIssues', source: "const page = await jira.searchIssues(\n  'project = DEMO',\n  { maxResults: 25, fields: ['summary', 'status'] }\n);\nconsole.log(page.issues.map(item => item.key));" },
    { title: 'Add an ADF comment', helper: 'addComment', source: "await jira.addComment(issue.key, {\n  version: 1,\n  type: 'doc',\n  content: [{ type: 'paragraph', content: [\n    { type: 'text', text: 'Checked by Mercury.' }\n  ] }]\n});" },
    { title: 'Move to a known transition', helper: 'transitionIssue', source: "const available = await jira.getTransitions(issue.key);\nconst done = available.transitions.find(item => item.name === 'Done');\nif (done) {\n  await jira.transitionIssue(issue.key, { transition: { id: done.id } });\n}" },
    { title: 'Link related work', helper: 'linkIssues', source: "const related = await jira.createIssue({\n  fields: {\n    project: { key: 'DEMO' },\n    issuetype: { name: 'Task' },\n    summary: 'Related sample issue'\n  }\n});\nawait jira.linkIssues({\n  type: { name: 'Relates' },\n  inwardIssue: { key: related.key },\n  outwardIssue: { key: issue.key }\n});" }
  ]
});
