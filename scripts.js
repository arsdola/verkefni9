const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let companies1;

  function removeloadinggif() {
    const loaddiv = document.querySelector('.loading');
    loaddiv.remove();
  }

  function loadinggif() {
    const loaddiv = document.createElement('div');
    loaddiv.classList.add('loading');

    const loadgif = document.createElement('img');
    loadgif.src = 'loading.gif';
    loaddiv.appendChild(loadgif);

    const p = document.createElement('p');
    p.appendChild(document.createTextNode('Leita að fyrirtækjum...'));
    loaddiv.appendChild(p);

    companies1.appendChild(loaddiv);
  }

  function displayCompany(companyList) {
    removeloadinggif();
    const container = companies1.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    for (let i = 0; i < companyList.length; i += 1) {
      const div = document.createElement('div');
      div.classList.add('company');

      container.appendChild(div);

      const dl = document.createElement('dl');
      div.appendChild(dl);

      const len = document.createElement('dt');
      len.appendChild(document.createTextNode('Lén:'));
      dl.appendChild(len);

      const name = document.createElement('dd');
      name.appendChild(document.createTextNode(companyList[i].name));
      dl.appendChild(name);

      const kennit = document.createElement('dt');
      kennit.appendChild(document.createTextNode('Kennitala:'));
      dl.appendChild(kennit);

      const sn = document.createElement('dd');
      sn.appendChild(document.createTextNode(companyList[i].sn));
      dl.appendChild(sn);

      if (companyList[i].active === 1) {
        div.classList.add('company--active');
        const heimilisf = document.createElement('dt');
        heimilisf.appendChild(document.createTextNode('Heimilisfang:'));
        dl.appendChild(heimilisf);

        const address = document.createElement('dd');
        address.appendChild(document.createTextNode(companyList[i].address));
        dl.appendChild(address);
      } else {
        div.classList.add('company--inactive');
      }
    }
  }

  function displayError(error) {
    const container = companies1.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(document.createTextNode(error));
  }

  function fetchData(name) {
    fetch(`${API_URL}${name}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Villa kom upp');
      })
      .then((data) => {
        if (data.results.length === 0) {
          displayError('Ekkert fyrirtæki fannst fyrir leitarstreng');
          removeloadinggif();
        } else {
          displayCompany(data.results);
        }
      })
      .catch((error) => {
        displayError('Villa við að sækja gögn');
        console.error(error);  /* eslint-disable-line */
      });
  }


  function onSubmit(e) {
    e.preventDefault();

    const container = companies1.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }


    const input = e.target.querySelector('input');

    if (input.value === '') {
      displayError('Lén verður að vera strengur');
    } else {
      loadinggif();
      fetchData(input.value);
    }
  }

  function init(companies) {
    companies1 = companies;
    const form = companies1.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }
  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('.companies');
  program.init(companies);
});
