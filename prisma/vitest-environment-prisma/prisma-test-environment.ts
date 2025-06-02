import { prisma } from '@/lib/prisma'
import 'dotenv/config'
import { spawnSync } from 'node:child_process'

import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL env variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseUrl(schema)

    process.env.DATABASE_URL = databaseURL

    const migrateResult = spawnSync(
      'npx',
      ['prisma', 'migrate', 'dev', '--name', 'init', '--skip-seed'],
      {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: databaseURL },
      },
    )
    console.log(migrateResult)

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
