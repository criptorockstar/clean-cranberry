import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1728086604203 implements MigrationInterface {
    name = 'Initial1728086604203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_images\` DROP FOREIGN KEY \`FK_b367708bf720c8dd62fc6833161\``);
        await queryRunner.query(`ALTER TABLE \`product_images\` CHANGE \`productId\` \`productId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`shipping\` DROP FOREIGN KEY \`FK_14f0a9c4cfa1f66bb85f84cc6c3\``);
        await queryRunner.query(`ALTER TABLE \`shipping\` CHANGE \`door\` \`door\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`shipping\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_cc4e4adab232e8c05026b2f345d\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`shippingAddressId\` \`shippingAddressId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_edd714311619a5ad09525045838\``);
        await queryRunner.query(`ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_72679d98b31c737937b8932ebe6\``);
        await queryRunner.query(`ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_79e62789abd5a78359178bb498f\``);
        await queryRunner.query(`ALTER TABLE \`cart_items\` CHANGE \`cartId\` \`cartId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` CHANGE \`productId\` \`productId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` CHANGE \`orderId\` \`orderId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`carts\` DROP FOREIGN KEY \`FK_69828a178f152f157dcf2f70a89\``);
        await queryRunner.query(`ALTER TABLE \`carts\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`reset_password_token\` \`reset_password_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`product_images\` ADD CONSTRAINT \`FK_b367708bf720c8dd62fc6833161\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shipping\` ADD CONSTRAINT \`FK_14f0a9c4cfa1f66bb85f84cc6c3\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_cc4e4adab232e8c05026b2f345d\` FOREIGN KEY (\`shippingAddressId\`) REFERENCES \`shipping\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` ADD CONSTRAINT \`FK_edd714311619a5ad09525045838\` FOREIGN KEY (\`cartId\`) REFERENCES \`carts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` ADD CONSTRAINT \`FK_72679d98b31c737937b8932ebe6\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` ADD CONSTRAINT \`FK_79e62789abd5a78359178bb498f\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`carts\` ADD CONSTRAINT \`FK_69828a178f152f157dcf2f70a89\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`carts\` DROP FOREIGN KEY \`FK_69828a178f152f157dcf2f70a89\``);
        await queryRunner.query(`ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_79e62789abd5a78359178bb498f\``);
        await queryRunner.query(`ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_72679d98b31c737937b8932ebe6\``);
        await queryRunner.query(`ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_edd714311619a5ad09525045838\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_cc4e4adab232e8c05026b2f345d\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\``);
        await queryRunner.query(`ALTER TABLE \`shipping\` DROP FOREIGN KEY \`FK_14f0a9c4cfa1f66bb85f84cc6c3\``);
        await queryRunner.query(`ALTER TABLE \`product_images\` DROP FOREIGN KEY \`FK_b367708bf720c8dd62fc6833161\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`reset_password_token\` \`reset_password_token\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`carts\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`carts\` ADD CONSTRAINT \`FK_69828a178f152f157dcf2f70a89\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` CHANGE \`orderId\` \`orderId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` CHANGE \`productId\` \`productId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` CHANGE \`cartId\` \`cartId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` ADD CONSTRAINT \`FK_79e62789abd5a78359178bb498f\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` ADD CONSTRAINT \`FK_72679d98b31c737937b8932ebe6\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` ADD CONSTRAINT \`FK_edd714311619a5ad09525045838\` FOREIGN KEY (\`cartId\`) REFERENCES \`carts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`shippingAddressId\` \`shippingAddressId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_cc4e4adab232e8c05026b2f345d\` FOREIGN KEY (\`shippingAddressId\`) REFERENCES \`shipping\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shipping\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`shipping\` CHANGE \`door\` \`door\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`shipping\` ADD CONSTRAINT \`FK_14f0a9c4cfa1f66bb85f84cc6c3\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_images\` CHANGE \`productId\` \`productId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`product_images\` ADD CONSTRAINT \`FK_b367708bf720c8dd62fc6833161\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
