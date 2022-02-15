import React, { useEffect, useState } from "react"
import { connect, useSelector } from "react-redux"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
  setRollFunc: (type: RolllStateType, id: number) => void
  studentID: number
}

const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange, setRollFunc, studentID }) => {
  const [rollState, setRollState] = useState(initialState)
  const dispatchprops = useSelector((props: any) => {
    return { roll: props.roll }
  })
  console.log(dispatchprops.roll)

  useEffect(() => {
    dispatchprops.roll.map((s: any) => {
      if (s.student_id === studentID) {
        setRollState(s.roll_state)
      }
    })
  }, [])

  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    const next = nextState()
    setRollState(next)
    setRollFunc(next, studentID)
    if (onStateChange) {
      onStateChange(next)
    }
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
}

export default connect()(RollStateSwitcher)
