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
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react' // Para adicionar um ícone
import { cilPlus } from '@coreui/icons' // Ícone de "+"

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const token = useSelector((state) => state.token)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        console.error('Nenhum token disponível')
        setProducts([])
        return
      }

      try {
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
        setProducts([])
      }
    }

    fetchProducts()
  }, [token])

  const handleCreateAd = (productId) => {
    console.log(`Criar propaganda para o produto ID: ${productId}`)
  }

  const handleAddProduct = () => {
    navigate('/resources/products/add')
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <h1>Produtos</h1>
        </CCol>

        {products.length > 0 ? (
          products.map((product) => (
            <CCol xs={12} md={6} lg={4} key={product.id}>
              <CCard className="mb-4" border="success" style={{ height: 'auto' }}>
                <CCardHeader
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <strong>{product.name}</strong>
                </CCardHeader>
                <CCardBody
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {/* Exibição da imagem do produto */}
                  {product.image && (
                    <img
                      src={product.image} // Construa a URL com a imagem
                      alt={product.name}
                      style={{ width: '50%', height: 'auto' }} // Ajuste conforme necessário
                    />
                  )}
                  <CCardTitle>{product.condition === 'used' ? 'Usado' : 'Novo'}</CCardTitle>
                  <CCardText>{product.description}</CCardText>
                  <CCardText>
                    Disponível: <strong>{product.available ? 'Sim' : 'Não'}</strong>
                  </CCardText>
                  <CButton color="primary" size="sm" onClick={() => handleCreateAd(product.id)}>
                    Editar Produto
                  </CButton>
                  <CButton color="secondary" size="sm" onClick={() => handleCreateAd(product.id)}>
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

      {/* FAB - Botão Flutuante */}
      <CButton
        color="success"
        shape="rounded-pill"
        size="lg"
        className="position-fixed bottom-3 end-0 m-4 shadow-lg d-flex align-items-center justify-content-center"
        onClick={handleAddProduct}
        style={{ width: '60px', height: '60px' }}
      >
        <CIcon
          icon={cilPlus}
          size="xxl" // Aumenta o tamanho para simular negrito
          customClassName="text-white" // Classe para branco
        />{' '}
      </CButton>
    </>
  )
}

export default Dashboard
