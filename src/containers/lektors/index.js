import { Table } from 'antd'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import Top from '../../components/Top'
import { useState } from 'react'
import { FIND_MANY_SPECIALIST } from '../../gqls/specialist'
const limit = 50

const Lektors = () => {
  const [skip, setSkip] = useState(0)

  const { data, loading } = useQuery(FIND_MANY_SPECIALIST, {
    fetchPolicy: 'network-only',
    variables: { take: limit, skip },
  })

  const onChangeTable = (pagination) => setSkip((pagination.current - 1) * limit)
  const total = data ? data?.findManySpecialist.length : 0

  if (loading) return null
  const specialists = data.findManySpecialist
  return (
    <>
      <Top title='Специалисты' action={<Link to='/lektors/create'>Добавить</Link>} />
      <Table
        dataSource={specialists}
        loading={loading}
        onChange={onChangeTable}
        pagination={{ total, pageSize: limit }}
        scroll={{ x: 700 }}
        rowKey={(row) => row.id}
        columns={[
          {
            title: 'Специалист',
            render: (item) => item.name + ' ' + item.surname,
          },
          {
            title: 'Почта',
            dataIndex: 'email',
            render: (email) => email,
          },
          {
            title: 'Действие',
            align: 'center',
            render: (record) => <Link to={`/lektors/update/${record.id}`}>Изменить</Link>,
          },
        ]}
      />
    </>
  )
}

export default Lektors
