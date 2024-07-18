import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Message from "../layout/Message";
import Container from "../layout/Container"; // Corrigido para "Container" em vez de "Conteiner"
import Loading from "../layout/Loading";
import LinkButton from "../layout/LinkButton";
import ProjectCard from "../project/ProjectCard";

import styles from "./Projects.module.css";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [projectMessage, setProjectMessage] = useState('');

    const location = useLocation();
    let message = '';
    if (location.state) {
        message = location.state.message;
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/projects`, { // Alterado para usar variável de ambiente
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
            setProjects(data);
            setRemoveLoading(true);
        })
        .catch((err) => console.log(err));
    }, []);

    function removeProject(id) {
        fetch(`${process.env.REACT_APP_API_URL}/projects/${id}`, { // Alterado para usar variável de ambiente
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(() => {
            setProjects(projects.filter((project) => project.id !== id));
            setProjectMessage("Projeto removido com sucesso!");
        })
        .catch((err) => console.log(err));
    }

    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Projects</h1>
                <LinkButton to="/newproject" text="Criar Projeto" />
            </div>
            {message && <Message type="success" msg={message} />}
            {projectMessage && <Message type="success" msg={projectMessage} />}
            <Container customClass="start"> {/* Corrigido para "Container" */}
                {projects.length > 0 &&
                    projects.map((project) => (
                        <ProjectCard
                            id={project.id}
                            name={project.name}
                            budget={project.budget}
                            category={project.category ? project.category.name : "No Category"}
                            key={project.id}
                            handleRemove={removeProject}
                        />
                    ))}
                {!removeLoading && <Loading />}
                {removeLoading && projects.length === 0 && (
                    <p>Não há projetos cadastrados!</p>
                )}
            </Container>
        </div>
    );
}

export default Projects;
