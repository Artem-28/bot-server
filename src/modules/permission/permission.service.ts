import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
// Module
// Controller
// Service
import { CheckEntityService } from '@/modules/check-entity/check-entity.service';
// Entity
import { Permission } from '@/modules/permission/permission.entity';
import { PermissionUser } from '@/modules/permission/permission-user.entity';

// Guard

// Types
import { PermissionUserDto } from '@/modules/permission/dto/permission-user.dto';
import { Options } from '@/base/interfaces/service.interface';
// Helper
import QueryBuilderHelper from '@/base/helpers/query-builder.helper';
import { compareArrays } from '@/base/helpers/array.helper';

@Injectable()
export class PermissionService {
  constructor(
    private readonly _dataSource: DataSource,
    @InjectRepository(Permission)
    private readonly _permissionRepository: Repository<Permission>,
    @InjectRepository(PermissionUser)
    private readonly _permissionUserRepository: Repository<PermissionUser>,
    private readonly _checkEntityService: CheckEntityService,
  ) {}

  public async getPermissionGroups(): Promise<Permission[]> {
    const queryHelper = new QueryBuilderHelper(this._permissionRepository, {
      filter: { field: 'parentCode', value: null },
      relation: { name: 'children' },
    });
    return await queryHelper.builder.getMany();
  }

  public async getPermissionUser(options: Options): Promise<PermissionUser[]> {
    const { filter, relation } = options;
    const queryHelper = new QueryBuilderHelper(this._permissionUserRepository, {
      filter,
      relation,
    });
    return await queryHelper.builder.getMany();
  }

  public async updatePermissionUser(
    dto: PermissionUserDto,
    options: Options,
  ): Promise<boolean> {
    const throwException = options && options.throwException;
    // Проверка подписан ли пользователь на проект
    const checkUser =
      await this._checkEntityService.checkUserSubscriptionToProject(
        options.param,
        throwException,
      );
    if (!checkUser) return false;

    // Получаем текущие permissions у пользователя
    const queryHelper = new QueryBuilderHelper(this._permissionUserRepository, {
      filter: [
        { field: 'userId', value: dto.userId },
        { field: 'projectId', value: dto.projectId },
      ],
    });
    // Получаем текущие permissions у пользователя
    const currentPermissions = await queryHelper.builder
      .select(['entity.code', 'entity.id'])
      .getMany();

    // Текущие коды permission
    const currentCode = currentPermissions.map((p) => p.code);
    // Выбранные коды permission
    const selectedCode = dto.permissions;
    // Разделяем коды на те которые нужно удалить и те которые добавить
    const { notInSelected, notInCurrent } = compareArrays(
      currentCode,
      selectedCode,
    );

    // Permissions которые нужно удалить
    const removePermission = currentPermissions.filter((p) =>
      notInSelected.includes(p.code),
    );

    // Permissions которые нужно добавить
    const insertPermission = notInCurrent.map((code) => {
      return new PermissionUser({
        projectId: dto.projectId,
        userId: dto.userId,
        code,
      });
    });

    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.remove(PermissionUser, removePermission);
      await queryRunner.manager.insert(PermissionUser, insertPermission);
      await queryRunner.commitTransaction();
      return true;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (throwException) {
        throw new HttpException('question.create', 500);
      }
      return false;
    } finally {
      await queryRunner.release();
    }
  }
}
