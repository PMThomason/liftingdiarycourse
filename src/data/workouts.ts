import { auth } from '@clerk/nextjs/server'
import { and, eq, gte, lte } from 'drizzle-orm'
import { db } from '@/db'
import { workouts } from '@/db/schema'

export async function getWorkoutsForDate(date: Date) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  return db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      gte(workouts.startedAt, startOfDay),
      lte(workouts.startedAt, endOfDay)
    ),
    with: {
      workoutExercises: {
        orderBy: (we, { asc }) => [asc(we.orderIndex)],
        with: {
          exercise: true,
          sets: {
            orderBy: (s, { asc }) => [asc(s.setNumber)],
          },
        },
      },
    },
  })
}
