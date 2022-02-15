import { Person } from "shared/models/person"
import { RollType } from "shared/models/roll"
import { SET_FILTER_TYPE, SET_STUDENTS, SET_ROLL } from "./constants"

export const setStudents = (body: Person[] | undefined) => {
  return (dispatch: (arg0: { type: string; payload: Person[] | undefined }) => void) => {
    dispatch({ type: SET_STUDENTS, payload: body })
  }
}

export const setFilterType = (body: string) => {
  return (dispatch: (arg0: { type: string; payload: string }) => void) => {
    dispatch({ type: SET_FILTER_TYPE, payload: body })
  }
}

export const setRoll = (body: any) => {
  return (dispatch: (arg0: { type: string; payload: any }) => void) => {
    dispatch({ type: SET_ROLL, payload: body })
  }
}
