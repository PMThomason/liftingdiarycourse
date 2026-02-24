import { DatePicker } from './_components/DatePicker'
import { getWorkoutsForDate } from '@/data/workouts'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = { searchParams: Promise<{ date?: string }> }

function parseDateParam(param: string | undefined): Date {
  if (!param) return new Date()
  const [year, month, day] = param.split('-').map(Number)
  if (!year || !month || !day) return new Date()
  return new Date(year, month - 1, day) // local midnight, avoids UTC off-by-one
}

export default async function DashboardPage({ searchParams }: Props) {
  const { date: dateParam } = await searchParams
  const selectedDate = parseDateParam(dateParam)
  const workoutList = await getWorkoutsForDate(selectedDate)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="mb-8">
        <DatePicker selectedDate={selectedDate} />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-medium">
          Workouts for {formatDate(selectedDate)}
        </h2>

        {workoutList.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No workouts logged for this date.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {workoutList.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {workout.name ?? 'Untitled Workout'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {workout.workoutExercises.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No exercises logged.</p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {workout.workoutExercises.map((we) => (
                        <li key={we.id}>
                          <p className="text-sm font-medium">{we.exercise.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {we.sets.map((s) => `${s.reps} reps @ ${s.weight}${s.weightUnit}`).join(' · ')}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
