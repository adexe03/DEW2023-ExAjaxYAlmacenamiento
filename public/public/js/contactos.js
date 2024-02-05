const HOST = 'http://localhost:3000/api/'

let contacts = document.getElementById("contacts");

let empresas = localStorage.empresas ? JSON.parse(localStorage.empresas) : [];
let empresasMarked = empresas.map(e => e = e.id);

async function loadContacts() {
  let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  await fetch(HOST + "contacts", requestOptions)
    .then(response => response.json())
    .then(contacts => {
      if (empresas.length > 0) {
        let contactsMarked = contacts.filter(c => empresasMarked.includes(c.company_id));
        contactsMarked.sort(function (a, b) {
          if (a.first_name < b.first_name) {
            return -1;
          }
          if (a.first_name > b.first_name) {
            return 1;
          }
          return 0
        });
        contactsMarked.forEach(contactMarked => {
          addContact(contactMarked);
        })
        // Falta la condicion para que me muestre todos los contactos, pero funciona cuando seleccionas una empresa
      } else {
        contacts.forEach(contact => {
          addContact(contact);
        })
      }
    })
    .catch(error => console.log('error', error));
}

function addContact(c) {
  let card = document.createElement("div");
  card.classList.add("card");

  let id = document.createElement("p");
  id.innerHTML = "Id: " + c.id;
  let name = document.createElement("h4");
  name.innerHTML = "Nombre: " + c.first_name + " " + c.last_name;
  let email = document.createElement("p");
  email.classList.add("email");
  email.innerHTML = "Correo: " + c.email;
  let img = document.createElement("img");
  img.src = "../img/" + c.image;
  let department = document.createElement("p")
  department.innerHTML = "Dpt: " + c.department;
  let company_id = document.createElement("p");
  company_id.innerHTML = "Compañía: " + empresas.filter(e => e.id == c.company_id)[0].name;
  let button = document.createElement("button");
  button.innerHTML = "Borrar";

  card.append(id, name, email, img, department, company_id, button);
  contacts.append(card);
}

// No me dio tiempo a terminar la función de eliminar
function removeContact(c) {
}

loadContacts();