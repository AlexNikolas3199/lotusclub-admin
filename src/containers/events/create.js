import { useState } from 'react'
import { Button, Form, Input, message, Dropdown, Menu, DatePicker, Select } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@apollo/client'
import Top from '../../components/Top'
import { CREATE_ONE_EVENT } from '../../gqls/events'
import { UPLOAD } from '../../gqls/upload'
import { FIND_MANY_SPECIALIST } from '../../gqls/specialist'
const { Option } = Select
const { TextArea } = Input
const types = [
  { key: 'SERVICE', label: 'SERVICE' },
  { key: 'TRAINING', label: 'TRAINING' },
]

const CreateOneEvent = () => {
  const [event, setEvent] = useState({})
  const [specialist, setSpecialists] = useState({})
  const [uploadFile, setUploadFile] = useState({})

  const { data, loading: loadingSpecialist } = useQuery(FIND_MANY_SPECIALIST, {
    fetchPolicy: 'network-only',
  })

  const [upload, { loading: loadingUpload }] = useMutation(UPLOAD)

  const menu = <Menu onClick={(e) => setEvent({ ...event, type: types.find((i) => i.key === e?.key).key })} items={types} />

  const getUpload = ({
    target: {
      validity,
      files: [file],
    },
  }) => {
    if (validity.valid) setUploadFile(file)
  }

  const [createOneEvent, { loading }] = useMutation(CREATE_ONE_EVENT, {
    onCompleted: () => {
      window.location.href = `/events`
    },
    onError: (err) => {
      console.error(err)
      message.error('Не удалось выполнить запрос')
    },
  })

  const handleCreate = () => {
    if (!event.title) return message.warning('Введите название')
    if (!event.description) return message.warning('Введите описание')
    if (!event.date) return message.warning('Введите дату')
    if (!event.type) return message.warning('Выберите тип')
    if (!uploadFile) return message.warning('Загрузите изображение')
    const doCreate = (upload) =>
      createOneEvent({
        variables: { data: { ...event, specialist: { connect: specialist.map((id) => ({ id })) }, image: upload } },
      })
    upload({
      variables: { upload: uploadFile }, //http://80.78.255.38:8000
      onCompleted: (data) => doCreate('http://lotusclubmoscow.ru/image/' + data.singleUpload),
      onError: (er) => console.log(er),
    })
  }

  if (loadingSpecialist) return '...Загрузка'
  if (!data.findManySpecialist.length) return 'Ошибка'
  return (
    <div style={{ maxWidth: 500 }}>
      <Top title='Создать мероприятие' />
      <Form layout='vertical'>
        <Form.Item className='max-width' label='Название' required>
          <Input onChange={(e) => setEvent({ ...event, title: e.target.value })} />
        </Form.Item>
        <Form.Item className='max-width' label='Дата' required>
          <DatePicker showTime onChange={(date) => setEvent({ ...event, date: date.toISOString() })} />
        </Form.Item>
        <Form.Item className='max-width' label='Тип' required>
          <Dropdown overlay={menu}>
            <Button>
              {event.type ? event.type : 'Выберите тип'} <DownOutlined />
            </Button>
          </Dropdown>
        </Form.Item>
        <Form.Item className='max-width' label='Описание' required>
          <TextArea rows={6} onChange={(e) => setEvent({ ...event, description: e.target.value })} />
        </Form.Item>
        <Select placeholder='Выберите специалистов' mode='multiple' className='select' onChange={(i) => setSpecialists(i)}>
          {data?.findManySpecialist.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name + ' ' + item.surname}
            </Option>
          ))}
        </Select>
        <Form.Item className='max-width' label='Изображение' required>
          <input onChange={getUpload} accept='.png, .jpg, .jpeg' name='myFile' type='file' />
        </Form.Item>
        <Button onClick={handleCreate} loading={loading || loadingUpload} type='primary'>
          Добавить
        </Button>
      </Form>
    </div>
  )
}

export default CreateOneEvent
