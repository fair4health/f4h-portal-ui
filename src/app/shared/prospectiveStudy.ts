import { DmModel} from './dm-model';

export class ProspectiveStudy {
  project_id: string;
  name: string;
  description: string;
  predictions: any[];
  created_by: string;
  data_mining_model: DmModel;
}