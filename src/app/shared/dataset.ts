import { ElegibilityCriteria } from './elegibility-criteria';
import { FeatureSet } from './feature-set';

export class Dataset {
  project_id: string;
  featureset: FeatureSet;
  name: string;
  description: string;
  eligibility_criteria: ElegibilityCriteria[];
}
