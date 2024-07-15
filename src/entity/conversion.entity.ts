import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import type { Scan } from "./scan.entity";

@Entity("Conversion")
export class Conversion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  scanId: number;

  @Column({ type: "int" })
  conversionCount: number;

  @OneToOne<Scan>("Scan", (scan) => scan.conversion, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "scanId" })
  scan: Relation<Scan>;
}
