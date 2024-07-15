import { inject, injectable } from "inversify";
import { ICampaignService } from "../interface";
import { Repository } from "typeorm";
import { Campaign } from "../entity";

@injectable()
export class CampaignService implements ICampaignService {
  constructor(
    @inject("CampaignRepository")
    private campaignRepository: Repository<Campaign>
  ) {}

  public async findAllAndCount(page: number, pageSize: number) {
    const [items, total] = await this.campaignRepository.findAndCount({
      skip: page * pageSize,
      take: pageSize,
    });
    return { items, total, page, pageSize };
  }

  public async findOneById(id: number) {
    const campaign = await this.campaignRepository.findOneBy({ id: +id });
    return campaign;
  }

  public async save(campaign: Campaign) {
    const campaignEntity = await this.campaignRepository.save(campaign);
    return campaignEntity;
  }

  public async delete(id: number) {
    await this.campaignRepository.delete({ id });
  }
}
