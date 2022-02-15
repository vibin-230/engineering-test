import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { BorderRadius, FontWeight, Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Person } from "shared/models/person"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { Button } from "@material-ui/core"
import { Colors } from "shared/styles/colors"

export const ActivityPage: React.FC = () => {
  const [getActivities, activityData, loadActivityState] = useApi<any>({ url: "get-activities" })
  const [activity, setActivity] = useState<any>()
  useEffect(() => {
    getActivities()
  }, [])

  useEffect(() => {
    setActivity(activityData?.activity)
  }, [activityData])

  return (
    <S.Container>
      {" "}
      {loadActivityState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}
      {loadActivityState === "loaded" && (
        <>
          <h1>Activity</h1>
          {activity &&
            activity.map((a) => {
              console.log(a)
              return (
                <>
                  <div>
                    <S.ActivityHeader>
                      <S.ActivityHeaderTitle>
                        <span>Activity type : {a.type}</span>
                        <span>{a.entity.name}</span>
                      </S.ActivityHeaderTitle>
                      <S.ActivityDateContainer>{new Date(a.date).toDateString()}</S.ActivityDateContainer>
                    </S.ActivityHeader>
                  </div>
                  {a.entity.student_roll_states
                    .sort((p1: any, p2: any) => p1.student_id - p2.student_id)
                    .map((e: any) => {
                      return <RollEntity data={e} />
                    })}
                </>
              )
            })}
        </>
      )}
      {loadActivityState === "error" && (
        <CenteredContainer>
          <div>Failed to load</div>
        </CenteredContainer>
      )}
    </S.Container>
  )
}

const RollEntity = ({ data }) => {
  console.log("insiede roll entiry", data)
  return (
    <S.ContainerRollEntity>
      <S.StudentID>{data.student_id}</S.StudentID>
      <S.Avatar url={data.img}></S.Avatar>
      <S.StudentDetailsContainer>
        <div>Name: {data.name}</div>
        <div>Roll Call: {data.roll_state}</div>
      </S.StudentDetailsContainer>
    </S.ContainerRollEntity>
  )
}

const S = {
  ContainerRollEntity: styled.div`
    display: flex;
    margin: 5px 0;
  `,
  StudentDetailsContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    flex-direction: column;
  `,

  StudentID: styled.div`
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
  ActivityHeader: styled.div`
    position: relative;
    border-radius: 16px;
    padding: 24px 16px;
    color: #fff;
    background-color: #343f64;
    box-shadow: 0px 4px 20px rgba(52, 63, 100, 0.9), inset 6px 6px 40px #6c7fc0, inset -6px -8px 20px #0b0f1d; ;
  `,
  ActivityHeaderTitle: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  ActivityDateContainer: styled.span`
    position: absolute;
    bottom: 5px;
    right: 10px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  `,
  Avatar: styled.div<{ url: string }>`
    width: 60px;
    height: 60px;
    background-image: url(${({ url }) => url});
    border-top-left-radius: ${BorderRadius.default};
    border-bottom-left-radius: ${BorderRadius.default};
    background-size: cover;
    background-position: 50%;
    align-self: stretch;
  `,
}
