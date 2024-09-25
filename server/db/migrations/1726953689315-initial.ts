import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1726953689315 implements MigrationInterface {
    name = 'Initial1726953689315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`colors\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sizes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`image\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`quantity\` enum ('limitado', 'ilimitado') NOT NULL DEFAULT 'ilimitado', \`stock\` int NOT NULL, \`price\` int NOT NULL, \`offer\` int NOT NULL, \`featured\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`orderNumber\` varchar(255) NOT NULL, \`total\` int NOT NULL, \`status\` enum ('Pendiente', 'pagado') NOT NULL DEFAULT 'Pendiente', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, UNIQUE INDEX \`IDX_59b0c3b34ea0fa5562342f2414\` (\`orderNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`cartId\` int NULL, \`productId\` int NULL, \`orderId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`carts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`reset_password_token\` varchar(255) NULL, \`roles\` enum ('Admin', 'User') NOT NULL DEFAULT 'User', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_colors\` (\`product_id\` int NOT NULL, \`color_id\` int NOT NULL, INDEX \`IDX_90213070102b149edd87ab1207\` (\`product_id\`), INDEX \`IDX_ab5fd8f7c7e066c3126f6ac280\` (\`color_id\`), PRIMARY KEY (\`product_id\`, \`color_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_sizes\` (\`product_id\` int NOT NULL, \`size_id\` int NOT NULL, INDEX \`IDX_b6d94a689dd115cdf01589b961\` (\`product_id\`), INDEX \`IDX_b77c486737027396bcfdc0897b\` (\`size_id\`), PRIMARY KEY (\`product_id\`, \`size_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_categories\` (\`product_id\` int NOT NULL, \`category_id\` int NOT NULL, INDEX \`IDX_8748b4a0e8de6d266f2bbc877f\` (\`product_id\`), INDEX \`IDX_9148da8f26fc248e77a387e311\` (\`category_id\`), PRIMARY KEY (\`product_id\`, \`category_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product_images\` ADD CONSTRAINT \`FK_b367708bf720c8dd62fc6833161\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` ADD CONSTRAINT \`FK_edd714311619a5ad09525045838\` FOREIGN KEY (\`cartId\`) REFERENCES \`carts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` ADD CONSTRAINT \`FK_72679d98b31c737937b8932ebe6\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` ADD CONSTRAINT \`FK_79e62789abd5a78359178bb498f\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`carts\` ADD CONSTRAINT \`FK_69828a178f152f157dcf2f70a89\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_colors\` ADD CONSTRAINT \`FK_90213070102b149edd87ab1207e\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`product_colors\` ADD CONSTRAINT \`FK_ab5fd8f7c7e066c3126f6ac280b\` FOREIGN KEY (\`color_id\`) REFERENCES \`colors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_sizes\` ADD CONSTRAINT \`FK_b6d94a689dd115cdf01589b9615\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`product_sizes\` ADD CONSTRAINT \`FK_b77c486737027396bcfdc0897bf\` FOREIGN KEY (\`size_id\`) REFERENCES \`sizes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_categories\` ADD CONSTRAINT \`FK_8748b4a0e8de6d266f2bbc877f6\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`product_categories\` ADD CONSTRAINT \`FK_9148da8f26fc248e77a387e3112\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_categories\` DROP FOREIGN KEY \`FK_9148da8f26fc248e77a387e3112\``);
        await queryRunner.query(`ALTER TABLE \`product_categories\` DROP FOREIGN KEY \`FK_8748b4a0e8de6d266f2bbc877f6\``);
        await queryRunner.query(`ALTER TABLE \`product_sizes\` DROP FOREIGN KEY \`FK_b77c486737027396bcfdc0897bf\``);
        await queryRunner.query(`ALTER TABLE \`product_sizes\` DROP FOREIGN KEY \`FK_b6d94a689dd115cdf01589b9615\``);
        await queryRunner.query(`ALTER TABLE \`product_colors\` DROP FOREIGN KEY \`FK_ab5fd8f7c7e066c3126f6ac280b\``);
        await queryRunner.query(`ALTER TABLE \`product_colors\` DROP FOREIGN KEY \`FK_90213070102b149edd87ab1207e\``);
        await queryRunner.query(`ALTER TABLE \`carts\` DROP FOREIGN KEY \`FK_69828a178f152f157dcf2f70a89\``);
        await queryRunner.query(`ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_79e62789abd5a78359178bb498f\``);
        await queryRunner.query(`ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_72679d98b31c737937b8932ebe6\``);
        await queryRunner.query(`ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_edd714311619a5ad09525045838\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\``);
        await queryRunner.query(`ALTER TABLE \`product_images\` DROP FOREIGN KEY \`FK_b367708bf720c8dd62fc6833161\``);
        await queryRunner.query(`DROP INDEX \`IDX_9148da8f26fc248e77a387e311\` ON \`product_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_8748b4a0e8de6d266f2bbc877f\` ON \`product_categories\``);
        await queryRunner.query(`DROP TABLE \`product_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_b77c486737027396bcfdc0897b\` ON \`product_sizes\``);
        await queryRunner.query(`DROP INDEX \`IDX_b6d94a689dd115cdf01589b961\` ON \`product_sizes\``);
        await queryRunner.query(`DROP TABLE \`product_sizes\``);
        await queryRunner.query(`DROP INDEX \`IDX_ab5fd8f7c7e066c3126f6ac280\` ON \`product_colors\``);
        await queryRunner.query(`DROP INDEX \`IDX_90213070102b149edd87ab1207\` ON \`product_colors\``);
        await queryRunner.query(`DROP TABLE \`product_colors\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`carts\``);
        await queryRunner.query(`DROP TABLE \`cart_items\``);
        await queryRunner.query(`DROP INDEX \`IDX_59b0c3b34ea0fa5562342f2414\` ON \`orders\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP TABLE \`product_images\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP TABLE \`sizes\``);
        await queryRunner.query(`DROP TABLE \`colors\``);
    }

}
