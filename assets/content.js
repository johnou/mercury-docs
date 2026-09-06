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
    }
  ],
  features: [
    { name: 'Workflow JavaScript', status: 'available', detail: 'Run isolated JavaScript after Jira Cloud transitions.' },
    { name: 'Backend validation and simulation', status: 'available', detail: 'Validate and simulate in Forge without browser eval or WebAssembly.' },
    { name: 'Script console', status: 'planned', detail: 'Run focused scripts against an explicit Jira context.' },
    { name: 'Saved script library', status: 'planned', detail: 'Reuse named, versioned scripts across automation.' },
    { name: 'Run history', status: 'planned', detail: 'Inspect outcomes, timing, bounded logs, and the script revision that ran.' },
    { name: 'Richer Jira helpers', status: 'planned', detail: 'Add task-oriented helpers after their final contracts are selected.' },
    { name: 'Event listeners', status: 'planned', detail: 'Run scripts for selected Jira events with loop and retry controls.' },
    { name: 'Scheduled jobs', status: 'planned', detail: 'Run versioned scripts on bounded schedules with duplicate protection.' }
  ],
  search: [
    { title: 'Write your first script', section: 'Get started', href: '#start', text: 'workflow transition add post function validate simulate JavaScript' },
    { title: 'Runtime isolation', section: 'Runtime model', href: '#how-it-runs', text: 'QuickJS Forge backend CSP memory time quota fetch require process' },
    { title: 'jira.getIssue', section: 'API', href: '#reference', text: 'read get issue key fields helper' },
    { title: 'jira.updateIssue', section: 'API', href: '#reference', text: 'write update issue fields helper' },
    { title: 'Feature availability', section: 'Roadmap', href: '#roadmap', text: 'console saved scripts library history helpers listeners scheduled jobs planned testing available' },
    { title: 'Move from Server', section: 'Migration', href: '#migration', text: 'Groovy JavaScript JVM Cloud port migrate fix versions' },
    { title: 'Legacy documentation', section: 'Legacy', href: './legacy.html', text: 'Server privacy terms EULA installation Groovy' }
  ]
});
