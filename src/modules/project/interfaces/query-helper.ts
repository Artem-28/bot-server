import { Project } from '../project.entity';
import { QueryHandler } from '../../../base/helpers/QueryHandler';

export interface IProjectGetQueryMethods {
  projectById: (id: number) => Promise<Project>;
  projectsByUserId: (id: number) => Promise<Project[]>;
}

export interface IProjectUpdateQueryMethods {
}

export type IProjectGetQueryHandle = QueryHandler<
  Project,
  IProjectGetQueryMethods
>;

export type IProjectUpdateQueryHandle = QueryHandler<
  Project,
  IProjectUpdateQueryMethods
>;
