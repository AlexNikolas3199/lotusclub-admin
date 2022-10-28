import { Table } from 'antd'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import Top from '../../components/Top'
import { useState } from 'react'
import { FIND_MANY_USER } from '../../gqls/users'
const limit = 50

const Users = () => {
  const [skip, setSkip] = useState(0)

  const { data, loading } = useQuery(FIND_MANY_USER, {
    fetchPolicy: 'network-only',
    variables: {
      take: limit,
      skip,
    },
  })

  const onChangeTable = (pagination) => setSkip((pagination.current - 1) * limit)
  const users = data ? data?.findManyUser : []
  const total = data ? data?.findManyUser.length : 0

  return (
    <>
      <Top title='Пользователи' />
      <Table
        dataSource={users}
        loading={loading}
        onChange={onChangeTable}
        pagination={{ total, pageSize: limit }}
        scroll={{ x: 700 }}
        rowKey={(row) => row.id}
        columns={[
          {
            title: 'Пользователь',
            render: (user) => user.name + ' ' + user.surname,
          },
          {
            title: 'Номер телефона',
            dataIndex: 'tel',
            render: (tel) => tel,
          },
          {
            title: 'Почта',
            dataIndex: 'email',
            render: (email) => email,
          },
          {
            title: 'Действие',
            align: 'center',
            render: (record) => <Link to={`/users/${record.id}`}>Записи</Link>,
          },
        ]}
      />
    </>
  )
}

export default Users
