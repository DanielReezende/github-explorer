const form = document.querySelector('#search-form');
const query = document.querySelector('#search');
const DB_KEY = '@repository.github'


form.addEventListener('submit', event => {
  event.preventDefault();



  axios.get(`https://api.github.com/search/repositories?q=${query.value}`)
    .then(response => {
      displayResults(response.data.items);
    })
    .catch(error => console.error('Erro ao buscar repositórios:', error))


});



function displayResults(repositories) {
  const reposList = document.querySelector('.repos-list');

  query.value = '';

  reposList.innerHTML = '';


  repositories.forEach(repo => {
    const li = document.createElement('li');

    const a = document.createElement('a');
    a.className = 'repos-list-item';
    a.href = './repository.html';
    a.onclick = () => {
      saveRepositoryInfo(repo);
    };

    const repoWrapper = document.createElement('div');
    repoWrapper.className = 'repo-wrapper';

    const img = document.createElement('img');
    img.src = repo.owner.avatar_url;
    img.alt = `${repo.full_name} avatar`;


    const repoInfo = document.createElement('div');
    repoInfo.className = 'repos-info';

    const strong = document.createElement('strong');
    strong.textContent = repo.full_name;

    const span = document.createElement('span');
    span.textContent = repo.description || 'Sem descrição';

    repoInfo.appendChild(strong);
    repoInfo.appendChild(span);

    repoWrapper.appendChild(img);
    repoWrapper.appendChild(repoInfo);

    const icon = document.createElement('i');
    icon.className = 'ph ph-caret-right';

    a.appendChild(repoWrapper);
    a.appendChild(icon);


    li.appendChild(a);


    reposList.appendChild(li);
  });
}

function saveRepositoryInfo(repo) {
  localStorage.setItem(DB_KEY, JSON.stringify(repo));
}


