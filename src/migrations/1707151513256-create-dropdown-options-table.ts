import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { QuestionTypeEnum } from '@/base/enum/dropdown-option/question-type.enum';
import { DropdownTypeEnum } from '@/base/enum/dropdown-option/dropdown-type.enum';

export class CreateDropdownOptionsTable1707151513256 implements MigrationInterface {
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
        name: 'type',
        type: 'enum',
        enum: [DropdownTypeEnum.QUESTION_TYPE],
      }),
      new TableColumn({
        name: 'code',
        type: 'enum',
        enum: [QuestionTypeEnum.FREE_TEXT, QuestionTypeEnum.BUTTONS],
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
