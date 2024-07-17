import { useNavigate } from 'react-router-dom';
import ProjectForm from "../project/ProjectForm";
import styles from "./NewProject.module.css";

function NewProject() {
    const history = useNavigate(); // Hook para navegação

    // Função para criar um novo projeto
    function createPost(project) {
        // Inicializa OrçaFácil e serviços
        project.orcaFacil = 0;
        project.services = [];

        // Requisição para criar o projeto na API
        fetch("http://localhost:5000/projects", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(project), // Converte o objeto 'project' para JSON
        })
        .then(resp => resp.json()) // Converte a resposta para JSON
        .then(data => {
            // Redireciona para a página de projetos com uma mensagem de sucesso
            history("/projects", { state: { message: "Projeto criado com Sucesso!" } });
        })
        .catch(err => console.log(err)); // Trata erros de requisição
    }

    return (
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie seu projeto para depois adicionar os serviços</p>
            {/* Componente ProjectForm para criar um novo projeto */}
            <ProjectForm handleSubmit={createPost} btnText="Criar Projeto" />
        </div>
    );
}

export default NewProject;
