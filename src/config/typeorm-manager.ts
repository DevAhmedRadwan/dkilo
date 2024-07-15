import { DataSource } from "typeorm";
import dataSource from "./data-source";

export class TypeormManager {
  private static instance: TypeormManager | null = null;

  public dataSource: DataSource;

  private constructor() {
    this.dataSource = dataSource;
  }

  static instantiate() {
    if (this.instance === null) {
      this.instance = new TypeormManager();
    }
    return this.instance;
  }
}
