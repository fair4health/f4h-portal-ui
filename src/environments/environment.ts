// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  restApiUrl: 'http://localhost:3000/',
  restApiPPDDM: 'https://f4h.srdc.com.tr/',
  keycloak: {
    // Url of the Identity Provider
    issuer: 'https://keycloak.ari-health.eu/auth',
    // URL of the SPA to redirect the user to after login
    // redirectUri: 'http://localhost:4200/uclist',
    redirectUri: 'https://portal.fair4health.eu/uclist',
    // Realm details
    realm: 'FAIR4Health',
    clientId: 'fair4health-portal-client',
    clientSecret: '4b55ca43-ae70-4064-a577-41db6b9e584d'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
