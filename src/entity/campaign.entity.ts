import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { QRCode } from "./qr-code.entity";

@Entity("Campaign")
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  description: string;

  @OneToMany(() => QRCode, (qrCode) => qrCode.campaignId)
  qrCodes: QRCode[];
}
