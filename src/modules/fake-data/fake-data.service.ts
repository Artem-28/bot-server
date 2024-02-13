import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

// Module
// Controller
// Service
// Entity
import { User } from '@/modules/user/user.entity';
import { Project } from '@/modules/project/project.entity';
import { DropdownOption } from '@/modules/dropdown-option/dropdown-option.entity';
import { Permission } from '@/modules/permission/permission.entity';

// Guard
// Types
import { UserDto } from '@/modules/user/dto/user.dto';
import { FakeDataDto } from '@/modules/fake-data/dto/fake-data.dto';
import { CreateDropdownOptionDto } from '@/modules/dropdown-option/dto/create-dropdown-option.dto';
import { QuestionTypeEnum } from '@/base/enum/dropdown-option/question-type.enum';
import { DropdownTypeEnum } from '@/base/enum/dropdown-option/dropdown-type.enum';

// Helper
import permissionsResource from '@/modules/fake-data/resource/permissions.resource';

@Injectable()
export class FakeDataService {
  private _questionTypeData: CreateDropdownOptionDto[] = [
    {
      type: DropdownTypeEnum.QUESTION_TYPE,
      code: QuestionTypeEnum.FREE_TEXT,
      label: `question_type.${QuestionTypeEnum.FREE_TEXT}`,
      enable: true,
    },
    {
      type: DropdownTypeEnum.QUESTION_TYPE,
      code: QuestionTypeEnum.BUTTONS,
      label: `question_type.${QuestionTypeEnum.BUTTONS}`,
      enable: true,
    },
  ];
  private _userData: UserDto[] = [
    {
      email: 'artem.mikheev.git@gmail.com',
      password: '123456',
      licenseAgreement: true,
      emailVerifiedAt: new Date(),
    },
    {
      email: 'artem.mikheev.git1@gmail.com',
      password: '123456',
      licenseAgreement: true,
      emailVerifiedAt: new Date(),
    },
    {
      email: 'artem.mikheev.git2@gmail.com',
      password: '123456',
      licenseAgreement: true,
      emailVerifiedAt: new Date(),
    },
  ];
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly _projectRepository: Repository<Project>,
    @InjectRepository(DropdownOption)
    private readonly _dropdownRepository: Repository<DropdownOption>,
    @InjectRepository(Permission)
    private readonly _permissionRepository: Repository<Permission>,
  ) {}

  private async _setProjects(user: User, count = 1) {
    for (let i = 1; i <= count; i++) {
      const title = `User ${user.id} project title ${i}`;
      const project = new Project({ title });
      project.user = user;
      await this._projectRepository.save(project);
    }
  }

  private async _seedUsers() {
    for (const data of this._userData) {
      const password = await bcrypt.hash(data.password, 10);
      await this._userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({ ...data, password })
        .orUpdate(['password'], ['email'], {
          skipUpdateIfNoValuesChanged: true,
        })
        .execute();
    }
  }

  private async _seedProject() {
    const users = await this._userRepository
      .createQueryBuilder('user')
      .getMany();
    for (const user of users) {
      await this._setProjects(user, 3);
    }
  }

  private async _seedQuestionTypes() {
    for (const data of this._questionTypeData) {
      await this._dropdownRepository
        .createQueryBuilder()
        .insert()
        .into(DropdownOption)
        .values(data)
        .orUpdate(['label', 'enable', 'type'], 'code', {
          skipUpdateIfNoValuesChanged: true,
        })
        .execute();
    }
  }

  private async _seedPermissions() {
    for (const data of permissionsResource) {
      await this._permissionRepository
        .createQueryBuilder()
        .insert()
        .into(Permission)
        .values(data)
        .orUpdate(['label', 'parent_code'], 'code', {
          skipUpdateIfNoValuesChanged: true,
        })
        .execute();
    }
  }

  public async seed(param: FakeDataDto) {
    if (param.users) {
      await this._seedUsers();
    }
    if (param.projects) {
      await this._seedProject();
    }
    if (param.questionTypes) {
      await this._seedQuestionTypes();
    }
    if (param.permissions) {
      await this._seedPermissions();
    }
  }
}
