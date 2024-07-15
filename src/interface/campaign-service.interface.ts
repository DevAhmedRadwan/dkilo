import { Campaign } from "../entity";

export interface ICampaignService {
  findAllAndCount(page: number, pageSize: number);
  findOneById(id: number);
  save(campaign: Campaign);
  delete(id: number);
}
