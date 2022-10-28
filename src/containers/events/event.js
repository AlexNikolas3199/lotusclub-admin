import { Table } from 'antd'
import { useQuery } from '@apollo/client'
import Top from '../../components/Top'
import { FIND_MANY_EVENT } from '../../gqls/events'
import TodayDate from '../../components/TodayDate'

const Event = ({ match }) => {
  const { id } = match.params
  const { data, loading } = useQuery(FIND_MANY_EVENT, {
    fetchPolicy: 'network-only',
    variables: { where: { id: { equals: id } } },
  })

  if (loading) return null
  const event = data.findManyEvent[0]
  return (
    <>
      <Top title='Аудитория' />
      <div>
        <div>
          Мероприятие: <b>{event.title}</b>
        </div>
        <div>
          Дата: <b>{TodayDate(new Date(event.date))}</b>
        </div>
        <div style={{ marginBottom: 20 }}>
          Тип: <b>{event.type}</b>
        </div>
      </div>
      <Table
        dataSource={event.busy}
        scroll={{ x: 700 }}
        rowKey={(row) => row.id}
        columns={[
          {
            title: 'Пользователь',
            dataIndex: 'user',
            render: (user) => user.name + ' ' + user.surname,
          },
          {
            title: 'Номер телефона',
            dataIndex: 'user',
            render: (user) => user.tel,
          },
          {
            title: 'Почта',
            dataIndex: 'user',
            render: (user) => user.email,
          },
        ]}
      />
    </>
  )
}

export default Event
