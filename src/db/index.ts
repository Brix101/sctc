import { env } from "@/env.mjs"
import { Pool, neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres"

import * as schema from "./schema"

const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

export const dbPool = pgDrizzle(pool)

const connection = neon(env.DATABASE_URL!)
export const db = drizzle(connection, { schema })
