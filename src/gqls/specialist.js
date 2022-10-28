import { gql } from '@apollo/client'

export const FIND_MANY_SPECIALIST = gql`
  query ($where: SpecialistWhereInput) {
    findManySpecialist(where: $where) {
      id
      email
      name
      surname
      avatar
      description
    }
  }
`
export const CREATE_ONE_SPECIALIST = gql`
  mutation ($data: SpecialistCreateInput!) {
    createOneSpecialist(data: $data) {
      id
    }
  }
`
export const UPDATE_ONE_SPECIALIST = gql`
  mutation ($where: SpecialistWhereUniqueInput!, $data: SpecialistUpdateInput!) {
    updateOneSpecialist(where: $where, data: $data) {
      id
    }
  }
`
export const DELETE_ONE_SPECIALIST = gql`
  mutation ($where: SpecialistWhereUniqueInput!) {
    deleteOneSpecialist(where: $where) {
      id
    }
  }
`
