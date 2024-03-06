import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class UserServiceUsersCreateTable implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const columns = [
      new TableColumn({
        name: 'id',
        type: 'int',
        isGenerated: true,
        isPrimary: true,
        generationStrategy: 'increment',
      }),
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isUnique: true,
      }),
      new TableColumn({
        name: 'password',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'phone',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'license_agreement',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'email_verified_at',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'phone_verified_at',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'last_active_at',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      }),
    ];

    const table = new Table({ name: 'user-service_users', columns });
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user-service_users');
  }
}
