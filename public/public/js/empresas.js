let HOST = 'http://localhost:3000/api/';
let tbody = document.querySelector("tbody");
const FORM_CREATE = document.getElementsByName('form_create')[0];
let INPUT_NAME = document.getElementById('name');
let INPUT_INDUSTRY = document.getElementById('industry');
let INPUT_SECTOR = document.getElementById('sector');
let INPUT_CAPITAL = document.getElementById('capital');

let empresas = localStorage.empresas ? JSON.parse(localStorage.empresas) : [];


async function loadCompanies() {
  let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  tbody.innerHTML = "<tr><td colspan='5'>Cargando...</td></tr>";

  await fetch(HOST + "companies", requestOptions)
    .then(response => response.json())
    .then(data => {
      tbody.innerHTML = "";
      data.forEach(empresa => {
        addCompany(empresa);
      })
    })
    .catch(error => console.log('error', error));
}

FORM_CREATE.addEventListener('submit', (e) => {
  e.preventDefault();

  let empresa = {
    "name": INPUT_NAME.value,
    "industry": INPUT_INDUSTRY.value,
    "sector": INPUT_SECTOR.value,
    "capital": INPUT_CAPITAL.value
  }

  let requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(empresa),
    redirect: 'follow'
  };

  fetch(HOST + "companies", requestOptions)
    .then(response => response.json())
    .then(result => addCompany(result))
    .catch(error => console.log('error', error));
})

function addCompany(c) {
  let newLine = document.createElement('tr')
  if (empresas.filter(e => e.id == c.id).length > 0) {
    newLine.classList.add("marcada");
  }

  newLine.innerHTML = `
  <td>${c.id}</td>
  <td>${c.name}</td>
  <td>${c.industry}</td>
  <td>${c.sector}</td>
  <td>${c.capital}</td>
  `;

  let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  let contacts = 0;
  fetch(HOST + "contacts", requestOptions)
    .then(response => response.json())
    .then(contactos => {
      for (let i = 0; i < contactos.length; i++) {
        if (contactos[i].company_id == c.id) {
          contacts++;
        }
      }
      newLine.innerHTML += `<td>${contacts}</td>`;
    })
    .catch(error => console.log('error', error));

  newLine.addEventListener('click', () => {
    newLine.classList.toggle("marcada");
    if (!empresas.filter(e => e.id == c.id).length > 0) {
      empresas.push(c);
      localStorage["empresas"] = JSON.stringify(empresas);
    } else {
      empresas = empresas.filter(e => e.id !== c.id);
      localStorage["empresas"] = JSON.stringify(empresas);
    }
  })
  tbody.append(newLine);
}

loadCompanies();