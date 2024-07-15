import { Conversion } from "../entity";

export interface IConversionService {
  findAllAndCount(page: number, pageSize: number);
  findOneById(id: number);
  save(conversion: Conversion);
  delete(id: number);
}
