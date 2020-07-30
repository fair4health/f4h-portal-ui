import { Variable } from './variable';

export class FeatureSet {
  project_id: string;
  name: string;
  description: string;
  variables: Variable[];
}
