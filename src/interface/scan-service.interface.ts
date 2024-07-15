import { Scan } from "../entity";

export interface IScanService {
  findAllAndCount(page: number, pageSize: number);
  findOneById(id: number): Promise<Scan>;
  save(scan: Scan);
  delete(id: number);
  getTrackUrl(id: number): string;
  getCountryName(latitude: number, longitude: number): string | null;
}
