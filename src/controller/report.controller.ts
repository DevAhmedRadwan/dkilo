import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet } from "inversify-express-utils";
import { IdDto } from "../dto";
import { ICampaignService, IReportService } from "../interface";
import { DTOValidatorMiddleware } from "../middleware";

@controller("/report")
export class ReportController {
  typeormManager;
  constructor(
    @inject("CampaignService") private campaignService: ICampaignService,
    @inject("ReportService") private reportService: IReportService
  ) {}

  @httpGet(
    "/campaign-analytics/:id",
    DTOValidatorMiddleware.validateParamsDto(IdDto)
  )
  public async campaignAnalytics(req: Request, res: Response) {
    const { id } = req.params;
    const campaign = await this.campaignService.findOneById(+id);
    if (!campaign) {
      return res.status(404).send("Campaign not found");
    }
    const analytics = await this.reportService.getCampaignAnalytics(+id);
    return res.status(200).json(analytics);
  }
}
