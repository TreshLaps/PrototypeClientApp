export enum ActivityType {
  Run = "Run"
}

export enum WorkoutType {
  Race = 1,
  Workout = 3
}

export interface SummaryActivity {
  id: number;
  workout_type: WorkoutType;
  type: ActivityType;
}