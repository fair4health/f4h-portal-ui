import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BackendService } from '../core/services/backend.service';
import { LocalStorageService } from '../core/services/local-storage.service';
import { UserCommunicationService } from '../core/services/user-communication.service';
import { DmModel } from '../shared/dm-model';
import { ProspectiveStudy } from '../shared/prospectiveStudy';
import { PredictionDetailsComponent } from './prediction-details/prediction-details.component';
import { ExportFileService } from '../core/services/export-file.service';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';

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
                private router: Router,
                public dialog: MatDialog,
                private exportService: ExportFileService) {
                }

    formGroup1: FormGroup;
    formGroup2: FormGroup;
    formGroup3: FormGroup;
    modelTableColumns: string[] = ['sel', 'name', 'description', 'algorithm', 'data_source', 'created_by', 'creation_time'];
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
    predictionError = 'The selected file is not correct; Format file must be CSV and follow correct structure.';
    isLoading = false;
    userInfo = '';
    donePredictionCounter = 0;
    pedingSave = false;

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
          this.predictionColumnsList.push('Created on');
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
      this.isLoading = true;
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
          this.isLoading = false;
        },
        (err) => {
          this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get Models list operation failed.');
          this.isLoading = false;
        }
      );
    }

    /*onSeeModel(model): void {
      console.log(this.selectedModel = model.value);
    }*/

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
            let variableValue: string;
            variableValue = this.formGroup3.get(key).value;

            if (typeof variableValue === 'string') {
              variableValue =  variableValue.toLowerCase();
            }

            this.variable.value = variableValue;
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
            this.pedingSave = true;
        },
        (err) => {
          console.log('ERROR: ', err);
          this.userCommunication.createMessage(this.userCommunication.ERROR, err.error);
          this.predictingFlag = false;
        }
        );

    }

    onSave(): void {

      this.prospectiveStudy.predictions = this.predictionList;
      this.pedingSave = false;
      if (this.selectedPrescriptionStudy) {
        this.backendService.updateProspectiveStudy(this.selectedPrescriptionStudy, 
          this.selectedPrescriptionStudy.prospective_study_id).subscribe(
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
      this.errorUploadingList = true; // By default averything is correct
      for (let i = 0; i < this.variablesDataSet.length; i++) {
          if (this.variablesDataSet[i].name !== columns[0][i]) {
            // this.errorUploadingList = true;
            // } else {
            this.errorUploadingList = false;
            this.predictionError += 'Variable name \'' +
            columns[0][i] + '\' must be \'' + this.variablesDataSet[i].name + '\'.';
            // break;
          }
      }

      if (this.errorUploadingList) {
          this.pedingSave = true;
          columns[0].push('prediction');
          columns.forEach(element => {
            this.patientsPredictionsColumns.push(element);
          });

          this.patientsPredictions = this.getRecordsFromDocument(csvRecordsArray, columns.length);

          // total number of rows to predict
          const totalNumerorOfRows = this.patientsPredictions.length;
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

              let variableValue = this.patientsPredictions[i][key];
              if (typeof variableValue === 'string') {
                variableValue =  variableValue.toLowerCase();
              }
              variable.value = variableValue;

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
                console.log('data: ', data);
                this.patientsPredictions[i].prediction = data.prediction;
                // True prediction print on green color
                if (data.prediction === 1) {
                  this.predcolor = '#3fc100';
                // False prediction print on red color
                } else if (data.prediction === 0) {
                  this.predcolor = '#f83d17';
                }
                this.predictionList.push(data);
              //  this.variableResultList.push(element);
                this.variableResultListTable = new MatTableDataSource(this.predictionList);
                this.predictingFlag = false;
                this.userInfo += 'Adding prediction file row ' + (i + 1) + ' of ' + totalNumerorOfRows + '\n';
                this.donePredictionCounter = (this.donePredictionCounter + 1);
                if (this.donePredictionCounter === totalNumerorOfRows) {
                  this.userCommunication.createMessage(this.userCommunication.SUCCESS, 'Each prediction have been correctly generated.');
                } else  {
                  this.userCommunication.createMessage(this.userCommunication.INFO, this.userInfo);
                }
              },
              (err) => {
                this.predictingFlag = false;
                this.userCommunication.createMessage(this.userCommunication.ERROR,
                  'Error on file row ' + (i + 1) + ':\'\n' + err.error);
              }
            );

          }

      } else if (!this.errorUploadingList) {
          this.userCommunication.createMessage(this.userCommunication.ERROR,
            this.predictionError);
          this.predictingFlag = false;
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

    displayStructure(variablesDataSet) {
      console.log('--------->', variablesDataSet);

      const data = {
        value: variablesDataSet
      }
  
      //console.log('value: ',value)
  
      const dialogRef = this.dialog.open(PredictionDetailsComponent, {
        width: '70%',
        data: data,
        closeOnNavigation: true,
        disableClose: false
      });
    }

    exportFile() {

      const variables = [];
      this.variableResultList.forEach(element => {
        const varObj = {}
        if (element.created_on){
          varObj['Created on'] = element.created_on;
        }
        element.variables.forEach(vars => {

          if (vars.name === 'prediction') {
            
          } else {
            varObj[vars.name] = vars.value;
          }
        });
        varObj['prediction'] = element.prediction;
        if (element.prediction === '1') {
          varObj['prediction'] = 'true';
        } else {
          varObj['prediction'] = 'false';
        }

        variables.push(varObj);

      });

      const name = this.formGroup1.get('name'). value;
      this.exportService.exportExcel(variables, name + '_variables_result');
    }

    onCancel(link): void {

      if (this.pedingSave) {
        const dialogConf = this.dialog.open(DialogConfirmationComponent, {
          width: '500px',
          data: {
                  title: 'Are you sure?',
                  message: 'There are unsaved predictions, if you close the procees the changes will be lost. \nAre you sure you want to exit?',
                  cancelButton: 'No, cancel it.',
                  acceptButton: 'Yes, exit and not save the predictions.'
                }
        });
        dialogConf.afterClosed().subscribe(result => {
          if (result) {
            this.router.navigate([link]);
          } else {
            console.log('canceled close');
          }
        });
      } else {
        this.router.navigate([link]);
      }
    }
}
