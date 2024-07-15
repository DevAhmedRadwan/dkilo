import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import {
  CreateCampaignDto,
  IdDto,
  PagenationDto,
  UpdateCampaignDto,
} from "../dto";
import { Campaign } from "../entity";
import { ICampaignService } from "../interface";
import { DTOValidatorMiddleware } from "../middleware";

@controller("/campaign")
export class CampaignController {
  constructor(
    @inject("CampaignService") private campaignService: ICampaignService
  ) {}

  @httpGet("/", DTOValidatorMiddleware.validateQueryDto(PagenationDto))
  public async getAll(req: Request, res: Response) {
    const page = +req.query.page;
    const pageSize = +req.query.pageSize;
    const campaignsPaginated = await this.campaignService.findAllAndCount(
      page,
      pageSize
    );
    return res.status(200).json(campaignsPaginated);
  }

  @httpGet("/:id", DTOValidatorMiddleware.validateParamsDto(IdDto))
  public async get(req: Request, res: Response) {
    const { id } = req.params;
    const campaign = await this.campaignService.findOneById(+id);
    if (!campaign) {
      return res.status(404).send("Campaign not found");
    }
    return res.status(200).json(campaign);
  }

  @httpPost("/", DTOValidatorMiddleware.validateBodyDto(CreateCampaignDto))
  public async create(req: Request, res: Response) {
    const { name, description } = req.body;
    let campaign = new Campaign();
    campaign.name = name;
    campaign.description = description;
    campaign = await this.campaignService.save(campaign);
    return res.status(201).json(campaign);
  }

  @httpPut(
    "/:id",
    DTOValidatorMiddleware.validateParamsDto(IdDto),
    DTOValidatorMiddleware.validateBodyDto(UpdateCampaignDto)
  )
  public async update(req: Request, res: Response) {
    const { name, description } = req.body;
    const { id } = req.params;
    let campaign = await this.campaignService.findOneById(+id);
    if (!campaign) {
      return res.status(404).send("Campaign not found");
    }
    if (name) campaign.name = name;
    if (description) campaign.description = description;
    const updateCampaign = await this.campaignService.save(campaign);
    return res.status(200).json(updateCampaign);
  }

  @httpDelete("/:id", DTOValidatorMiddleware.validateParamsDto(IdDto))
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.campaignService.delete(+id);
    return res.status(200).send();
  }
}
