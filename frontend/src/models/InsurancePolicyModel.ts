import { AgentModel } from "./AgentModel";
import { RequesterModel } from "./RequesterModel";

export interface InsurancePolicyModel {
  id: number;
  dateCreated: string;
  agent: AgentModel;
  requester: RequesterModel;
  coverages: string[];
  insuranceItem: string;
  estimatedPrice: number;
  lossPriceRangeMin: number;
  lossPriceRangeMax: number;
}
