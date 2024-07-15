import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import type { QRCode } from "./qr-code.entity";
import { Conversion } from "./conversion.entity";

@Entity("Scan")
export class Scan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  qrCodeId: number;

  @CreateDateColumn()
  timeStamp: Date;

  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  lat: number;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  long: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  country: string;

  @Column({ type: "varchar", length: 255 })
  device;

  @OneToOne(() => Conversion, (conversion) => conversion.scanId)
  conversion: Conversion;

  @ManyToOne<QRCode>("QRCode", (qrCode) => qrCode.scans, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "qrCodeId" })
  qrCode: Relation<QRCode>;
}
