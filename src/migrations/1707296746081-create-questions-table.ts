import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { QuestionTypeEnum } from '@/base/enum/dropdown-option/question-type.enum';

export class CreateQuestionsTable1707296746081 implements MigrationInterface {
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
        name: 'script_id',
        type: 'int',
      }),
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: [QuestionTypeEnum.FREE_TEXT, QuestionTypeEnum.BUTTONS],
      }),
      new TableColumn({
        name: 'started',
        type: 'boolean',
      }),
      new TableColumn({
        name: 'text',
        type: 'varchar',
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
    const table = new Table({ name: 'questions', columns });
    await queryRunner.createTable(table, true);

    const scriptForeignKey = new TableForeignKey({
      columnNames: ['script_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'scripts',
      onDelete: 'CASCADE',
    });
    await queryRunner.createForeignKey('questions', scriptForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('questions');
  }
}
