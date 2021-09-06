# f4h-portal-ui

[![Build Status](https://app.travis-ci.com/fair4health/f4h-portal-ui.svg?branch=master)](https://app.travis-ci.com/fair4health/f4h-portal-ui)
[![codecov.io](https://codecov.io/gh/fair4health/f4h-portal-ui/branch/master/graphs/badge.svg)](http://codecov.io/gh/fair4health/f4h-portal-ui)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=eu.fair4health:f4h-portal-ui&metric=alert_status)](https://sonarcloud.io/dashboard/index/eu.fair4health:f4h-portal-ui)
[![Docker Build](https://img.shields.io/docker/cloud/build/fair4health/f4h-portal-ui)](https://cloud.docker.com/u/ccavero/repository/docker/fair4health/f4h-portal-ui)
[![Docker Pulls](https://img.shields.io/docker/pulls/fair4health/f4h-portal-ui)](https://cloud.docker.com/u/ccavero/repository/docker/fair4health/f4h-portal-ui)
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)](https://opensource.org/licenses/Apache-2.0)

# Description

Web user interface for the project [FAIR4Health](https://www.fair4health.eu/).

## Command line options

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.0.

Versions and dependencies can be listed using `ng --version`:

```
Angular CLI: 10.0.0
Node: 12.13.1
OS: win32 x64

Angular: 10.0.1
... animations, cdk, common, compiler, compiler-cli, core, forms
... material, platform-browser, platform-browser-dynamic, router
Ivy Workspace: Yes

Package                           Version
-----------------------------------------------------------
@angular-devkit/architect         0.1000.0
@angular-devkit/build-angular     0.1000.0
@angular-devkit/build-optimizer   0.1000.0
@angular-devkit/build-webpack     0.1000.0
@angular-devkit/core              10.0.0
@angular-devkit/schematics        10.0.0
@angular/cli                      10.0.0
@ngtools/webpack                  10.0.0
@schematics/angular               10.0.0
@schematics/update                0.1000.0
rxjs                              6.5.5
typescript                        3.9.5
webpack                           4.43.0

```

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### Development mock server

For developmente purposes, a set of json data is loaded in [json-server](https://github.com/typicode/json-server), in `/mocks/data.json`. To launch both the mock server and the web application:

- First time, 
  - install json-server: `npm install json-server --save-dev`
  - install concurrently: `npm install concurrently --save-dev`
- Run `npm run start:mock:server`

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## License

Apache 2.0

By downloading this software, the downloader agrees with the specified terms and conditions of the License Agreement and the particularities of the license provided.
