import { v4 as uuidv4 } from "uuid";
import styles from "./Project.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../layout/Loading";
import Container from "../layout/Conteiner";
import ProjectForm from "../project/ProjectForm";
import Message from "../layout/Message";
import ServiceForm from "../service/ServiceForm";
import ServiceCard from "../service/ServiceCard";

function Project() {
    const { id } = useParams();

    const [project, setProject] = useState([]);
    const [services, setServices] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/projects/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data);
            setServices(data.services);
        })
        .catch((err) => console.log(err));
    }, [id]);

    function editPost(project) {
        setMessage("");
        // validação de orçamento
        if (project.budget < project.orcaFacil) {
            setMessage("O orçamento não pode ser menor que o custo do projeto!");
            setType("error");
            return false;
        }

        fetch(`${process.env.REACT_APP_API_URL}/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data);
            setShowProjectForm(!showProjectForm);
            setMessage('Projeto atualizado!');
            setType('success');
        })
        .catch((err) => console.log(err));
    }

    function createService(project) {
        setMessage("");
        // último serviço
        const lastService = project.services[project.services.length - 1];
        lastService.id = uuidv4();

        const lastServiceOrcaFacil = lastService.orcaFacil;
        const newOrcaFacil = parseFloat(project.orcaFacil) + parseFloat(lastServiceOrcaFacil);

        // validação de valor máximo
        if (newOrcaFacil > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço!');
            setType('error');
            project.services.pop();
            return false;
        }
        // adicionar custo do serviço ao total do projeto
        project.orcaFacil = newOrcaFacil;

        // atualizar projeto
        fetch(`${process.env.REACT_APP_API_URL}/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data);
            setShowServiceForm(!showServiceForm);
            setMessage('Serviço adicionado!');
            setType('success');
        })
        .catch((err) => console.log(err));
    }

    function removeServices(id, orcaFacil) {
        const serviceUpdate = project.services.filter(
            (service) => service.id !== id
        );

        const projectUpdate = { ...project };
        projectUpdate.services = serviceUpdate;
        projectUpdate.orcaFacil = parseFloat(projectUpdate.orcaFacil) - parseFloat(orcaFacil);

        fetch(`${process.env.REACT_APP_API_URL}/projects/${projectUpdate.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectUpdate),
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(projectUpdate);
            setServices(serviceUpdate);
            setMessage('Serviço removido com sucesso!');
            setType('success');
        })
        .catch((err) => console.log(err));
    }

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm);
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm);
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message} />}
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? "Editar Projeto" : "Fechar"}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total de Orçamento:</span> R$ {project.budget}
                                    </p>
                                    <p>
                                        <span>Total Utilizado:</span> R$ {project.orcaFacil}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm handleSubmit={editPost} btnText="Concluir Edição" projectData={project} />
                                </div>
                            )}
                        </div>
                        <div className={styles.service_form_container}>
                            <h2>Adicione um serviço:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? "Adicionar serviço" : "Fechar"}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm
                                        handleSubmit={createService}
                                        btnText="Adicionar Serviço"
                                        projectData={project}
                                    />
                                )}
                            </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass="start">
                            {services.length > 0 &&
                                services.map((service) => (
                                    <ServiceCard
                                        id={service.id}
                                        name={service.name}
                                        orcaFacil={service.orcaFacil}
                                        description={service.description}
                                        key={service.id}
                                        handleRemove={removeServices}
                                    />
                                ))
                            }
                            {services.length === 0 && <p>Não há serviços cadastrados.</p>}
                        </Container>
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}

export default Project;
