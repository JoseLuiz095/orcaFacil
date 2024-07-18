import { useState, useEffect } from 'react'
import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'

import styles from './ProjectForm.module.css'

function ProjectForm({ handleSubmit, btnText, projectData }) {
  // Estado para armazenar os dados do projeto
  const [project, setProject] = useState(projectData || {})
  // Estado para armazenar as categorias disponíveis
  const [categories, setCategories] = useState([])

  // Efeito para carregar as categorias disponíveis ao montar o componente
  useEffect(() => {
    fetch('http://localhost:5000/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setCategories(data)
      })
  }, [])

  // Função para lidar com o envio do formulário
  const submit = (e) => {
    e.preventDefault()
    handleSubmit(project) // Chama a função handleSubmit passando os dados do projeto
  }

  // Função para lidar com a mudança nos inputs do formulário
  function handleChange(e) {
    setProject({ ...project, [e.target.name]: e.target.value })
  }

  // Função para lidar com a mudança na seleção da categoria
  function handleCategory(e) {
    // Atualiza o estado do projeto incluindo a categoria selecionada
    setProject({
      ...project,
      category: {
        id: e.target.value,
        name: e.target.options[e.target.selectedIndex].text,
      },
    })
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      {/* Componente Input para o nome do projeto */}
      <Input
        type="text"
        text="Nome do projeto"
        name="name"
        placeholder="Insira o nome do projeto"
        handleOnChange={handleChange} // Função para lidar com mudanças no input
        value={project.name} // Valor do input
      />
      {/* Componente Input para o orçamento do projeto */}
      <Input
        type="number"
        text="Orçamento do projeto"
        name="budget"
        placeholder="Insira o orçamento total"
        handleOnChange={handleChange} // Função para lidar com mudanças no input
        value={project.budget} // Valor do input
      />
      {/* Componente Select para selecionar a categoria do projeto */}
      <Select
        name="category_id"
        text="Selecione a categoria"
        options={categories} // Opções de categorias disponíveis
        handleOnChange={handleCategory} // Função para lidar com mudanças na seleção
        value={project.category ? project.category.id : ''} // Valor selecionado
      />
      {/* Botão de submit do formulário */}
      <SubmitButton text={btnText} />
    </form>
  )
}

export default ProjectForm
