import { Table } from 'antd'
import { useQuery } from '@apollo/client'
import Top from '../../components/Top'
import TodayDate from '../../components/TodayDate'
import { FIND_MANY_USER_BUSY } from '../../gqls/users'

const User = ({ match }) => {
  const { id } = match.params
  const { data, loading } = useQuery(FIND_MANY_USER_BUSY, {
    fetchPolicy: 'network-only',
    variables: { where: { id } },
  })

  if (loading) return null
  const user = data?.findUniqueUser
  if (!user) return null
  return (
    <>
      <Top title={`Пользователь: ${user.name} ${user.surname}`} />
      <div>
        <div>
          Номер телефона: <b>{user.tel}</b>
        </div>
        <div>
          Почта: <b>{user.email}</b>
        </div>
        <div style={{ marginTop: 10, marginBottom: 15 }}>Записи:</div>
      </div>
      <Table
        dataSource={user.busy}
        scroll={{ x: 700 }}
        rowKey={(row) => row.id}
        columns={[
          {
            title: 'Название',
            dataIndex: 'event',
            render: (event) => event.title,
          },
          {
            title: 'Дата',
            sorter: (a, b) => new Date(a.event.date) - new Date(b.event.date),
            render: (busy) => TodayDate(new Date(busy.event.date)),
          },
          {
            title: 'Тип',
            sorter: (a, b) => (a.event.type < b.event.type ? 1 : -1),
            render: (busy) => busy.event.type,
          },
          {
            title: 'Специалисты',
            dataIndex: 'event',
            render: (event) => event.specialist.map((item) => <div key={item.id}>{item.name + ' ' + item.surname}</div>),
          },
        ]}
      />
    </>
  )
}

export default User
