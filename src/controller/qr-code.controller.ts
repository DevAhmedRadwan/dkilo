import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import QRCode from "qrcode";
import { QRCode as QRCodeEntity } from "../entity";
import { ICampaignService, IQRCodeService } from "../interface";
import {
  CreateQRCodeDto,
  GenerateQRCodeDto,
  IdDto,
  PagenationDto,
  UpdateQRCodeDto,
} from "../dto";
import { DTOValidatorMiddleware } from "../middleware";
import { EnvManager } from "../config";

@controller("/qr-code")
export class QRCodeController {
  constructor(
    @inject("QRCodeService") private qrCodeService: IQRCodeService,
    @inject("CampaignService") private campaignService: ICampaignService
  ) {}

  @httpGet("/", DTOValidatorMiddleware.validateQueryDto(PagenationDto))
  public async getAll(req: Request, res: Response) {
    const page = +req.query.page;
    const pageSize = +req.query.pageSize;
    const qrCodesPaginated = await this.qrCodeService.findAllAndCount(
      page,
      pageSize
    );
    return res.status(200).json(qrCodesPaginated);
  }

  @httpGet("/:id", DTOValidatorMiddleware.validateParamsDto(IdDto))
  public async get(req: Request, res: Response) {
    const { id } = req.params;
    const qrCode = await this.qrCodeService.findOneById(+id);
    if (!qrCode) {
      return res.status(404).send("QRCode not found");
    }
    return res.status(200).json(qrCode);
  }

  @httpGet(
    "/generate/:id/:width/:height",
    DTOValidatorMiddleware.validateParamsDto(GenerateQRCodeDto)
  )
  public async generate(req: Request, res: Response) {
    const { PORT, DOMAIN, PROTOCOL } = EnvManager.instantiate().env;
    const { id, width, height } = req.params;
    const qrCode = await this.qrCodeService.findOneById(+id);
    const qrCodeDataUrl = await QRCode.toDataURL(
      `${PROTOCOL}://${DOMAIN}:${PORT}${qrCode.qrCodeUrl}`,
      {
        type: "image/png",
        width: parseInt(width),
        height: parseInt(height),
      }
    );

    const img = Buffer.from(qrCodeDataUrl.split(",")[1], "base64");

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": img.length,
    });
    res.end(img);
  }

  @httpPost("/", DTOValidatorMiddleware.validateBodyDto(CreateQRCodeDto))
  public async create(req: Request, res: Response) {
    const { campaignId, name, description, redirectUrl } = req.body;
    const campaign = await this.campaignService.findOneById(+campaignId);
    if (!campaign) {
      return res.status(404).send("campaign not found");
    }
    let qrCode = new QRCodeEntity();
    qrCode.campaignId = campaignId;
    qrCode.name = name;
    qrCode.description = description;
    qrCode.redirectUrl = redirectUrl;
    qrCode.qrCodeUrl = "";
    qrCode = await this.qrCodeService.save(qrCode);
    qrCode.qrCodeUrl = `/scan/redirect/${qrCode.id}`;
    await this.qrCodeService.save(qrCode);
    return res.status(201).json(qrCode);
  }

  @httpPut(
    "/:id",
    DTOValidatorMiddleware.validateParamsDto(IdDto),
    DTOValidatorMiddleware.validateBodyDto(UpdateQRCodeDto)
  )
  public async update(req: Request, res: Response) {
    const { name, description, redirectUrl } = req.body;
    const { id } = req.params;
    const qrCode = await this.qrCodeService.findOneById(+id);
    if (!qrCode) {
      return res.status(404).send("QRCode not found");
    }
    if (name) qrCode.name = name;
    if (description) qrCode.description = description;
    if (redirectUrl) qrCode.redirectUrl = redirectUrl;

    const updateQRCode = await this.qrCodeService.save(qrCode);
    await this.qrCodeService.invalidateCache(+id);
    return res.status(200).json(updateQRCode);
  }

  @httpDelete("/:id", DTOValidatorMiddleware.validateParamsDto(IdDto))
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.qrCodeService.delete(+id);
    await this.qrCodeService.invalidateCache(+id);
    return res.status(200).send();
  }
}
