import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setAuthenticated } from '../store.js'

const PrivateRoute = ({ element, redirectTo = '/login', ...rest }) => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state) => state.isAuthenticated)
  const token = useSelector((state) => state.token) // Pega o token do estado global

  useEffect(() => {
    // Verifica se o token está presente e válido
    const verifyToken = async () => {
      try {
        const response = await axios.get('http://localhost:8989/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.status === 200) {
          dispatch(setAuthenticated(true, token)) // Atualiza o estado se o token for válido
        } else {
          dispatch(setAuthenticated(false)) // Atualiza o estado se o token for inválido
        }
      } catch (err) {
        dispatch(setAuthenticated(false)) // Em caso de erro, marca como não autenticado
      }
    }

    if (token) {
      verifyToken()
    } else {
      dispatch(setAuthenticated(false)) // Se não houver token, marca como não autenticado
    }
  }, [dispatch, token])

  return isAuthenticated ? React.cloneElement(element, rest) : <Navigate to={redirectTo} replace />
}

export default React.memo(PrivateRoute)
