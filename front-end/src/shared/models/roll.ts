export interface Roll {
  id: number
  name: string
  completed_at: Date
  student_roll_states: { student_id: number; roll_state: RolllStateType }[]
}

export interface RollInput {
  student_roll_states: { student_id: number; roll_state: RolllStateType }[]
}

export type RolllStateType = "unmark" | "present" | "absent" | "late"

//added rolltype interface
export interface RollType {
  roll_state: RolllStateType
  student_id: number
}
