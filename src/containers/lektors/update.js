import { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useMutation, useQuery } from '@apollo/client'
import Top from '../../components/Top'
import { DELETE_ONE_SPECIALIST, FIND_MANY_SPECIALIST, UPDATE_ONE_SPECIALIST } from '../../gqls/specialist'
import { UPLOAD } from '../../gqls/upload'
const { TextArea } = Input

const UpdateLektor = ({ match, history }) => {
  const { id } = match.params
  const [uploadFile, setUploadFile] = useState(null)

  const { data, loading: loadingSpecialist } = useQuery(FIND_MANY_SPECIALIST, {
    fetchPolicy: 'network-only',
    variables: { where: { id: { equals: id } } },
  })

  const goBack = () => history.goBack()
  const onError = (err) => {
    console.error(err)
    message.error('Не удалось выполнить запрос')
  }

  const [updateOneSpecialist, { loading }] = useMutation(UPDATE_ONE_SPECIALIST, {
    onCompleted: goBack,
    onError,
  })

  const [deleteOneSpecialist, { loading: loadingDel }] = useMutation(DELETE_ONE_SPECIALIST, {
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
    updateOneSpecialist({
      variables: {
        where: { id },
        data: {
          name: { set: update('name') },
          surname: { set: update('surname') },
          email: { set: update('email') },
          description: { set: update('description') },
          avatar: { set: upload },
        },
      },
    })
  }

  const handleUpdate = (values) => {
    if (uploadFile) {
      upload({
        variables: { upload: uploadFile }, //http://80.78.255.38:8000
        onCompleted: (data) => doUpdate(values, 'http://lotusclubmoscow.ru/image/' + data.singleUpload),
        onError: (er) => console.log(er),
      })
    } else {
      doUpdate(values, event.avatar)
    }
  }

  const deleteSpecialist = () => {
    let isRight = window.confirm('Вы уверены, что хотите удалить специалиста?')
    if (isRight) deleteOneSpecialist({ variables: { where: { id } } })
  }

  if (loadingSpecialist) return 'Загрузка...'
  const event = data?.findManySpecialist[0]
  if (!event) return 'Ошибка'
  return (
    <div style={{ maxWidth: 500 }}>
      <Top title='Изменить специалиста' />
      <Form
        onFinish={handleUpdate}
        layout='vertical'
        initialValues={{
          name: event.name,
          surname: event.surname,
          description: event.description,
          email: event.email,
        }}
      >
        <Form.Item className='max-width' name='name' label='Имя'>
          <Input />
        </Form.Item>
        <Form.Item className='max-width' name='surname' label='Фамилия'>
          <Input />
        </Form.Item>
        <Form.Item className='max-width' name='email' label='Почта'>
          <Input />
        </Form.Item>
        <Form.Item name='description' label='Описание'>
          <TextArea rows={6} />
        </Form.Item>
        <Form.Item label='Аватар'>
          <input onChange={getUpload} accept='.png, .jpg, .jpeg' name='myFile' type='file' />
        </Form.Item>
        <div style={{ marginBottom: 20 }}>
          <img src={event.avatar} style={{ width: '100%' }} alt='Изображение' />
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
        <Button danger ghost loading={loading || loadingDel || uploadLoading} onClick={deleteSpecialist} type='primary'>
          Удалить
        </Button>
      </div>
    </div>
  )
}

export default UpdateLektor
