import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
  CFormCheck,
  CRow,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

const EditProduct = () => {
  const location = useLocation()
  const product = location.state?.product // Aqui você acessa os dados passados

  const [formData, setFormData] = useState(product)

  const token = useSelector((state) => state.token) // Token do estado global
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked ? 1 : 0 })
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] || null }) // Pega o primeiro arquivo
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      console.error('Nenhum token disponível')
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('_method', 'PUT')
    formDataToSend.append('name', formData.name)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('condition', formData.condition)
    formDataToSend.append('available', formData.available)

    if (formData.image) {
      formDataToSend.append('image', formData.image)
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/product/${formData.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend, // Envia como FormData por causa do arquivo
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      const data = await response.json()
      navigate('/resources/products') // Volta para o dashboard após sucesso
    } catch (error) {
      console.error('Erro ao criar produto:', error)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <h1>Editar Produto</h1>
      </CCol>

      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {/* Campo Nome */}
              <div className="mb-3">
                <CFormLabel htmlFor="productName">Nome do Produto</CFormLabel>
                <CFormInput
                  type="text"
                  id="productName"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Digite o nome do produto"
                  required
                />
              </div>

              {/* Campo Descrição */}
              <div className="mb-3">
                <CFormLabel htmlFor="productDescription">Descrição</CFormLabel>
                <CFormTextarea
                  id="productDescription"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Digite a descrição do produto"
                  required
                />
              </div>

              {/* Campo Condição */}
              <div className="mb-3">
                <CFormLabel htmlFor="productCondition">Condição</CFormLabel>
                <CFormSelect
                  id="productCondition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  <option value="used">Usado</option>
                  <option value="new">Novo</option>
                </CFormSelect>
              </div>

              {/* Campo Disponível */}
              <div className="mb-3">
                <CFormCheck
                  id="productAvailable"
                  name="available"
                  checked={formData.available === 1}
                  onChange={handleChange}
                  label="Disponível"
                />
              </div>

              {/* Campo Imagem */}
              <div className="mb-3">
                <CFormLabel htmlFor="productImage">Imagem</CFormLabel>
                <div className="d-flex align-items-center">
                  <CFormInput
                    type="file"
                    id="productImage"
                    name="image"
                    onChange={handleChange}
                    accept="image/*" // Aceita apenas imagens
                  />
                  {formData.image && (
                    <img
                      src={
                        typeof formData.image === 'string'
                          ? formData.image
                          : URL.createObjectURL(formData.image)
                      }
                      alt="Imagem atual do produto"
                      style={{ maxWidth: '100px', marginLeft: '10px' }}
                    />
                  )}
                </div>
              </div>

              {/* Botão de Envio */}
              <div className="d-grid">
                <CButton type="submit" color="primary">
                  Salvar Alterações
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditProduct
