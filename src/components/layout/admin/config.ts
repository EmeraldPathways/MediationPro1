// Admin navigation configuration
import paths from '@/routes/paths';
import { 
  LayoutDashboard, 
  Users,
  ShieldCheck,
  Mail,
  LineChart, 
  Smartphone, 
  Settings,
  Files,
  FolderOpen,
  Database,
  FileText,
  BookOpen,
  PenTool,
  Palette,
  ToggleLeft,
  ClipboardList,
  AlertTriangle,
  Activity,
  CreditCard,
  Receipt,
  Tag,
  CircleDollarSign,
  Brain
} from 'lucide-react';

// Define the type for navigation items
export interface NavItemProps {
  title: string;
  path: string;
  icon: React.ElementType;
  children?: NavItemProps[];
}

export interface NavSectionProps {
  subheader: string;
  items: NavItemProps[];
}

// Export navigation configuration for admin section
export const navConfig: NavSectionProps[] = [
  // Overview group
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: paths.admin.dashboard,
        icon: LayoutDashboard
      },
    ],
  },

  // User Management group
  {
    subheader: 'User Management',
    items: [
      {
        title: 'Users',
        path: paths.admin.users,
        icon: Users
      },
      {
        title: 'Roles & Permissions',
        path: paths.admin.roles,
        icon: ShieldCheck
      },
      {
        title: 'Invitations',
        path: paths.admin.invitations,
        icon: Mail
      },
    ],
  },

  // Case & Data Management group
  {
    subheader: 'Case & Data',
    items: [
      {
        title: 'All Cases',
        path: paths.admin.allCases,
        icon: FolderOpen
      },
      {
        title: 'Import/Export',
        path: paths.admin.importExport,
        icon: Database
      },
    ],
  },

  // Content Management group
  {
    subheader: 'Content & Configuration',
    items: [
      {
        title: 'Document Templates',
        path: paths.admin.docTemplates,
        icon: FileText
      },
      {
        title: 'Guides Management',
        path: paths.admin.guides,
        icon: BookOpen
      },
      {
        title: 'Email Templates',
        path: paths.admin.emailTemplates,
        icon: PenTool
      },
      {
        title: 'Branding',
        path: paths.admin.branding,
        icon: Palette
      },
      {
        title: 'Feature Flags',
        path: paths.admin.featureFlags,
        icon: ToggleLeft
      },
    ],
  },

  // Monitoring group
  {
    subheader: 'Monitoring & Logs',
    items: [
      {
        title: 'Audit Log',
        path: paths.admin.auditLog,
        icon: ClipboardList
      },
      {
        title: 'Error Log',
        path: paths.admin.errorLog,
        icon: AlertTriangle
      },
      {
        title: 'System Status',
        path: paths.admin.systemStatus,
        icon: Activity
      },
      {
        title: 'Metrics',
        path: paths.admin.metrics,
        icon: LineChart
      },
    ],
  },

  // Billing group
  {
    subheader: 'Billing & Subscriptions',
    items: [
      {
        title: 'Plan Management',
        path: paths.admin.plans,
        icon: Tag
      },
      {
        title: 'Subscriptions',
        path: paths.admin.subscriptions,
        icon: CircleDollarSign
      },
      {
        title: 'Invoices',
        path: paths.admin.invoices,
        icon: Receipt
      },
    ],
  },

  // Integrations & Settings group
  {
    subheader: 'Integrations & Settings',
    items: [
      {
        title: 'OpenAI',
        path: paths.admin.openai,
        icon: Brain
      },
      {
        title: 'Stripe',
        path: paths.admin.stripeSettings,
        icon: CreditCard
      },
      {
        title: 'HubSpot',
        path: paths.admin.hubspot,
        icon: Smartphone
      },
      {
        title: 'Settings',
        path: paths.admin.settings,
        icon: Settings
      },
    ],
  },
];

export default navConfig;