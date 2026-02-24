"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date: Date): string {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${day}${suffix} ${format(date, "MMM yyyy")}`;
}

const mockWorkouts = [
  {
    id: 1,
    name: "Bench Press",
    sets: 4,
    reps: 8,
    weight: "80kg",
  },
  {
    id: 2,
    name: "Squat",
    sets: 3,
    reps: 5,
    weight: "100kg",
  },
  {
    id: 3,
    name: "Deadlift",
    sets: 3,
    reps: 5,
    weight: "120kg",
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="mb-8">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-52 justify-start gap-2">
              <CalendarIcon className="h-4 w-4" />
              {formatDate(date)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-medium">
          Workouts for {formatDate(date)}
        </h2>

        {mockWorkouts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No workouts logged for this date.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {mockWorkouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {workout.sets} sets &times; {workout.reps} reps &mdash;{" "}
                    {workout.weight}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
