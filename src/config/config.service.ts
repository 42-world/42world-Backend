import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Inject, Injectable } from '@nestjs/common';

import { EnvConfig, ConfigOptions } from './interfaces';
import { CONFIG_OPTIONS } from './constants';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(@Inject(CONFIG_OPTIONS) options: ConfigOptions) {
    const filePath = `${process.env.NODE_ENV || 'dev'}.env`;
    const envFile = path.join(__dirname, '../../', options.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
