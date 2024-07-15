import async from "async";
import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import { Conversion, QRCode, Scan } from "../entity";
import { IConversionService } from "../interface";

@injectable()
export class ConversionService implements IConversionService {
  constructor(
    @inject("ConversionRepository")
    private conversionRepository: Repository<Conversion>
  ) {}

  public async findAllAndCount(page: number, pageSize: number) {
    const [items, total] = await this.conversionRepository.findAndCount({
      skip: page * pageSize,
      take: pageSize,
    });
    return { items, total, page, pageSize };
  }

  public async findOneById(id: number) {
    const conversion = await this.conversionRepository.findOneBy({ id: +id });
    return conversion;
  }

  public async save(conversion: Conversion) {
    const conversionEntity = await this.conversionRepository.save(conversion);
    return conversionEntity;
  }

  public async delete(id: number) {
    await this.conversionRepository.delete({ id });
  }
}
