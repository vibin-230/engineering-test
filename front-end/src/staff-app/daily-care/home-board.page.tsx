import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person, PersonHelper } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { library } from "@fortawesome/fontawesome-svg-core"

//imported icons
import { faSortAlphaDown, faSortAlphaDownAlt } from "@fortawesome/free-solid-svg-icons"

library.add(faSortAlphaDown, faSortAlphaDownAlt)

import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { connect } from "react-redux"
import { setStudents, setRoll } from "shared/redux/action"
import { RolllStateType, RollType } from "shared/models/roll"

//constants for sorting
const FirstName: string = "firstName"
const LastName: string = "lastName"
const Asc: string = "asc"
const Des: string = "des"
let rollArr: any = []

const HomeBoardPage: React.FC = (props: any) => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [getRolls, rollData, loadRollState] = useApi<{ students: Person[] }>({ url: "save-roll" })

  //states
  // const [students, setStudents] = useState<Person[] | undefined>([])
  const [sortBy, setSortBy] = useState(FirstName)
  const [sortOrder, setSortOrder] = useState(Asc)
  const [searchText, setSearchText] = useState<string>("")
  const [allStudents, setAllStudents] = useState<number>(0)

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    props.dispatch(setStudents(data?.students))
    setAllStudents(data ? data.students.length : 0)
  }, [data])

  useEffect(() => {
    if (props.filterType === "all") {
      props.dispatch(setStudents(data?.students))
    } else if (props.filterType === "present") {
      let x = data?.students.filter((student) => props.roll.findIndex((present: RollType) => present.roll_state === "present" && present.student_id === student.id) > -1)
      props.dispatch(setStudents(x))
    } else if (props.filterType === "absent") {
      let x = data?.students.filter((student) => props.roll.findIndex((absent: RollType) => absent.roll_state === "absent" && absent.student_id === student.id) > -1)
      props.dispatch(setStudents(x))
    } else if (props.filterType === "late") {
      let x = data?.students.filter((student) => props.roll.findIndex((late: RollType) => late.roll_state === "late" && late.student_id === student.id) > -1)
      props.dispatch(setStudents(x))
    }
    console.log(props.roll)
  }, [props.filterType])

  //search functionality
  useEffect(() => {
    if (searchText === "") {
      props.dispatch(setStudents(data?.students))
    } else {
      props.dispatch(setStudents(data?.students.filter((a) => PersonHelper.getFullName(a).includes(searchText.toLowerCase()))))
    }
  }, [searchText])

  const onToolbarAction = (action: ToolbarAction, order?: string) => {
    if (action === "roll") {
      setIsRollMode(true)
    }

    //sort function state change
    if (action === "sort" && order === Asc) {
      setSortOrder(Asc)
    } else {
      setSortOrder(Des)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      props.dispatch(setRoll([]))
      setIsRollMode(false)
    }
    if (action === "filter") {
      let body = {
        student_roll_states: props.roll,
      }
      getRolls(body).then((res) => {
        props.dispatch(setRoll([]))
        setIsRollMode(false)
      })
    }
  }

  //sort onclick
  const onSortType = (type: SortType) => {
    setSortBy(type)
  }

  //search onchange
  const onSearch = (text: string) => {
    setSearchText(text)
  }
  const setRollFunc = (roll_state: RolllStateType, student_id: number, name: string, img: any) => {
    let index = rollArr.findIndex((a: any) => a.student_id === student_id && roll_state !== "unmark")
    if (index > -1) {
      rollArr[index] = { roll_state, student_id, name, img }
    } else {
      rollArr.push({ roll_state, student_id, name, img })
    }
    props.dispatch(setRoll([...rollArr]))
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} onSortType={onSortType} sortBy={sortBy} onSearch={onSearch} searchText={searchText} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && props.students && (
          <>
            {props.students
              .sort((a: Person, b: Person) =>
                sortBy === FirstName
                  ? sortOrder === Asc
                    ? a.first_name.localeCompare(b.first_name)
                    : b.first_name.localeCompare(a.first_name)
                  : sortOrder === Asc
                  ? a.last_name.localeCompare(b.last_name)
                  : b.last_name.localeCompare(a.last_name)
              )
              .map((s: any) => (
                <StudentListTile key={s.id} isRollMode={isRollMode} student={s} setRollFunc={setRollFunc} />
              ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay
        isActive={isRollMode}
        onItemClick={onActiveRollAction}
        allStudents={allStudents}
        lateStudents={props.roll.filter((late: RollType) => late.roll_state === "late").length}
        absentStudents={props.roll.filter((absent: RollType) => absent.roll_state === "absent").length}
        presentStudents={props.roll.filter((present: RollType) => present.roll_state === "present").length}
      />
    </>
  )
}

const mapstatetoprops = (state: any) => {
  return { students: state.students, filterType: state.filterType, roll: state.roll }
}

export default connect(mapstatetoprops)(HomeBoardPage)

type ToolbarAction = "roll" | "sort"
type SortType = typeof FirstName | typeof LastName

interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  onSortType: (type: SortType) => void
  sortBy: string
  onSearch: (value: string) => void
  searchText: string
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, onSortType, sortBy, onSearch, searchText } = props
  return (
    <S.ToolbarContainer>
      {/* onItemClick moved to icon */}
      <div>
        <S.SelectStyle name="sortType" value={sortBy} onChange={(e: any) => onSortType(e.target.value)}>
          <option value={FirstName}>First Name</option>
          <option value={LastName}>Last Name</option>
        </S.SelectStyle>

        <S.SortIconContainer onClick={() => onItemClick("sort", Asc)}>
          <FontAwesomeIcon icon={faSortAlphaDown} size="lg" />
        </S.SortIconContainer>

        <S.SortIconContainer onClick={() => onItemClick("sort", Des)}>
          <FontAwesomeIcon icon={faSortAlphaDownAlt} size="lg" />
        </S.SortIconContainer>
      </div>
      <S.StyledInput placeholder="Search" aria-valuetext={searchText} onChange={(e) => (e.target.value === null ? onSearch("") : onSearch(e.target.value))} />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  //icon style
  SortIconContainer: styled.span`
    margin-left: 10px;
    cursor: pointer;
  `,
  //select style
  SelectStyle: styled.select`
    background-color: ${Colors.blue.base};
    outline: none;
    border: none;
    font-weight: ${FontWeight.strong};
    color: #fff;
  `,
  //input style
  StyledInput: styled.input`
    border: 0;
    padding: 5px;
  `,
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
