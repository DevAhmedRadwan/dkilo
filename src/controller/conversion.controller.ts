import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
} from "inversify-express-utils";
import { CreateConversionDto, IdDto, PagenationDto } from "../dto";
import { Conversion } from "../entity";
import { IConversionService, IScanService } from "../interface";
import { DTOValidatorMiddleware } from "../middleware";

@controller("/conversion")
export class ConversionController {
  constructor(
    @inject("ConversionService") private conversionService: IConversionService,
    @inject("ScanService") private scanService: IScanService
  ) {}

  @httpGet("/", DTOValidatorMiddleware.validateQueryDto(PagenationDto))
  public async getAll(req: Request, res: Response) {
    const page = +req.query.page;
    const pageSize = +req.query.pageSize;
    const conversionPagenated = await this.conversionService.findAllAndCount(
      page,
      pageSize
    );
    return res.status(200).json(conversionPagenated);
  }

  @httpGet("/:id", DTOValidatorMiddleware.validateParamsDto(IdDto))
  public async get(req: Request, res: Response) {
    const { id } = req.params;
    const conversion = await this.conversionService.findOneById(+id);
    if (!conversion) {
      return res.status(404).send("conversion not found");
    }
    return res.status(200).json(conversion);
  }

  @httpPost("/", DTOValidatorMiddleware.validateBodyDto(CreateConversionDto))
  public async create(req: Request, res: Response) {
    const { scanId, conversionCount } = req.body;
    const scan = await this.scanService.findOneById(+scanId);
    if (!scan) {
      return res.status(404).send("scan not found");
    }
    let conversion = new Conversion();
    conversion.scanId = scanId;
    conversion.conversionCount = conversionCount;
    conversion = await this.conversionService.save(conversion);
    return res.status(201).json(conversion);
  }

  @httpDelete("/:id", DTOValidatorMiddleware.validateParamsDto(IdDto))
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.conversionService.delete(+id);
    return res.status(200).send();
  }
}
