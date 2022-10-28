import { useState } from 'react'
import { Button, Form, Input, message, Dropdown, Menu, DatePicker, Select } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@apollo/client'
import Top from '../../components/Top'
import { DELETE_ONE_EVENT, FIND_MANY_EVENT, UPDATE_ONE_EVENT } from '../../gqls/events'
import { UPLOAD } from '../../gqls/upload'
import moment from 'moment'
import { FIND_MANY_SPECIALIST } from '../../gqls/specialist'
const { Option } = Select
const { TextArea } = Input
const types = [
  { key: 'SERVICE', label: 'SERVICE' },
  { key: 'TRAINING', label: 'TRAINING' },
]

const UpdateEvent = ({ match, history }) => {
  const { id } = match.params
  const [type, setType] = useState(null)
  const [specialist, setSpecialist] = useState([])
  const [uploadFile, setUploadFile] = useState(null)

  const { data, loading: loadingEvent } = useQuery(FIND_MANY_EVENT, {
    fetchPolicy: 'network-only',
    variables: {
      where: { id: { equals: id } },
    },
    onCompleted: (data) => {
      setType(data?.findManyEvent[0]?.type)
      setSpecialist(data?.findManyEvent[0]?.specialist.map((i) => i.id))
    },
  })

  const { data: dataSpecialist, loading: loadingSpecialist } = useQuery(FIND_MANY_SPECIALIST, { fetchPolicy: 'network-only' })

  const goBack = () => history.goBack()
  const onError = (err) => {
    console.error(err)
    message.error('Не удалось выполнить запрос')
  }

  const [updateOneEvent, { loading }] = useMutation(UPDATE_ONE_EVENT, {
    onCompleted: goBack,
    onError,
  })

  const [deleteOneEvent, { loading: loadingDel }] = useMutation(DELETE_ONE_EVENT, {
    onCompleted: goBack,
    onError,
  })

  const [upload, { loading: uploadLoading }] = useMutation(UPLOAD)
  const getUpload = ({
    target: {
      validity,
      files: [file],
    },
  }) => {
    if (validity.valid) setUploadFile(file)
  }

  const doUpdate = (values, upload) => {
    const update = (val) => (values[val] ? values[val] : event[val])
    updateOneEvent({
      variables: {
        where: { id },
        data: {
          date: { set: update('date') },
          title: { set: update('title') },
          description: { set: update('description') },
          type: { set: type },
          specialist: { set: specialist.map((id) => ({ id })) },
          image: { set: upload },
        },
      },
    })
  }

  const handleUpdate = (values) => {
    if (uploadFile) {
      upload({
        variables: { upload: uploadFile }, //http://80.78.255.38:8000
        onCompleted: (data) => {
          doUpdate(values, 'http://lotusclubmoscow.ru/image/' + data.singleUpload)
        },
        onError: (er) => console.log(er),
      })
    } else {
      doUpdate(values, event.image)
    }
  }

  const deleteEvent = () => {
    let isRight = window.confirm('Вы уверены, что хотите удалить данные?')
    if (isRight) deleteOneEvent({ variables: { where: { id } } })
  }

  const menu = <Menu onClick={(e) => setType(types.find((i) => i.key === e?.key).key)} items={types} />

  if (loadingEvent || loadingSpecialist) return 'Загрузка...'
  if (!data.findManyEvent.length || !dataSpecialist) return 'Ошибка'
  const event = data?.findManyEvent[0]
  const specialists = dataSpecialist?.findManySpecialist

  return (
    <div style={{ maxWidth: 500 }}>
      <Top title='Изменить мероприятие' />
      <Form
        onFinish={handleUpdate}
        layout='vertical'
        initialValues={{
          title: event.title,
          description: event.description,
          date: moment(event.date),
          type: type,
        }}
      >
        <Form.Item className='max-width' name='title' label='Название'>
          <Input />
        </Form.Item>
        <Form.Item name='date' label='Дата отплытия'>
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label='Тип'>
          <Dropdown overlay={menu}>
            <Button>
              {type} <DownOutlined />
            </Button>
          </Dropdown>
        </Form.Item>
        <Form.Item name='description' label='Описание'>
          <TextArea rows={6} />
        </Form.Item>
        <Select defaultValue={specialist} placeholder='Выберите специалистов' mode='multiple' className='select' onChange={(i) => setSpecialist(i)}>
          {specialists.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name + ' ' + item.surname}
            </Option>
          ))}
        </Select>
        <Form.Item label='Изображение'>
          <input onChange={getUpload} accept='.png, .jpg, .jpeg' name='myFile' type='file' />
        </Form.Item>
        <div style={{ marginBottom: 20 }}>
          <img src={event.image} style={{ width: '100%' }} alt='Изображение' />
          <div>
            <i>Текущее изображение</i>
          </div>
        </div>
        <Button htmlType='submit' loading={loading || loadingDel || uploadLoading} type='primary'>
          Изменить
        </Button>
      </Form>
      <div style={{ paddingTop: 30 }}>
        <hr />
        <Button danger ghost loading={loading || loadingDel || uploadLoading} onClick={deleteEvent} type='primary'>
          Удалить
        </Button>
      </div>
    </div>
  )
}

export default UpdateEvent
