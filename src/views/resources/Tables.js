import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCardText,
  CCol,
  CRow,
  CButton,
} from '@coreui/react'
import { useSelector } from 'react-redux' // Adicionado para acessar o estado do Redux

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const token = useSelector((state) => state.token) // Pega o token do estado global

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!token) {
          console.error('Nenhum token disponível')
          return
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/product/`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`)
        }

        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      }
    }

    fetchProducts()
  }, [token]) // Adicionando 'token' como dependência

  const handleCreateAd = (productId) => {
    console.log(`Criar propaganda para o produto ID: ${productId}`)
    // Implemente a lógica real aqui
  }

  return (
    <CRow>
      <CCol xs={12}>
        <h1>Produtos</h1>
      </CCol>

      {products.length > 0 ? (
        products.map((product) => (
          <CCol xs={12} md={6} lg={4} key={product.id}>
            <CCard className="mb-4" border="success">
              <CCardHeader>
                <strong>{product.name}</strong>
              </CCardHeader>
              <CCardBody>
                <CCardTitle>{product.condition === 'used' ? 'Usado' : 'Novo'}</CCardTitle>
                <CCardText>{product.description}</CCardText>
                <CCardText>
                  Disponível: <strong>{product.available ? 'Sim' : 'Não'}</strong>
                </CCardText>
                <CButton color="primary" size="sm" onClick={() => handleCreateAd(product.id)}>
                  Criar Propaganda
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        ))
      ) : (
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <CCardText>Nenhum produto encontrado.</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      )}
    </CRow>
  )
}

export default Dashboard
