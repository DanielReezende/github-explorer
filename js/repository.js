const main = document.querySelector('.content');
const DB_KEY = '@repository.github'

if (window.location.pathname.includes('repository.html')) {
  const storage = localStorage.getItem(DB_KEY);

  if (storage) {
    const repositoryParsed = JSON.parse(storage);

    document.querySelector('.repository-info-description strong').textContent = repositoryParsed.full_name;
    document.querySelector('.repository-info-description p').textContent = `${repositoryParsed.description || 'Nenhuma descrição disponível'}`;
    document.querySelector('.repository-starts').textContent = repositoryParsed.stargazers_count;
    document.querySelector('.repository-forks').textContent = repositoryParsed.forks_count;
    document.querySelector('.repository-issues').textContent = repositoryParsed.open_issues_count;
    document.querySelector('.repository-info-header img').src = repositoryParsed.owner.avatar_url

    fetchIssues(repositoryParsed);

  } else {
    main.innerHTML = ""
    main.innerHTML = '<p>Nenhum repositório selecionado.</p>';
  }
}

function fetchIssues(repo) {
  const issuesList = document.querySelector('.issues-list');

  axios.get(`https://api.github.com/repos/${repo.full_name}/issues?per_page=5`)
    .then(response => {
      const issues = response.data;

      if (issues.length > 0) {
        displayIssues(issues);
      } else {
        issuesList.innerHTML = '<li><p>Não há issues abertas para este repositório.</p></li>';
      }
    })
    .catch(error => {
      console.error('Erro ao buscar issues:', error);
      issuesList.innerHTML = '<li><p>Erro ao buscar issues. Tente novamente mais tarde.</p></li>';
    });
}

function displayIssues(issues) {
  const issuesList = document.querySelector('.issues-list');
  issuesList.innerHTML = ''; 

  issues.forEach(issue => {
    const li = document.createElement('li');

    const a = document.createElement('a');
    a.className = 'issues-list-item';
    a.href = issue.html_url;
    a.target = '_blank';

    const issuesInfo = document.createElement('div');
    issuesInfo.className = 'issues-info';

    const strong = document.createElement('strong');
    strong.textContent = issue.title.substring(0, 50) + '...';

    const span = document.createElement('span');
    span.textContent = issue.body ? issue.body.substring(0, 50) + '...' : 'Sem descrição';

    issuesInfo.appendChild(strong);
    issuesInfo.appendChild(span);

    const icon = document.createElement('i');
    icon.className = 'ph ph-caret-right';

    a.appendChild(issuesInfo);
    a.appendChild(icon);
    li.appendChild(a);
    issuesList.appendChild(li);
  });
}