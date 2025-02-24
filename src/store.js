import { legacy_createStore as createStore, applyMiddleware } from 'redux'
import axios from 'axios'
import { thunk } from 'redux-thunk' // Corrigindo a importação

// Estado inicial
const initialState = {
  sidebarShow: true,
  theme: 'light',
  isAuthenticated: !!localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY), // Verifica se o token existe e não é vazio
  token: localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY) || '',
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

// Ação para atualizar o estado de autenticação
export const setAuthenticated = (isAuthenticated, token = '') => {
  // Salva o token no localStorage, se fornecido
  if (token) {
    localStorage.setItem(import.meta.env.VITE_TOKEN_STORAGE_KEY, token)
  }

  return {
    type: 'set',
    isAuthenticated,
    token, // Adicionando o token à ação
  }
}

// Ação assíncrona para verificar a validade do token
export const checkTokenValidity = () => async (dispatch) => {
  const token = localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY)

  if (!token) {
    dispatch(setAuthenticated(false)) // Caso não haja token
    return false
  }

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Se a resposta for bem-sucedida, o token é válido
    dispatch(setAuthenticated(true, token)) // Atualiza com o token válido
    return true
  } catch (error) {
    // Se houver erro, remove o token e marca como não autenticado
    localStorage.removeItem(import.meta.env.VITE_TOKEN_STORAGE_KEY)
    dispatch(setAuthenticated(false))
    return false
  }
}

// Criando a store com o middleware redux-thunk
const store = createStore(changeState, applyMiddleware(thunk))

export default store
