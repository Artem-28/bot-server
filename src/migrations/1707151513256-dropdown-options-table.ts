import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { QuestionTypeEnum } from '@/base/enum/dropdown-option/question-type.enum';

export class DropdownOptionsTable1707151513256 implements MigrationInterface {
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
        type: 'enum',
        enum: [QuestionTypeEnum.BUTTONS, QuestionTypeEnum.FREE_TEXT],
      }),
      new TableColumn({
        name: 'label',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'enable',
        type: 'boolean',
      }),
    ];
    const table = new Table({ name: 'dropdown_options', columns });
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dropdown_options');
  }
}
