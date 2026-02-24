# Data Fetching

## CRITICAL RULE: Server Components Only

ALL data fetching in this application MUST be done exclusively via **React Server Components**.

- **DO NOT** fetch data in client components (`'use client'`)
- **DO NOT** fetch data via API route handlers (`app/api/`)
- **DO NOT** use `useEffect` + `fetch` patterns
- **DO NOT** use SWR, React Query, or any client-side data fetching libraries

Every data fetch happens at the server component level, period.

## Database Queries: `/data` Directory

All database queries MUST be encapsulated in helper functions located in the `/data` directory.

### Rules

1. **Drizzle ORM only** — never write raw SQL. Use the Drizzle query builder or prepared statements exclusively.
2. **One concern per function** — each helper function fetches one logical piece of data.
3. **Auth-scoped queries** — every query that returns user data MUST filter by the currently authenticated user's ID. Users must never be able to access another user's data.

### Example Structure

```
src/
  data/
    workouts.ts
    exercises.ts
    sets.ts
```

### Example Helper Function

```ts
// src/data/workouts.ts
import { db } from '@/db'
import { workouts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

export async function getWorkouts() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, session.user.id))
}
```

### Example Server Component Usage

```tsx
// src/app/dashboard/page.tsx  (Server Component — no 'use client')
import { getWorkouts } from '@/data/workouts'

export default async function DashboardPage() {
  const workouts = await getWorkouts()

  return (
    <ul>
      {workouts.map((w) => (
        <li key={w.id}>{w.name}</li>
      ))}
    </ul>
  )
}
```

## Security: Data Isolation

Every helper function that returns user-owned data **must** scope the query to the authenticated user's ID. This is non-negotiable.

- Retrieve the session inside the helper function itself — do not rely on the caller to pass the user ID.
- If there is no valid session, throw an `Unauthorized` error immediately.
- Never accept a `userId` as a parameter from the caller — always derive it from the server-side session to prevent spoofing.
