export const environment = {
  production: true,
  hmr: false,

  auth: {
    url: 'https://api.realplazalabs.com/v1/identity',
    client_id: 'realplaza.softwareintegrador',
    client_secret: '3CD98E07-77EF-49ED-8870-7401B6A5585A',
    scope: 'ms-rp-budgets ms-rp-filestorage ms-rp-workflowmanager ms-rp-nps offline_access',
    grand_type: 'password',
  },

  api: {
    budgets: 'http://localhost:8083',
    storage: 'https://api.realplazalabs.com/v1/storage/uploadFile',
  },
}
