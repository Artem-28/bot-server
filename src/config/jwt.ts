import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config = {
  secret: `${process.env.JWT_SECRET}`,
  signOptions: { expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRES}` },
};

export default registerAs('jwt', () => config);
