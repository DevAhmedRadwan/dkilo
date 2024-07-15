import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/turf";
import fs from "fs";
import { Feature, FeatureCollection, Polygon } from "geojson";
import { inject, injectable } from "inversify";
import path from "path";
import { Repository } from "typeorm";
import { EnvManager } from "../config";
import { Scan } from "../entity";
import { IScanService } from "../interface";
import { CountryModel } from "../model";

type CountryFeature = Feature<Polygon, CountryModel>;
type CountryFeatureCollection = FeatureCollection<Polygon, CountryModel>;

@injectable()
export class ScanService implements IScanService {
  private countriesGeoJson: CountryFeatureCollection;
  constructor(
    @inject("ScanRepository")
    private scanRepository: Repository<Scan>
  ) {
    this.countriesGeoJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/countries.geojson"), "utf8")
    );
  }

  public async findAllAndCount(page: number, pageSize: number) {
    const [items, total] = await this.scanRepository.findAndCount({
      skip: page * pageSize,
      take: pageSize,
    });
    return { items, total, page, pageSize };
  }

  public async findOneById(id: number) {
    const scan = await this.scanRepository.findOneBy({ id: +id });
    return scan;
  }

  public async save(scan: Scan) {
    const scanEntity = await this.scanRepository.save(scan);
    return scanEntity;
  }

  public async delete(id: number) {
    await this.scanRepository.delete({ id });
  }

  public getTrackUrl(id: number): string {
    const { PORT, DOMAIN, PROTOCOL } = EnvManager.instantiate().env;
    return `${PROTOCOL}://${DOMAIN}:${PORT}/scan/${id}`;
  }

  public getCountryName(latitude: number, longitude: number): string | null {
    const pt = point([longitude, latitude]);

    for (const feature of this.countriesGeoJson.features) {
      if (booleanPointInPolygon(pt, feature)) {
        return feature.properties.name;
      }
    }

    return null;
  }
}
