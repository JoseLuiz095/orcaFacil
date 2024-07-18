useEffect(() => {
    fetch('http://localhost:3000/api/projects/' + id, {
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
    if (project.budget < project.orcaFacil) {
      setMessage("O orçamento não pode ser menor que o custo do projeto!");
      setType("error");
      return false;
    }
  
    fetch('http://localhost:3000/api/projects/' + project.id, {
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
    const lastService = project.services[project.services.length - 1];
    lastService.id = uuidv4();
  
    const lastServiceOrcaFacil = lastService.orcaFacil;
    const newOrcaFacil = parseFloat(project.orcaFacil) + parseFloat(lastServiceOrcaFacil);
  
    if (newOrcaFacil > parseFloat(project.budget)) {
      setMessage('Orçamento ultrapassado, verifique o valor do serviço!');
      setType('error');
      project.services.pop();
      return false;
    }
  
    project.orcaFacil = newOrcaFacil;
  
    fetch('http://localhost:3000/api/projects/' + project.id, {
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
  