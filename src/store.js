import { legacy_createStore as createStore, applyMiddleware } from 'redux'
import axios from 'axios'
import { thunk } from 'redux-thunk' // Corrigindo a importa��o

// Estado inicial
const initialState = {
  sidebarShow: true,
  theme: 'light',
  isAuthenticated: !!localStorage.getItem('accessToken'), // Verifica se o token existe e n�o � vazio
  token: localStorage.getItem('accessToken') || '',
}

// Redutor para gerenciar o estado global
const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

// A��o para atualizar o estado de autentica��o
export const setAuthenticated = (isAuthenticated, token = '') => {
  // Salva o token no localStorage, se fornecido
  if (token) {
    localStorage.setItem('accessToken', token)
  }

  return {
    type: 'set',
    isAuthenticated,
    token, // Adicionando o token � a��o
  }
}

// A��o ass�ncrona para verificar a validade do token
export const checkTokenValidity = () => async (dispatch) => {
  const token = localStorage.getItem('accessToken')

  if (!token) {
    dispatch(setAuthenticated(false)) // Caso n�o haja token
    return false
  }

  try {
    const response = await axios.get('http://localhost:8989/api/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Se a resposta for bem-sucedida, o token � v�lido
    dispatch(setAuthenticated(true, token)) // Atualiza com o token v�lido
    return true
  } catch (error) {
    // Se houver erro, remove o token e marca como n�o autenticado
    localStorage.removeItem('accessToken')
    dispatch(setAuthenticated(false))
    return false
  }
}

// Criando a store com o middleware redux-thunk
const store = createStore(changeState, applyMiddleware(thunk))

export default store
