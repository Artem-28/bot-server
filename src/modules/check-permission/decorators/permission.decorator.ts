import { SetMetadata } from '@nestjs/common';
import { AccessController } from '@/modules/check-permission/access-controllers/access-controller.type';

export function Permission(accessController: AccessController) {
  return SetMetadata('permissions', accessController);
}
