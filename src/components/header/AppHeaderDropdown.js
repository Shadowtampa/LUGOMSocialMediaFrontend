import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setAuthenticated } from '../../store'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()

  // Função para realizar a chamada de logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY) // Pega o token do localStorage

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.status === 200) {
        // Se a resposta for bem-sucedida, limpa o token do localStorage e atualiza o estado
        localStorage.removeItem('accessToken')
        dispatch(setAuthenticated(false)) // Atualiza o estado no Redux
        window.location.href = '/login' // Redireciona para a página de login
      }
    } catch (err) {
      console.error('Logout failed', err)
      // Aqui você pode adicionar tratamento de erro, exibir uma mensagem de erro, etc.
    }
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem href="#" className="text-danger btn-danger" onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
