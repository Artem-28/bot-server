import { Global, Module } from '@nestjs/common';
import { UserModule } from '@app-services';

@Global()
@Module({
  imports: [UserModule],
  exports: [UserModule],
})
export class DomainsModule {}
