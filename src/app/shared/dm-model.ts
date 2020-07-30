import { Algorithm } from './algorithm';
import { Dataset } from './dataset';
import { VariableConfiguration } from './variable-configuration';

export class DmModel {
  project_id: string;
  dataset: Dataset;
  name: string;
  description: string;
  variable_configurations: VariableConfiguration[];
  algorithms: Algorithm[];
  training_size: number;
  validation_size: number;
  test_size: number;
  execution_state: string;
  created_by: string;
  created_on: string;
}
