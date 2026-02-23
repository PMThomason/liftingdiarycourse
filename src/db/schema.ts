import { pgTable, integer, text, real, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const exercises = pgTable("exercises", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text("name").notNull(),
  muscleGroup: text("muscle_group").notNull(),
  equipment: text("equipment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workouts = pgTable("workouts", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name"),
  notes: text("notes"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workoutExercises = pgTable("workout_exercises", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  workoutId: integer("workout_id").notNull().references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id, { onDelete: "restrict" }),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  uniqueIndex("workout_exercise_unique_idx").on(t.workoutId, t.exerciseId),
]);

export const sets = pgTable("sets", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  workoutExerciseId: integer("workout_exercise_id").notNull().references(() => workoutExercises.id, { onDelete: "cascade" }),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps").notNull(),
  weight: real("weight").notNull(),
  weightUnit: text("weight_unit").notNull().default("lbs"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations for db.query.* API
export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, { fields: [workoutExercises.workoutId], references: [workouts.id] }),
  exercise: one(exercises, { fields: [workoutExercises.exerciseId], references: [exercises.id] }),
  sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, { fields: [sets.workoutExerciseId], references: [workoutExercises.id] }),
}));

// Inferred types
export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;
export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type NewWorkoutExercise = typeof workoutExercises.$inferInsert;
export type Set = typeof sets.$inferSelect;
export type NewSet = typeof sets.$inferInsert;
