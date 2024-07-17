import { useNavigate } from 'react-router-dom';
import ProjectForm from "../project/ProjectForm";
import styles from "./NewProject.module.css";

function NewProject() {
    const history = useNavigate();

    function createPost(project) {
        // Initialize OrçaFácil and services
        project.orcaFacil = 0;
        project.services = [];

        fetch("http://localhost:5000/projects", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(project),
        })
        .then(resp => resp.json())
        .then(data => {
            // console.log(data);
            // Redirect
            history("/projects", { state: { message: "Projeto criado com Sucesso!" } });
        })
        .catch(err => console.log(err));
    }

    return (
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie seu projeto para depois adicionar os serviços</p>
            <ProjectForm handleSubmit={createPost} btnText="Criar Projeto" />
        </div>
    );
}

export default NewProject;
