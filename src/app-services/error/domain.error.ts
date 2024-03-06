import { ValidationError } from 'class-validator';

export interface DomainErrorOptions {
  message?: string;
}

export class DomainError extends Error {
  constructor(errors: ValidationError[], options?: DomainErrorOptions) {
    const _errors: string[] = [];
    errors.forEach((error) => {
      const constraints = error.constraints || {};
      Object.entries(constraints).forEach((v) => _errors.push(v[1]));
    });
    const message = options.message || '';
    super(`Errors: ${_errors.join('; ')} Message: ${message}`);
    this.name = DomainError.name;
  }
}
