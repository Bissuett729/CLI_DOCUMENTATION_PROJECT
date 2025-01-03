import { registerAs } from '@nestjs/config';

export default registerAs('env', () => ({
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 29090,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  RUNNIN_PORT: parseInt(process.env.RUNNIN_PORT),
  DB_URI: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/`,
}));
