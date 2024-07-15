import { Container } from "inversify";
import { Repository } from "typeorm";
import { TypeormManager } from "./config/typeorm-manager";
import { Campaign, Conversion, QRCode, Scan } from "./entity";
import {
  ICampaignService,
  IConversionService,
  IQRCodeService,
  IReportService,
  IScanService,
} from "./interface";
import {
  CampaignService,
  ConversionService,
  QRCodeService,
  ReportService,
  ScanService,
} from "./service";

// Create a new container
const container = new Container();

// Bind repositories
let dataSource = TypeormManager.instantiate().dataSource;
container
  .bind<Repository<Campaign>>("CampaignRepository")
  .toDynamicValue(() => {
    return dataSource.getRepository(Campaign);
  });
container.bind<Repository<QRCode>>("QRCodeRepository").toDynamicValue(() => {
  return dataSource.getRepository(QRCode);
});
container.bind<Repository<Scan>>("ScanRepository").toDynamicValue(() => {
  return dataSource.getRepository(Scan);
});
container
  .bind<Repository<Conversion>>("ConversionRepository")
  .toDynamicValue(() => {
    return dataSource.getRepository(Conversion);
  });

// Bind services
container.bind<TypeormManager>("TypeormManager").toDynamicValue(() => {
  return TypeormManager.instantiate();
});
container.bind<ICampaignService>("CampaignService").to(CampaignService);
container.bind<IQRCodeService>("QRCodeService").to(QRCodeService);
container.bind<IScanService>("ScanService").to(ScanService);
container.bind<IConversionService>("ConversionService").to(ConversionService);
container.bind<IReportService>("ReportService").to(ReportService);

// Controllers are automatically discovered and bound by inversify-express-utils
// Here, we're just importing the controller so it's included in the build
import "./controller/campaign.controller";
import "./controller/conversion.controller";
import "./controller/qr-code.controller";
import "./controller/scan.controller";
import "./controller/report.controller";

export default container;
