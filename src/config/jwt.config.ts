import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJWTConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => ({
  secret: configService.get<string>('ACCESS_TOKEN_KEY'),
  signOptions: { expiresIn: configService.get<string>('ACCESS_TOKEN_TIME') },
});
