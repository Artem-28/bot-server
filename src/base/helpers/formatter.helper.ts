import { BaseHttpParam } from '@/base/interfaces/base.interface';

export function formatParamHttp(data: any): BaseHttpParam {
  const paramFields = ['userId', 'projectId', 'scriptId', 'questionId'];
  return paramFields.reduce((acc, field) => {
    if (!data.hasOwnProperty(field)) return acc;
    acc[field] = Number(data[field]);
    return acc;
  }, {} as BaseHttpParam);
}
