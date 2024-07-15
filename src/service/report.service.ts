import { inject, injectable } from "inversify";
import { IReportService } from "../interface";
import { Repository } from "typeorm";
import { Campaign, Conversion, QRCode, Scan } from "../entity";

@injectable()
export class ReportService implements IReportService {
  constructor(
    @inject("CampaignRepository")
    private campaignRepository: Repository<Campaign>
  ) {}

  public async getCampaignAnalytics(id: number) {
    const scansPerCampaignSubQuery = this.campaignRepository
      .createQueryBuilder("campaign")
      .subQuery()
      .select("campaign.id", "id")
      .addSelect("COUNT(DISTINCT scan.id)", "total_scans")
      .from(Campaign, "campaign")
      .leftJoin(QRCode, "qrcode", "campaign.id = qrcode.campaignId")
      .leftJoin(Scan, "scan", "qrcode.id = scan.qrCodeId")
      .groupBy("campaign.id")
      .getQuery();

    const conversionsPerCampaignSubQuery = this.campaignRepository
      .createQueryBuilder("campaign")
      .subQuery()
      .select("campaign.id", "id")
      .addSelect("COUNT(DISTINCT conversion.id)", "total_conversions")
      .from(Campaign, "campaign")
      .leftJoin(QRCode, "qrcode", "campaign.id = qrcode.campaignId")
      .leftJoin(Scan, "scan", "qrcode.id = scan.qrCodeId")
      .leftJoin(Conversion, "conversion", "scan.id = conversion.scanId")
      .groupBy("campaign.id")
      .getQuery();

    const geoDistributionSubQuery = this.campaignRepository
      .createQueryBuilder("campaign")
      .subQuery()
      .select("campaign.id", "id")
      .addSelect("scan.country", "country")
      .addSelect("COUNT(DISTINCT scan.id)", "total_scans")
      .from(Campaign, "campaign")
      .leftJoin(QRCode, "qrcode", "campaign.id = qrcode.campaignId")
      .leftJoin(Scan, "scan", "qrcode.id = scan.qrCodeId")
      .groupBy("campaign.id")
      .addGroupBy("scan.country")
      .getQuery();

    const deviceTypesSubQuery = this.campaignRepository
      .createQueryBuilder("campaign")
      .subQuery()
      .select("campaign.id", "id")
      .addSelect("scan.device", "device")
      .addSelect("COUNT(DISTINCT scan.id)", "total_scans")
      .from(Campaign, "campaign")
      .leftJoin(QRCode, "qrcode", "campaign.id = qrcode.campaignId")
      .leftJoin(Scan, "scan", "qrcode.id = scan.qrCodeId")
      .groupBy("campaign.id")
      .addGroupBy("scan.device")
      .getQuery();

    const result = await this.campaignRepository
      .createQueryBuilder("campaign")
      .select("spc.id", "id")
      .addSelect("spc.total_scans", "total_scans")
      .addSelect("cpc.total_conversions", "total_conversions")
      .addSelect(
        "cpc.total_conversions * 1.0 / spc.total_scans",
        "conversion_rate"
      )
      .addSelect("gd.country", "country")
      .addSelect("gd.total_scans", "geo_total_scans")
      .addSelect("dt.device", "device")
      .addSelect("dt.total_scans", "device_total_scans")
      .from(`(${scansPerCampaignSubQuery})`, "spc")
      .leftJoin(`(${conversionsPerCampaignSubQuery})`, "cpc", "spc.id = cpc.id")
      .leftJoin(`(${geoDistributionSubQuery})`, "gd", "spc.id = gd.id")
      .leftJoin(`(${deviceTypesSubQuery})`, "dt", "spc.id = dt.id")
      .where("campaign.id = :id", { id })
      .getRawMany();

    return result;
  }
}
