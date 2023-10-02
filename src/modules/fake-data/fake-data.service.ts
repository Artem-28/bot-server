import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Project } from '../project/project.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { FakeDataDto } from './dto/fake-data.dto';

@Injectable()
export class FakeDataService {
  private _userData: CreateUserDto[] = [
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

  public async seed(param: FakeDataDto) {
    if (param.users) {
      await this._seedUsers();
    }
    if (param.projects) {
      await this._seedProject();
    }
  }
}
