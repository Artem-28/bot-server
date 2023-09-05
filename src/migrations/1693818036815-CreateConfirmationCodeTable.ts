import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { EnumConfirmation } from '../enum/EnumConfirmation';

export class CreateConfirmationCodeTable1693818036815
  implements MigrationInterface
{
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
        name: 'code',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: [EnumConfirmation.TYPE_REGISTRATION],
      }),
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isUnique: true,
      }),
      new TableColumn({
        name: 'phone',
        type: 'varchar',
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
    const table = new Table({ name: 'confirmation_code', columns });
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('confirmation_code');
  }
}
