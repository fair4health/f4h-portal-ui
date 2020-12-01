import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
export class ProspectiveStudyCreationComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,
                private backendService: BackendService,
                private localStorage: LocalStorageService,
                private userCommunication: UserCommunicationService,
                private changeDetectorRefs: ChangeDetectorRef) {
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

    predictionList: any[] = [];
    predictionColumnsList: string[] = [];
    variableResultList: any[] = [];

    selectedPrescriptionStudy: any;


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

        if (history.state.prescriptionStudy) {
          this.onSelectStudy();
        }
    }

    onSelectStudy(){
      console.log(history.state.prescriptionStudy);
      this.selectedPrescriptionStudy = history.state.prescriptionStudy;
      this.formGroup1.get('name').setValue(this.selectedPrescriptionStudy.name);
      this.formGroup1.get('description').setValue(this.selectedPrescriptionStudy.description);
      this.selectedModel = this.selectedPrescriptionStudy.data_mining_model;
      console.log(this.selectedModel);
      this.selectedModel.dataset.featureset.variables.forEach(element => {
        if (element.variable_type === 'independent') {
            this.variablesDataSet.push(element);

            this.formGroup3.addControl(element.name, new FormControl(''));
            this.predictionColumnsList.push(element.name);
        }
      });
      this.variableResultList = this.selectedPrescriptionStudy.predictions;
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
                this.predictionColumnsList.push(element.name);
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

            this.variableResultList.push(data);
            this.predictionList.push(data);

        });
    }

    onSave(): void {
      this.prospectiveStudy.data_mining_model = this.selectedModel;
      console.log('form group 1: ',this.formGroup1.value)

      this.prospectiveStudy.name = this.formGroup1.get('name').value;
      this.prospectiveStudy.description = this.formGroup1.get('description').value;
      this.prospectiveStudy.created_by = '1903';
      this.prospectiveStudy.predictions = this.predictionList;

      console.log('prospective study to save: ', this.prospectiveStudy);

      this.backendService.onSaveprospectiveStudy(this.prospectiveStudy).subscribe(
        (data) => {
          console.log('response: ', data)
        }
      );
    }

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
          console.log('patients prediction: ', this.patientsPredictions);
          
          
          
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
                this.predictionList.push(data);

                this.variableResultList.push(element);
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
