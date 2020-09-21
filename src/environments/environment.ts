// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
