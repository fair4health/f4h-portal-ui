import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BackendService } from '../core/services/backend.service';
import { LocalStorageService } from '../core/services/local-storage.service';
import { UserCommunicationService } from '../core/services/user-communication.service';
import { DmModel } from '../shared/dm-model';
import { ProspectiveStudy } from '../shared/prospectiveStudy';

@Component({
  selector: 'app-prospective-study-creation',
  templateUrl: './prospective-study-creation.component.html',
  styleUrls: ['./prospective-study-creation.component.css']
})

/**
 * onPredict(): prediction of single patient.
 * uploadpatientFile(): uplad file with multiple patients and predict.
 */
export class ProspectiveStudyCreationComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,
                private backendService: BackendService,
                private localStorage: LocalStorageService,
                private userCommunication: UserCommunicationService,
                private router: Router) {
                }

    formGroup1: FormGroup;
    formGroup2: FormGroup;
    formGroup3: FormGroup;
    modelTableColumns: string[] = ['sel', 'name', 'description', 'algorithm', 'data_source', 'created_by', 'creation_time', 'see_details'];
    models: DmModel[] = [];
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
    predictionList: any[] = [];
    predictionColumnsList: string[] = [];
    variableResultList: any[] = [];
    variableResultListTable = new MatTableDataSource(this.variableResultList);
    selectedPrescriptionStudy: any;
    useCaseName: any;
    prospectiveStudy: ProspectiveStudy;
    predictingFlag = false;

    ngOnInit(): void {

      this.backendService.getUseCase(this.projectId).subscribe(
        (data) => {
          this.useCaseName = data.name;
        },
        (err) => {
          this.userCommunication.createMessage(this.userCommunication.ERROR, 'Use case is not selected.');
        }
      );
      this.prospectiveStudy = new ProspectiveStudy();
      this.formGroup1 = this.formBuilder.group({
          name: ['',  Validators.required],
          description: ['',  Validators.required],
      });
      this.formGroup2 = this.formBuilder.group({
        model: new FormControl('')
      });
      this.formGroup3 = this.formBuilder.group({
      });
      this.getModels();

      if (history.state.prescriptionStudy) {
        this.onSelectStudy();
      }
    }

    onSelectStudy(): void{
      this.backendService.getProspectiveStudy(history.state.prescriptionStudy['prospective_study_id']).subscribe(
        data => {
          this.selectedPrescriptionStudy = data;
          this.predictionList =  this.selectedPrescriptionStudy.predictions;
          this.formGroup1.get('name').setValue(this.selectedPrescriptionStudy.name);
          this.formGroup1.get('description').setValue(this.selectedPrescriptionStudy.description);
          this.selectedModel = this.selectedPrescriptionStudy.data_mining_model;

          this.selectedModel.dataset.featureset.variables.forEach(element => {
            if (element.variable_type === 'independent') {
                this.variablesDataSet.push(element);

                this.formGroup3.addControl(element.name, new FormControl(''));
                this.predictionColumnsList.push(element.name);
            }
          });

          this.predictionColumnsList.push('prediction');
          this.variableResultList = this.selectedPrescriptionStudy.predictions;
          this.variableResultListTable = new MatTableDataSource(this.variableResultList);
          this.formGroup1.disable();
          this.formGroup2.disable();
        }
      );
     // this.predictionColumnsList.push('prediction');
     // this.variableResultList = this.selectedPrescriptionStudy.predictions;
      // To allow to change name and description comment this line
      this.formGroup1.disable();
      // To allow to change model selection comment this line
      this.formGroup2.disable();
      // To allow to add predictions comment this line
      // this.formGroup3.disable();
    }

    getModels(): void {
      this.backendService.getModels(this.projectId).subscribe(
        (models) => {
         // this.models = models;
          const modls = [];
          models.forEach(element => {
            if (element['data_mining_state'] === 'final') {
              modls.push(element);
            }
          });
          this.models = modls;
        },
        (err) => {
          this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get Models list operation failed.')
        }
      );
    }

    onSeeModel(model): void {
    }

    onSelectModel(model): void {
        this.selectedModel = model.value;
        this.selectedModel.dataset.featureset.variables.forEach(element => {
          if (element.variable_type === 'independent') {
            this.variablesDataSet.push(element);
            this.formGroup3.addControl(element.name, new FormControl(''));
            this.predictionColumnsList.push(element.name);
          }
        }
      );
    }

    onPredict(): void {

        this.predictingFlag = true;
        this.variables = {
        };

        this.variables.variables = [];
        this.variables.data_mining_model = this.selectedModel;
        this.variables.submitted_by = this.localStorage.userId;

        Object.keys(this.formGroup3.controls).forEach(key => {

            this.variable = {
                name: '',
                value: '',
                data_type: ''
            };

            this.variable.name = key;
            this.variables.submitted_by = this.localStorage.userId;
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

        this.backendService.predict(this.variables).subscribe(
          (data) => {
            this.predicrionResult = data.prediction;
            if (data.prediction === 1) {
              this.predcolor = '#3fc100';
            } else if (data.prediction === 0) {
              this.predcolor = '#f83d17';
            }

            this.formGroup3.addControl('prediction', new FormControl(''));
            this.formGroup3.get('prediction').setValue(data.prediction);

            Object.keys(this.formGroup3.controls).forEach(key => {
              this.formGroup3.get(key).setValue(String(this.formGroup3.get(key).value));
          });

          //  this.variableResultList.push(data);
            this.predictionList.push(data);
            this.variableResultListTable = new MatTableDataSource(this.predictionList);
            this.predictingFlag = false;

        },
        (err) => {
          this.predictingFlag = false;
          console.log('ERROR: ', err);
          this.userCommunication.createMessage(this.userCommunication.ERROR, 'Error on prediction.');
        }
        );

    }

    onSave(): void {

      this.prospectiveStudy.predictions = this.predictionList;
      if (this.selectedPrescriptionStudy) {
        this.backendService.updateProspectiveStudy(this.selectedPrescriptionStudy, this.selectedPrescriptionStudy.prospective_study_id).subscribe(
          (data) => {
            this.router.navigate(['/psdashboard']);
            this.userCommunication.createMessage(this.userCommunication.SUCCESS, 'Prospective study ' + data.name + ' updated correctlly');
          },
          (err) => {
            console.log(err);
            this.userCommunication.createMessage(this.userCommunication.ERROR, 'Error saving prediction.');
          }
        );
      } else {

        this.prospectiveStudy.data_mining_model = this.selectedModel;
        this.prospectiveStudy.name = this.formGroup1.get('name').value;
        this.prospectiveStudy.description = this.formGroup1.get('description').value;
        this.prospectiveStudy.created_by = this.localStorage.userId;

        this.prospectiveStudy.project_id = this.projectId;
        this.backendService.onSaveprospectiveStudy(this.prospectiveStudy).subscribe(
          (data) => {
            this.router.navigate(['/psdashboard']);
            this.userCommunication.createMessage(this.userCommunication.SUCCESS, 'Prospective study ' + data.name + ' created correctlly');
          },
          (err) => {
            this.userCommunication.createMessage(this.userCommunication.ERROR, 'Error saving prediction.');
          }
        );
      }
    }

    uploadpatientFile(event): void {

      this.predictingFlag = true;
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

          // tslint:disable-next-line: prefer-for-of
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
            this.variables.submitted_by = this.localStorage.userId;
            this.backendService.predict(this.variables).subscribe(
              data => {
                console.log('data: ', data)
                this.patientsPredictions[i].prediction = data.prediction;
                if (data.prediction === 1) {
                  this.predcolor = '#3fc100';
                } else if (data.prediction === 0) {
                  this.predcolor = '#f83d17';
                }
                this.predictionList.push(data);
              //  this.variableResultList.push(element);
                this.variableResultListTable = new MatTableDataSource(this.predictionList);
                this.predictingFlag = false;
              },
              (err) => {
                this.predictingFlag = false;
                this.userCommunication.createMessage(this.userCommunication.ERROR, 'Error on prediction');
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
