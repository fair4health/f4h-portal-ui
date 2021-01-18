// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
//  restApiUrl: 'http://localhost:3000/'
  restApiUrl: 'https://f4h-portal.ari-health.eu/',
  restApiPPDDM: 'https://f4h.srdc.com.tr/',
  // loginOAUth: 'https://testbed.fair4health.eu/oauth/login'
  // loginOAUth: 'http://localhost:8081/login'
  // loginOAUth: 'https://testbed.fair4health.eu/oauth/login/',
  // loginOAUth: 'http://localhost:8081/login/'
  loginOAUth: 'http://localhost:3000/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
