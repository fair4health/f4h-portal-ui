import { Variable } from './variable';

export class VariableConfiguration {
  variable: Variable;
  encoding_type: string;
  missing_data_operation: string;
  missing_data_specific_value: string
}
