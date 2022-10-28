import { gql } from '@apollo/client'

export const FIND_MANY_EVENT = gql`
  query ($where: EventWhereInput) {
    findManyEvent(where: $where) {
      title
      id
      date
      image
      type
      description
      busy {
        id
        user {
          name
          surname
          tel
          email
        }
      }
      specialist {
        id
        name
        surname
        email
      }
    }
  }
`

export const CREATE_ONE_EVENT = gql`
  mutation ($data: EventCreateInput!) {
    createOneEvent(data: $data) {
      id
    }
  }
`
export const UPDATE_ONE_EVENT = gql`
  mutation ($data: EventUpdateInput!, $where: EventWhereUniqueInput!) {
    updateOneEvent(data: $data, where: $where) {
      id
    }
  }
`
export const DELETE_ONE_EVENT = gql`
  mutation ($where: EventWhereUniqueInput!) {
    deleteOneEvent(where: $where) {
      id
    }
  }
`
