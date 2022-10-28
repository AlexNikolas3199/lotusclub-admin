import { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useMutation } from '@apollo/client'
import Top from '../../components/Top'
import { CREATE_ONE_SPECIALIST } from '../../gqls/specialist'
import { UPLOAD } from '../../gqls/upload'
const { TextArea } = Input

const CreateOneLektor = () => {
  const [event, setEvent] = useState({})
  const [uploadFile, setUploadFile] = useState({})

  const [upload, { loading: loadingUpload }] = useMutation(UPLOAD)

  const getUpload = ({
    target: {
      validity,
      files: [file],
    },
  }) => {
    if (validity.valid) setUploadFile(file)
  }

  const [createOneEvent, { loading }] = useMutation(CREATE_ONE_SPECIALIST, {
    onCompleted: () => (window.location.href = `/lektors`),
    onError: (err) => {
      console.error(err)
      message.error('Не удалось выполнить запрос')
    },
  })

  const handleCreate = () => {
    if (!event.name) return message.warning('Введите имя')
    if (!event.surname) return message.warning('Введите фамилию')
    if (!event.description) return message.warning('Введите описание')
    if (!event.email) return message.warning('Введите почту')
    if (!uploadFile) return message.warning('Загрузите аватар')

    const doCreate = (upload) => createOneEvent({ variables: { data: { ...event, avatar: upload } } })

    upload({
      variables: { upload: uploadFile }, //http://80.78.255.38:8000
      onCompleted: (data) => doCreate('http://lotusclubmoscow.ru/image/' + data.singleUpload),
      onError: (er) => console.log(er),
    })
  }

  if (loading) return null
  return (
    <div style={{ maxWidth: 500 }}>
      <Top title='Создать специалиста' />
      <Form layout='vertical'>
        <Form.Item className='max-width' label='Имя' required>
          <Input onChange={(e) => setEvent({ ...event, name: e.target.value })} />
        </Form.Item>
        <Form.Item className='max-width' label='Фамилия' required>
          <Input onChange={(e) => setEvent({ ...event, surname: e.target.value })} />
        </Form.Item>
        <Form.Item className='max-width' label='Почта' required>
          <Input onChange={(e) => setEvent({ ...event, email: e.target.value })} />
        </Form.Item>
        <Form.Item className='max-width' label='Описание' required>
          <TextArea rows={6} onChange={(e) => setEvent({ ...event, description: e.target.value })} />
        </Form.Item>
        <Form.Item className='max-width' label='Аватар' required>
          <input onChange={getUpload} accept='.png, .jpg, .jpeg' name='myFile' type='file' />
        </Form.Item>
        <Button onClick={handleCreate} loading={loading || loadingUpload} type='primary'>
          Добавить
        </Button>
      </Form>
    </div>
  )
}

export default CreateOneLektor
