export const CATEGORIES = [
  { id: 'cat_technical', name: 'Technical Support', color: 'indigo', description: 'Bugs, errors, SDKs, performance issues, and uptime' },
  { id: 'cat_billing', name: 'Billing & Invoicing', color: 'emerald', description: 'Invoices, seat licenses, payment methods, and refunds' },
  { id: 'cat_security', name: 'Account & Security', color: 'purple', description: 'SSO SAML, SCIM, MFA, RBAC permissions, and SOC2 audits' },
  { id: 'cat_integrations', name: 'Integrations & API', color: 'blue', description: 'Webhooks, REST APIs, rate limits, OAuth, and webhooks' },
  { id: 'cat_feature', name: 'Feature Request', color: 'amber', description: 'Customer product feedback, enhancements, and roadmap items' },
  { id: 'cat_data', name: 'Data & Privacy', color: 'rose', description: 'GDPR erasure, data export dumps, backups, and retention' },
];

export const STATUSES = [
  { id: 'open', label: 'Open', color: 'blue', description: 'Newly submitted, awaiting agent pickup' },
  { id: 'in_progress', label: 'In Progress', color: 'indigo', description: 'Agent actively investigating' },
  { id: 'pending', label: 'Pending Customer', color: 'amber', description: 'Waiting for response from customer' },
  { id: 'resolved', label: 'Resolved', color: 'emerald', description: 'Issue solved and confirmed' },
  { id: 'closed', label: 'Closed', color: 'slate', description: 'Archived resolution' },
];

export const PRIORITIES = [
  {
    id: 'urgent',
    label: 'Urgent',
    color: 'rose',
    dotColor: 'bg-rose-500',
    slaFirstResponseHours: 1,
    slaResolutionHours: 4,
    description: 'Production outage, critical security vulnerability, or complete block for enterprise users'
  },
  {
    id: 'high',
    label: 'High',
    color: 'orange',
    dotColor: 'bg-orange-500',
    slaFirstResponseHours: 2,
    slaResolutionHours: 8,
    description: 'Major feature broken, severely impacted workflow with no clear workaround'
  },
  {
    id: 'medium',
    label: 'Medium',
    color: 'amber',
    dotColor: 'bg-amber-500',
    slaFirstResponseHours: 6,
    slaResolutionHours: 24,
    description: 'Moderate impact, secondary functionality affected with existing workaround'
  },
  {
    id: 'low',
    label: 'Low',
    color: 'slate',
    dotColor: 'bg-slate-400',
    slaFirstResponseHours: 12,
    slaResolutionHours: 48,
    description: 'Minor glitch, cosmetic styling issue, general question, or low-priority inquiry'
  },
];

export const CANNED_RESPONSES = [
  {
    id: 'macro_saml_troubleshoot',
    title: 'SSO / SAML Okta Metadata Verification',
    category: 'Security',
    snippet: 'Hi there, thank you for providing the SAML trace! To resolve the "Invalid Audience URI" mismatch:\n\n1. Ensure your IdP Entity ID in Okta matches `https://auth.resolvehq.io/saml/v2/sp` exactly.\n2. Verify the Assertion Consumer Service (ACS) URL is set to `https://auth.resolvehq.io/saml/v2/acs`.\n3. Make sure the NameID format is set to `urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress`.\n\nPlease test this in your Okta admin portal and let us know if you see any continued certificate errors.',
  },
  {
    id: 'macro_billing_reconcile',
    title: 'Invoice & Seat License Reconciliation',
    category: 'Billing',
    snippet: 'Hello, thanks for reaching out regarding your recent billing invoice.\n\nI have reviewed your account telemetry for the billing cycle ending October 2026. The prorated delta reflects the 15 additional seats provisioned mid-cycle under your Enterprise agreement. I have credited the $450 duplicate processing charge back to your primary card on file (ending in 4821), which should reflect within 2-3 business days.\n\nAttached is your updated credit note and revised consolidated statement for your finance records.',
  },
  {
    id: 'macro_api_ratelimit',
    title: 'API Rate Limit (429) & Exponential Backoff',
    category: 'API',
    snippet: 'Hi! Looking at your API logs, your workers are currently bursting past the 2,500 requests/minute tier during your 02:00 UTC database sync.\n\nWe recommend implementing exponential backoff with jitter on HTTP 429 responses, or utilizing our bulk ingest endpoint `/v1/events/batch` which accepts up to 1,000 events in a single payload. As an Enterprise customer, I have also bumped your hourly burst ceiling to 6,000 req/min for the next 72 hours while you deploy the batch adapter.',
  },
  {
    id: 'macro_bug_escalation',
    title: 'Escalated to Core Engineering (Internal Issue Logged)',
    category: 'Technical',
    snippet: 'Thank you for the detailed reproduction steps and HAR trace! I was able to reproduce this regression in our staging environment.\n\nI have filed high-priority ticket ENG-4891 with our Core Platform team. Engineering is actively working on a hotfix which is scheduled to roll out in canary within the next 4 hours. I will keep this ticket in "In Progress" and update you the moment the fix is deployed to production.',
  },
  {
    id: 'macro_resolution_confirm',
    title: 'Resolution & CSAT Feedback Request',
    category: 'General',
    snippet: 'Hi, we are checking in to confirm that the changes we implemented have successfully resolved your issue. All metrics look green on our monitoring dashboards.\n\nI will go ahead and mark this ticket as Resolved. If you notice any other anomalies or have further questions, simply reply to this thread and the ticket will automatically reopen. We appreciate your partnership with ResolveHQ!',
  },
];
