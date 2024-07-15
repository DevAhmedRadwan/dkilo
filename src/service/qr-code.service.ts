import { inject, injectable } from "inversify";
import { IQRCodeService } from "../interface";
import { QRCode } from "../entity";
import { Repository } from "typeorm";
import { TypeormManager } from "../config/typeorm-manager";

@injectable()
export class QRCodeService implements IQRCodeService {
  constructor(
    @inject("QRCodeRepository")
    private qrCodeRepository: Repository<QRCode>,
    @inject("TypeormManager")
    private TypeormManager: TypeormManager
  ) {}

  public async findAllAndCount(page: number, pageSize: number) {
    const [items, total] = await this.qrCodeRepository.findAndCount({
      skip: page * pageSize,
      take: pageSize,
    });
    return { items, total, page, pageSize };
  }

  public async findOneById(id: number) {
    const qrCode = await this.qrCodeRepository.findOne({
      where: { id: +id },
      cache: {
        id: this.getCacheId(id),
        milliseconds: 5000,
      },
    });
    return qrCode;
  }

  public async findOneByCampaignId(campaignId: number) {
    const qrCode = await this.qrCodeRepository.findOneBy({
      campaignId: +campaignId,
    });
    return qrCode;
  }

  public async save(qrCode: QRCode) {
    const qrCodeEntity = await this.qrCodeRepository.save(qrCode);
    return qrCodeEntity;
  }

  public async delete(id: number) {
    await this.qrCodeRepository.delete({ id });
  }

  public async invalidateCache(id: number) {
    const queryResultCache = this.TypeormManager.dataSource.queryResultCache;
    if (!queryResultCache) return;
    const queryKey = this.getCacheId(id);
    await queryResultCache.remove([queryKey]);
  }

  private getCacheId(id: number) {
    return `${QRCode.name}_${id}`;
  }
}
