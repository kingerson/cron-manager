export const data: any[] = [
  {
    title: 'Settings',
    key: 'settings',
    icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
  },
  {
    divider: true,
  },
  {
    title: 'Dashboard',
    key: 'dashboard',
    url: '/dashboard',
    icon: 'icmn icmn-home',
  },
  {
    divider: true,
  },
  {
    title: 'Presupuestos',
    key: 'budgetModule',
    icon: 'icmn icmn-file-text2',
    children: [
      {
        title: 'Partidas',
        key: 'budgetItemsView',
        url: '/budgets/items',
      },
      {
        title: 'Documentos',
        key: 'budgetDocumentsView',
        url: '/budgets/documents',
      },
      {
        title: 'Matenimiento',
        key: 'manageBudgetsView',
        children: [
          {
            title: 'Presupuestos',
            key: 'manageBudgetItemsView',
            url: '/budgets/manage/budgets',
          },
        ],
      },
      {
        title: 'Configuración',
        key: 'configurationBudgetsView',
        url: '/budgets/configuration',
      },
    ],
  },
  {
    title: 'Hechos',
    key: 'dashboard',
    url: '/dashboard',
    icon: 'icmn icmn-clipboard',
  },
  {
    title: 'Gestión de Procesos',
    key: 'workflowModule',
    icon: 'icmn icmn-tree',
    children: [
      {
        title: 'Procesos',
        key: 'workflowInstances',
        url: '/workflow/process',
      },
      {
        title: 'Mantenimiento',
        key: 'workflowView',
        children: [
          {
            title: 'Plantillas',
            key: 'workflowManagementTemplate',
            url: '/workflow/management/templates',
          },
          {
            title: 'Grupo de Usuarios',
            key: 'workflowManagementUserGroups',
            url: '/workflow/management/user-groups',
          },
        ],
      },
      {
        title: 'Configuración',
        key: 'workflowConfiguration',
        url: '/workflow/configuration',
      },
    ],
  },
  {
    title: 'NPS',
    key: 'npsModule',
    icon: 'icmn icmn-smile',
    children: [
      {
        title: 'Asignaciones',
        key: 'npsAssignments',
        url: '/nps/assignments',
      },
      {
        title: 'Mantenimiento',
        key: 'npsManagement',
        children: [
          {
            title: 'Puntos de Contacto',
            key: 'npsManagementContactPoint',
            url: '/nps/management/contact-points',
          },
          {
            title: 'Perspectivas',
            key: 'npsManagementPerspective',
            url: '/nps/management/perspectives',
          },
          {
            title: 'Ubicaciones',
            key: 'npsManagementLocation',
            url: '/nps/management/locations',
          },
          {
            title: 'Motivos',
            key: 'npsManagementReason',
            url: '/nps/management/reasons',
          },
        ],
      },
      {
        title: 'Configuración',
        key: 'npsConfiguration',
        url: '/nps/configuration',
      },
    ],
  },
]
