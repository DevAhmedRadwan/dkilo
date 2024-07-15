import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
  OneToMany,
} from "typeorm";
import type { Campaign } from "./campaign.entity";
import { Scan } from "./scan.entity";

@Entity("QRCode")
export class QRCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  campaignId: number;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  description: string;

  @Column({ type: "varchar", length: 255 })
  redirectUrl: string;

  @Column({ type: "varchar", length: 255 })
  qrCodeUrl: string;

  @OneToMany(() => Scan, (scan) => scan.qrCodeId)
  scans: Scan[];

  @ManyToOne<Campaign>("Campaign", (campaign) => campaign.qrCodes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "campaignId" })
  campaign: Relation<Campaign>;
}
