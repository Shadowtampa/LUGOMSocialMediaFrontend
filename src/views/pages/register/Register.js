import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

import { useNavigate } from 'react-router-dom' // Adicionado
import { useDispatch } from 'react-redux' // Adicionado
import { setAuthenticated } from '../../../store.js'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const [toast, setToast] = useState(null)
  const navigate = useNavigate() // Adicionado
  const dispatch = useDispatch() // Adicionado

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Função para fazer login após registro bem-sucedido
  const handleLoginAfterRegister = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const { plainTextToken } = data.token
        dispatch(setAuthenticated(true, plainTextToken))
        navigate('/dashboard')
      } else {
        throw new Error('Falha no login automático')
      }
    } catch (err) {
      setToast(
        <CToast autohide={true} visible={true} color="danger">
          <div className="d-flex">
            <CToastBody>Erro ao fazer login automático</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>,
      )
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setToast(
          <CToast autohide={true} visible={true} color="success">
            <div className="d-flex">
              <CToastBody>Conta criada com sucesso!</CToastBody>
              <CToastClose className="me-2 m-auto" white />
            </div>
          </CToast>,
        )

        // Após registro bem-sucedido, faz login automaticamente
        await handleLoginAfterRegister(formData.email, formData.password)
      } else {
        setToast(
          <CToast autohide={true} visible={true} color="danger">
            <div className="d-flex">
              <CToastBody>Erro ao criar conta: {data.message || 'Tente novamente'}</CToastBody>
              <CToastClose className="me-2 m-auto" white />
            </div>
          </CToast>,
        )
      }
    } catch (error) {
      setToast(
        <CToast autohide={true} visible={true} color="danger">
          <div className="d-flex">
            <CToastBody>Erro ao conectar ao servidor</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>,
      )
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CToaster push={toast} placement="top-end" />
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Cadastro</h1>
                  <p className="text-body-secondary">Crie sua conta</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Nome de usuário"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="username"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="E-mail"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Senha"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repita a senha"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton type="submit" color="success">
                      Criar Conta
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
