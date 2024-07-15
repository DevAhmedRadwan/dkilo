import { QRCode } from "../entity";

export interface IQRCodeService {
  findAllAndCount(page: number, pageSize: number);
  findOneById(id: number);
  findOneByCampaignId(id: number);
  save(qrCode: QRCode);
  delete(id: number);
  invalidateCache(id: number);
}
