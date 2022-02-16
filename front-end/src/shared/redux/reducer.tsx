import { SET_FILTER_TYPE, SET_STUDENTS, SET_ROLL } from "./constants"

let initialState = {
  students: {},
  filterType: "all",
  roll: [],
}

export default (state = initialState, action: any) => {
  switch (action.type) {
    case SET_STUDENTS:
      return Object.assign({}, state, { students: action.payload })
    case SET_FILTER_TYPE:
      return Object.assign({}, state, { filterType: action.payload })
    case SET_ROLL:
      return Object.assign({}, state, { roll: action.payload })
    default:
      return state
  }
}
