// Define all application routes for better organization and maintenance
export const paths = {
  root: '/',
  calendar: '/calendar',
  email: '/email',
  caseFiles: '/case-files',
  tasks: '/tasks',
  contacts: '/contacts',
  billing: '/billing',
  documents: '/documents',
  reports: '/reports',
  settings: '/settings',
  notes: '/notes',
  templates: '/templates',
  storage: '/storage',
  forms: '/forms',
  guides: '/guides',
  
  // Admin section paths
  admin: {
    root: '/admin',
    dashboard: '/admin/dashboard',
    
    // User Management
    users: '/admin/users',
    roles: '/admin/users/roles',
    invitations: '/admin/users/invitations',
    
    // Case/Data Oversight
    allCases: '/admin/cases/all',
    importExport: '/admin/data/import-export',
    
    // Content & Configuration
    docTemplates: '/admin/content/document-templates',
    guides: '/admin/content/guides',
    emailTemplates: '/admin/content/email-templates',
    branding: '/admin/content/branding',
    featureFlags: '/admin/content/feature-flags',
    
    // Monitoring & Logs
    auditLog: '/admin/monitoring/audit-log',
    errorLog: '/admin/monitoring/error-log',
    systemStatus: '/admin/monitoring/system-status',
    
    // Integrations
    metrics: '/admin/metrics',
    hubspot: '/admin/hubspot',
    openai: '/admin/openai',
    stripeSettings: '/admin/billing/stripe-settings',
    
    // Billing & Subscriptions
    plans: '/admin/billing/plans',
    subscriptions: '/admin/billing/subscriptions',
    invoices: '/admin/billing/invoices',

    
    // General Settings
    settings: '/admin/settings',
  },
};

export default paths;