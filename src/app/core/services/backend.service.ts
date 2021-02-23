/**
 * @license
 * Copyright (C) 2020  Atos Spain SA. All rights reserved.
 *
 * Use of this source code is governed by a license style Apache License, Version 2.0 that can be
 * found in the LICENSE file at https://github.com/fair4health/f4h-portal-ui/blob/master/LICENSE
 *
 * The software is provided "AS IS", without any warranty of any kind, express or implied,
 * including but not limited to the warranties of merchantability, fitness for a particular
 * purpose and noninfringement, in no event shall the authors or copyright holders be
 * liable for any claim, damages or other liability, whether in action of contract, tort or
 * otherwise, arising from, out of or in connection with the software or the use or other
 * dealings in the software.
 *
 * See README file for the full disclaimer information and LICENSE file for full license
 * information in the project root.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { throwError } from 'rxjs';

import { environment } from './../../../environments/environment';
import { UseCase } from 'src/app/shared/use-case';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer anytokenfordemopurpose'
    })
  };

  constructor(private httpClient: HttpClient) { }

  public getMessage(): Observable<any> {
    return this.httpClient.get(environment.restApiUrl + 'sample');
  }

  /* FOR DEMO AND TESTING
  public login(username: string, password: string): Observable<any> {
    // const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const data2 = {
      'username': username,
      'password': password
    };

    // Porduction
    // return this.httpClient.post(environment.loginOAUth, data2);
    // Demo purposes
    if ('demo' === username && password === atob('ZGVtbzIwMjA=')) {
      return this.httpClient.get(environment.loginOAUth + 'login');
    }else if ('demoHealthcare' === username && password === atob('ZGVtbzIwMjA=')) {
      return this.httpClient.get(environment.loginOAUth + 'loginHealthcare');
    }
    else {
      return throwError('{"code": 401, "message": "Not authorized"}');
    }
  }*/
  public getUseCaseList(): Observable<any> {
    return this.httpClient.get(environment.restApiPPDDM + 'manager/project', this.httpOptions);
    // return this.httpClient.get(environment.restApiUrl + 'manager/project');
  }

  public getUseCase(id): Observable<any> {
    return this.httpClient.get(environment.restApiPPDDM + 'manager/project/' + id, this.httpOptions);
  }

  saveUseCase(useCase): Observable<any> {
    return this.httpClient.post(environment.restApiPPDDM + 'manager/project', useCase, this.httpOptions);
  }

  public getFeaturesetsList(id): Observable<any> {
    return this.httpClient.get(environment.restApiPPDDM + 'manager/featureset?project_id=' + id, this.httpOptions);
  }

  public postFeatureset(featureSet): Observable<any> {
    return this.httpClient.post(environment.restApiUrl + 'manager/featureset', featureSet);
  }

  public updateFeatureSet(featureSet, id): Observable<any> {
    return this.httpClient.put(environment.restApiPPDDM + 'manager/featureset/' + id, featureSet);
  }

  // get model list from the mockup api
  public getModelsList(): Observable<any> {
    return this.httpClient.get(environment.restApiUrl + 'manager/dm-model/');
  }

  // get model list from SRDC api

  public getModels(projectId: string): any {
    return this.httpClient.get(environment.restApiPPDDM + 'manager/dm-model?project_id=' + projectId, this.httpOptions);
  }

  getModel(modelId): Observable<any> {
    return this.httpClient.get(environment.restApiPPDDM + 'manager/dm-model/' + modelId, this.httpOptions);
  }

  public saveModel(model): Observable<any> {
    return this.httpClient.post(environment.restApiPPDDM + 'manager/dm-model', model, this.httpOptions);
  }

  updateModel(id, model): any {
    return this.httpClient.put(environment.restApiPPDDM + 'manager/dm-model/' + id, model, this.httpOptions);
  }

  public getDataSetsList(id): Observable<any> {
    return this.httpClient.get(environment.restApiPPDDM + 'manager/dataset?project_id=' + id , this.httpOptions);
  }

  public getDataSet(datasetId): Observable<any> {
    return this.httpClient.get(environment.restApiPPDDM + 'manager/dataset/' + datasetId , this.httpOptions);
  }

  // deprecated
  public getFeatureList(): Observable<any> {
    return this.httpClient.get(environment.restApiUrl + 'features');
  }

  public handleError(where: string, error: HttpErrorResponse): void {
    let errorText = 'An error occurred in ' + where;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly
      errorText = errorText + ': ' + error.error.message;
    } else {
      // Unsuccessful response code, clues to what went wrong
      errorText = errorText + `: code ${error.status}, ${error.error}`;
      errorText = errorText.replace(', undefined', ', contact support');
    }
    console.error(errorText);
  }


/**
 * This method saves Data Set, refers to 3.4 - Update Data Set: Updates the data set resource
 * in Platform Repository by changing its execution state to "final"
 */
  updateDataSet(id, dataSet): any {
    return this.httpClient.put(environment.restApiPPDDM + 'manager/dataset/' + id, dataSet, this.httpOptions);
  }

  saveDataSet(id, dataSet): any {
    return this.httpClient.post(environment.restApiPPDDM + 'manager/dataset', dataSet, this.httpOptions);
  }

  saveFeatureSet(featureSet): any {
    return this.httpClient.post(environment.restApiPPDDM + 'manager/featureset', featureSet, this.httpOptions);
  }

  // prospective study service methods

  predict(prediction): Observable<any> {
    return this.httpClient.post(environment.restApiPPDDM + 'manager/predict', prediction, this.httpOptions);
  }

  getProspectiveStudies(id): Observable<any> {
    return this.httpClient.get(environment.restApiPPDDM + 'manager/prospective?project_id=' + id, this.httpOptions);
  }

  getProspectiveStudy(id): Observable<any> {
    return this.httpClient.get(environment.restApiPPDDM + 'manager/prospective/' + id, this.httpOptions);
  }

  onSaveprospectiveStudy(pospectiveStudy): Observable<any> {
    return this.httpClient.post(environment.restApiPPDDM + 'manager/prospective', pospectiveStudy, this.httpOptions);
  }

  updateProspectiveStudy(pospectiveStudy, id): Observable<any> {
    return this.httpClient.put(environment.restApiPPDDM + 'manager/prospective/' + id, pospectiveStudy, this.httpOptions);
  }

  getAlgorithms() {
    return this.httpClient.get(environment.restApiPPDDM + 'manager/algorithm', this.httpOptions);
  }
}
