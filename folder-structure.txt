src/
├── api/                    # API related code
│   ├── axios.ts           # Axios instance & interceptors
│   ├── endpoints.ts       # API endpoint constants
│   └── services/          # API service modules
│       ├── auth.service.ts
│       └── user.service.ts
├── assets/                # Static assets
│   ├── images/
│   └── icons/
├── components/            # Reusable components
│   ├── common/           # Truly reusable components
│   ├── forms/            # Form-specific components
│   ├── layouts/          # Layout components
│   └── ui/               # UI components (already exists)
├── config/               # Configuration files
│   ├── constants.ts
│   └── environment.ts
├── features/             # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── users/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
├── hooks/               # Global custom hooks
├── lib/                # Third-party library configurations
├── models/             # Data models/schemas
├── routes/             # Route definitions
├── services/           # Business logic services
├── store/             # State management
│   ├── slices/
│   └── store.ts
├── styles/            # Global styles
├── types/             # TypeScript types/interfaces
└── utils/             # Utility functions
├── layouts/
│   ├── root/
│   │   ├── components/
│   │   │   ├── Header/                 # Group header-related components
│   │   │   │   ├── SiteHeader.tsx      # Main header component
│   │   │   │   ├── SearchForm.tsx      # Search form component
│   │   │   │   └── Breadcrumbs/        # Breadcrumb components
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── BreadcrumbItem.tsx
│   │   │   │   │   └── BreadcrumbList.tsx
│   │   │   └── Navigation/             # Navigation components
│   │   │       ├── NavMain.tsx
│   │   │       ├── NavSecondary.tsx
│   │   │       └── NavUser.tsx
│   │   └── RootLayout.tsx
│   └── dashboard/
│       ├── components/          # Dashboard layout specific components
│       │   ├── SidebarItem.tsx
│       │   └── SidebarSection.tsx
│       ├── DashboardLayout.tsx
│       └── DashboardSidebar.tsx 