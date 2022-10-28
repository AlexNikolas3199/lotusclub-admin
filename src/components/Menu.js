import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { Menu } from 'antd'
import { HomeOutlined, HistoryOutlined, TeamOutlined, UserOutlined, SolutionOutlined } from '@ant-design/icons'

const MenuComponent = () => {
  const { pathname } = window.location
  const items = [
    {
      key: '/',
      label: (
        <MenuLink to={`/`}>
          <HomeOutlined style={{ marginRight: 8 }} />
          Главная
        </MenuLink>
      ),
    },
    {
      key: '/events',
      label: (
        <MenuLink to={`/events`}>
          <SolutionOutlined style={{ marginRight: 8 }} />
          Мероприятия
        </MenuLink>
      ),
    },
    {
      key: '/lektors',
      label: (
        <MenuLink to={`/lektors`}>
          <UserOutlined style={{ marginRight: 8 }} />
          Специалисты
        </MenuLink>
      ),
    },
    {
      key: '/users',
      label: (
        <MenuLink to={`/users`}>
          <TeamOutlined style={{ marginRight: 8 }} />
          Пользователи
        </MenuLink>
      ),
    },
    {
      key: '/history',
      label: (
        <MenuLink to={`/history`}>
          <HistoryOutlined style={{ marginRight: 8 }} />
          История
        </MenuLink>
      ),
    },
  ]
  return <Menu theme='dark' mode='inline' defaultSelectedKeys={[pathname]} items={items} />
}

const MenuLink = styled(NavLink)`
  display: flex;
  flex-direction: row;
  align-items: center;
  a {
    color: white;
  }
`

export default MenuComponent
