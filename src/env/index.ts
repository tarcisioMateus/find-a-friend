import dotenv from 'dotenv/config'
import z from 'zod'
void dotenv

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('production'),
  PORT: z.coerce.number().default(3333),
  OPENCAGE_API_KEY: z.string(),
  JWT_SECRET: z.string().default('default'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
