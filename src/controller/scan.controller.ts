import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpDelete,
  httpGet,
  httpPut,
} from "inversify-express-utils";
import { CreateScanDto, IdDto, PagenationDto } from "../dto";
import { Scan } from "../entity";
import { IQRCodeService, IScanService } from "../interface";
import { DTOValidatorMiddleware } from "../middleware";

@controller("/scan")
export class ScanController {
  constructor(
    @inject("ScanService") private scanService: IScanService,
    @inject("QRCodeService") private qrCodeService: IQRCodeService
  ) {}

  @httpGet("/", DTOValidatorMiddleware.validateQueryDto(PagenationDto))
  public async getAll(req: Request, res: Response) {
    const page = +req.query.page;
    const pageSize = +req.query.pageSize;
    const scansPagenated = await this.scanService.findAllAndCount(
      page,
      pageSize
    );
    return res.status(200).json(scansPagenated);
  }

  @httpGet("/:id", DTOValidatorMiddleware.validateParamsDto(IdDto))
  public async get(req: Request, res: Response) {
    const { id } = req.params;
    const scan = await this.scanService.findOneById(+id);
    if (!scan) {
      return res.status(404).send("scan not found");
    }
    return res.status(200).json(scan);
  }

  @httpGet("/redirect/:id", DTOValidatorMiddleware.validateParamsDto(IdDto))
  public async redirect(req: Request, res: Response) {
    const { id } = req.params;
    const qrCode = await this.qrCodeService.findOneById(+id);
    if (!qrCode) {
      return res.status(404).send("QRCode not found");
    }
    const device = req.useragent.platform;
    let scan = new Scan();
    scan.device = device;
    scan.qrCodeId = +id;
    const createdScan = await this.scanService.save(scan);
    const redirectUrl = new URL(qrCode.redirectUrl);
    redirectUrl.searchParams.append("scanId", `${createdScan.id}`);
    return res.render("redirect-page", {
      trackUrl: this.scanService.getTrackUrl(createdScan.id),
      redirectUrl: redirectUrl.toString(),
    });
  }

  @httpPut(
    "/:id",
    DTOValidatorMiddleware.validateParamsDto(IdDto),
    DTOValidatorMiddleware.validateBodyDto(CreateScanDto)
  )
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { lat = null, long = null } = req.body;
    if (lat != null && long != null) {
      const scan = await this.scanService.findOneById(+id);
      if (!scan) {
        return res.status(404).send("Scan not found");
      }
      scan.lat = +lat;
      scan.long = +long;
      scan.country = this.scanService.getCountryName(scan.lat, scan.long);
      await this.scanService.save(scan);
    }
    return res.status(201).send();
  }

  @httpDelete("/:id", DTOValidatorMiddleware.validateParamsDto(IdDto))
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.scanService.delete(+id);
    return res.status(200).send();
  }
}
