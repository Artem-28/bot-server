import { Project } from '../project.entity';

export interface IProjectGetQueryMethods {
  projectById: (id: number) => Promise<Project>;
  projectsByUserId: (id: number) => Promise<Project[]>;
}

export interface IProjectUpdateQueryMethods {}
