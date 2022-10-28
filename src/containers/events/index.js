import { Table } from 'antd'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import Top from '../../components/Top'
import { FIND_MANY_EVENT } from '../../gqls/events'
import { useState } from 'react'
import TodayDate from '../../components/TodayDate'
const limit = 50
const nowDate = new Date()

const Events = () => {
  const [skip, setSkip] = useState(0)

  const { data, loading } = useQuery(FIND_MANY_EVENT, {
    fetchPolicy: 'network-only',
    variables: {
      take: limit,
      skip,
      where: { date: { gt: nowDate.toISOString() } },
    },
  })

  const onChangeTable = (pagination) => setSkip((pagination.current - 1) * limit)
  const events = data ? data?.findManyEvent : []
  const total = data ? data?.findManyEvent.length : 0

  return (
    <>
      <Top title='Мероприятия' action={<Link to='/events/create'>Добавить</Link>} />
      <Table
        dataSource={events}
        loading={loading}
        onChange={onChangeTable}
        pagination={{ total, pageSize: limit }}
        scroll={{ x: 700 }}
        rowKey={(row) => row.id}
        columns={[
          {
            title: 'Название',
            dataIndex: 'title',
            render: (title) => title,
          },
          {
            title: 'Дата',
            dataIndex: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            render: (date) => TodayDate(new Date(date)),
          },
          {
            title: 'Тип',
            dataIndex: 'type',
            sorter: (a, b) => (a.type < b.type ? 1 : -1),
            render: (type) => type,
          },
          {
            title: 'Специалисты',
            dataIndex: 'specialist',
            render: (lektors) => lektors.map((item) => <div key={item.id}>{item.name + ' ' + item.surname}</div>),
          },
          {
            title: 'Действие',
            align: 'center',
            render: (record) => (
              <div>
                <div style={{ marginBottom: 5 }}>
                  <Link to={`/events/update/${record.id}`}>Изменить</Link>
                </div>
                <div>
                  <Link to={`/events/${record.id}`}>Аудитория</Link>
                </div>
              </div>
            ),
          },
        ]}
      />
    </>
  )
}

export default Events
