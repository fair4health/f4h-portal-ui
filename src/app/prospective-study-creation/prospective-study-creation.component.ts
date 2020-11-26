
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from '../core/services/backend.service';
import { LocalStorageService } from '../core/services/local-storage.service';
import { UserCommunicationService } from '../core/services/user-communication.service';
import { DmModel } from '../shared/dm-model';
import { ProspectiveStudy } from '../shared/prospectiveStudy';
import { Variable } from '../shared/variable';

@Component({
  selector: 'app-prospective-study-creation',
  templateUrl: './prospective-study-creation.component.html',
  styleUrls: ['./prospective-study-creation.component.css']
})
export class ProspectiveStudyCreationComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,
                private backendService: BackendService,
                private localStorage: LocalStorageService,
                private userCommunication: UserCommunicationService) {
                }

    formGroup1: FormGroup;
    formGroup2: FormGroup;
    formGroup3: FormGroup;

    modelTableColumns: string[] = ['sel', 'name', 'description', 'algorithm', 'data_source', 'created_by', 'creation_time', 'see_details'];
    models: DmModel[];

    projectId = this.localStorage.projectId;
    selectedModel: DmModel;
    predicrionResult: string;
    predcolor = '';
    variablesDataSet = [];
    variables: any;
    variable: any;
    patientsPredictions: any[];
    patientsPredictionsColumns: string[] = [];

    errorUploadingList: boolean;

    x = false;

    prospectiveStudy: ProspectiveStudy;
    

    ngOnInit(): void {

        this.prospectiveStudy = new ProspectiveStudy();
        this.formGroup1 = this.formBuilder.group({
            name: ['',  Validators.required],
            description: ['',  Validators.required],
        });
        this.formGroup2 = this.formBuilder.group({
            formGroup2: ['', Validators.required]
        });
        this.formGroup3 = this.formBuilder.group({
        });

        this.getModels();
    }

    getModels(): void {
        this.backendService.getModels(this.projectId).subscribe(
            (models) => {
                this.models = models;
            }
        );
    }

    onSeeModel(model): void {
        console.log('selected model: ', model);
    }

    onSelectModel(model): void {
        this.selectedModel = model.value;
        this.selectedModel.dataset.featureset.variables.forEach(element => {
            if (element.variable_type === 'independent') {
                this.variablesDataSet.push(element);

                this.formGroup3.addControl(element.name, new FormControl(''));
            }
        });
    }

    onPredict(): void {
        this.variables = {

        };
        this.variables.variables = [];
        this.variables.data_mining_model = this.selectedModel;

        console.log(this.formGroup3)
        Object.keys(this.formGroup3.controls).forEach(key => {

            this.variable = {
                name: '',
                value: '',
                data_type: ''
            };

            this.variable.name = key;
            this.variable.value = this.formGroup3.get(key).value;
            this.variablesDataSet.forEach(el => {
              if (el.name === key) {

                if (el.variable_data_type === 'numeric') {
                  this.variable.value = this.variable.value.toString();
                  this.variable.data_type = 'integer';
                } else {
                  this.variable.data_type = 'string';
                }
              }
            });

            this.variables.variables.push(this.variable);
            this.variables.identifier = '1';
        });

        this.backendService.predict(this.variables).subscribe(data => {
            this.prospectiveStudy.prediction = data;
            this.predicrionResult = data.prediction;
            if (data.prediction === 1) {
              this.predcolor = '#3fc100';
            } else if (data.prediction === 0) {
              this.predcolor = '#f83d17';
            }
        });
    }

    onSave(): void {
      this.prospectiveStudy.data_mining_model = this.selectedModel;

      console.log('prospective study to save: ', this.prospectiveStudy);
    }


    /**
     * TODO:
     * 1- validador de archivo (pasar el array y la posicion [0])
     * 2 - permitir json y excel
     * 3 - Crear DTO para la estructura del archivo o de la variable ¿?
     */
    uploadpatientFile(event): void {

      const files = event.srcElement.files;
      const input = event.target;
      const reader = new FileReader();

      reader.readAsText(input.files[0]);
      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);

      //  this.patientsPredictionsColumns = this.getHeaders(csvRecordsArray);
        const columns = this.getHeaders(csvRecordsArray);
        for (let i = 0; i < this.variablesDataSet.length; i++) {
          if (this.variablesDataSet[i].name === columns[0][i]) {
            this.errorUploadingList = true;
          } else {
            this.errorUploadingList = false;
            break;
          }
        }

        if (this.errorUploadingList) {
          columns[0].push('prediction');
          columns.forEach(element => {
            this.patientsPredictionsColumns.push(element);
          });

          this.patientsPredictions = this.getRecordsFromDocument(csvRecordsArray, columns.length);

          for (let i = 0; i < this.patientsPredictions.length; i++) {
            this.variables = {};
            this.variables.variables = [];
            this.variables.data_mining_model = this.selectedModel;
            const element = this.patientsPredictions[i];

            Object.keys(this.patientsPredictions[i]).forEach(key => {

              const variable = {
                  name: '',
                  value: '',
                  data_type: ''
              };

              variable.name = key;
              variable.value = this.patientsPredictions[i][key];

              this.variablesDataSet.forEach(el => {
                if (el.name === key) {

                  if (el.variable_data_type === 'numeric') {
                    variable.value = variable.value.toString();
                    variable.data_type = 'integer';
                  } else {
                    variable.data_type = 'string';
                  }
                }
              });
              this.variables.variables.push(variable);
            });

            this.variables.identifier = '1';
            this.variables.data_mining_model = this.selectedModel;

            this.backendService.predict(this.variables).subscribe(
              data => {
                this.patientsPredictions[i].prediction = data.prediction;
                if (data.prediction === 1) {
                  this.predcolor = '#3fc100';
                } else if (data.prediction === 0) {
                  this.predcolor = '#f83d17';
                }
              }
            );

          }

        } else if (!this.errorUploadingList) {
          this.userCommunication.createMessage(this.userCommunication.ERROR,
               'The selected file don\'t contains the same variables as the selected model.');
        }
      };

    }

    getRecordsFromDocument(recordsArray: any, headerLength: any): any {

      let object: any = {};
      const data: any[] = [];
      const headers = recordsArray[0].split(';');

      for (let i = 1; i < recordsArray.length - 1; i++) {
        // tslint:disable-next-line: no-angle-bracket-type-assertion
        const curruntRecord = ( <string> recordsArray[i]).split(';');

        headers.forEach(element => {
          object[element] = '';
        });

        Object.keys(object).forEach(key => {
            object[key] = curruntRecord[Object.keys(object).indexOf(key)];
        });
        data.push(object);
        object = {};
      }
      return data;
    }

    fileIsValid(file): any {
      return file.name.endsWith('.csv');
    }

    getHeaders(recordsArray): any {
      const headers = (recordsArray[0] as string).split(',');
      const headerArray = [];
      headers.forEach( element => {
        headerArray.push(element.split(';'));
      });
      return headerArray;
    }

}
