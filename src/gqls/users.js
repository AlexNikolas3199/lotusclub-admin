import { gql } from '@apollo/client'

export const FIND_MANY_USER = gql`
  query {
    findManyUser {
      id
      name
      surname
      email
      tel
    }
  }
`
export const FIND_MANY_USER_BUSY = gql`
  query ($where: UserWhereUniqueInput!) {
    findUniqueUser(where: $where) {
      id
      name
      surname
      tel
      email
      busy {
        id
        event {
          id
          date
          title
          type
          description
          specialist {
            id
            name
            surname
            email
          }
        }
      }
    }
  }
`
