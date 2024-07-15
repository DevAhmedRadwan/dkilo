import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1721044178243 implements MigrationInterface {
    name = 'InitDb1721044178243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Conversion\` (\`id\` int NOT NULL AUTO_INCREMENT, \`scanId\` int NOT NULL, \`conversionCount\` int NOT NULL, UNIQUE INDEX \`REL_efa79c5b58ad8cabd9c7a34365\` (\`scanId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Scan\` (\`id\` int NOT NULL AUTO_INCREMENT, \`qrCodeId\` int NOT NULL, \`timeStamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lat\` decimal(10,8) NULL, \`long\` decimal(11,8) NULL, \`country\` varchar(255) NULL, \`device\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`QRCode\` (\`id\` int NOT NULL AUTO_INCREMENT, \`campaignId\` int NOT NULL, \`name\` varchar(50) NOT NULL, \`description\` varchar(255) NOT NULL, \`redirectUrl\` varchar(255) NOT NULL, \`qrCodeUrl\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Campaign\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Conversion\` ADD CONSTRAINT \`FK_efa79c5b58ad8cabd9c7a343659\` FOREIGN KEY (\`scanId\`) REFERENCES \`Scan\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Scan\` ADD CONSTRAINT \`FK_ece3c152ecf662c1ad59c8d0d71\` FOREIGN KEY (\`qrCodeId\`) REFERENCES \`QRCode\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`QRCode\` ADD CONSTRAINT \`FK_6eb4afd8b826f1adad4ba8c302a\` FOREIGN KEY (\`campaignId\`) REFERENCES \`Campaign\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`QRCode\` DROP FOREIGN KEY \`FK_6eb4afd8b826f1adad4ba8c302a\``);
        await queryRunner.query(`ALTER TABLE \`Scan\` DROP FOREIGN KEY \`FK_ece3c152ecf662c1ad59c8d0d71\``);
        await queryRunner.query(`ALTER TABLE \`Conversion\` DROP FOREIGN KEY \`FK_efa79c5b58ad8cabd9c7a343659\``);
        await queryRunner.query(`DROP TABLE \`Campaign\``);
        await queryRunner.query(`DROP TABLE \`QRCode\``);
        await queryRunner.query(`DROP TABLE \`Scan\``);
        await queryRunner.query(`DROP INDEX \`REL_efa79c5b58ad8cabd9c7a34365\` ON \`Conversion\``);
        await queryRunner.query(`DROP TABLE \`Conversion\``);
    }

}
