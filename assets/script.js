const baseURL = "http://localhost:3000/camisas";
const msgAlert = document.querySelector(".msg-alert");

async function findAllCamisas() {
  const response = await fetch(`${baseURL}/all-camisas`);

  const camisas = await response.json();

  camisas.forEach(function (camisa) {
    document.querySelector("#camisa-list").insertAdjacentHTML(
      "beforeend",
      `
    <div class="camisa-list-item" id="camisa-list-item-${camisa._id}">
      <div>
        <div class="camisa-list-item-modelo">${camisa.modelo}</div>
        <div class="camisa-list-item-preco">${camisa.preco}</div>
        <li class="camisa-list-item-descricao">${camisa.descricao}</li>

        <div class="actions">
          <button class="actions-edit btn" onclick="showModal('${camisa._id}')" >Editar</button>
          <button class="actions-delete btn" onclick="showModalDelete('${camisa._id}')">Apagar</button>
        </div>
      </div>
         <img class="camisa-list-item-foto" src="${camisa.foto}"
          alt="Camisa de ${camisa.modelo}" />
    </div>
    `
    );
  });
}

findAllCamisas();

async function findByIdCamisas() {
  const id = document.querySelector("#search-input").value;

  if (id == "") {
    localStorage.setItem("message", "Digite um ID para pesquisar!");
    localStorage.setItem("type", "danger");

    showMessageAlert();
    return;
  }

  const response = await fetch(`${baseURL}/one-camisa/${id}`);
  const camisa = await response.json();

  if (camisa.message != undefined) {
    localStorage.setItem("message", camisa.message);
    localStorage.setItem("type", "danger");
    showMessageAlert();
    return;
  }
  document.querySelector(".list-all").style.display = "block";
  document.querySelector(".camisa-list").style.display = "none";
  const chosenCamisaDiv = document.querySelector("#camisa-chosen");

  chosenCamisaDiv.innerHTML = `
  <div class="camisa-card-item" id="camisa-list-item_${camisa._id}">
    <div>
      <div class="camisa-card-item-modelo">${camisa.modelo}</div>
      <div class="camisa-card-item-preco">${camisa.preco}</div>
      <div class="camisa-card-item-descricao">${camisa.descricao}</div>
      <div class="actions">
        <button class="actions-edit btn" onclick="showModal('${camisa._id}')">Editar</button>
        <button class="actions-delete btn" onclick="showModalDelete('${camisa._id}')">Apagar</button>
      </div>
    </div>
     <img class="camisa-card-item-foto" src="${camisa.foto}"
      alt="Camisa de ${camisa.modelo}" />
</div>`;
}

async function showModal(id = null) {
  if (id != null) {
    document.querySelector("#title-header-modal").innerText =
      "Atualizar uma Camisa";

    document.querySelector("#button-form-modal").innerText = "Atualizar";

    const response = await fetch(`${baseURL}/one-camisa/${id}`);
    const camisa = await response.json();

    document.querySelector("#modelo").value = camisa.modelo;
    document.querySelector("#preco").value = camisa.preco;
    document.querySelector("#descricao").value = camisa.descricao;
    document.querySelector("#foto").value = camisa.foto;
    document.querySelector("#id").value = camisa._id;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar uma Camisa";

    document.querySelector("#button-form-modal").innerText = "Cadastrar";
  }

  document.querySelector("#overlay").style.display = "flex";
}

function closeModal() {
  document.querySelector(".modal-overlay").style.display = "none";

  document.querySelector("#modelo").value = "";
  document.querySelector("#preco").value = "";
  document.querySelector("#descricao").value = "";
  document.querySelector("#foto").value = "";
}

async function submitCamisa() {
  const id = document.querySelector("#id").value;
  const modelo = document.querySelector("#modelo").value;
  const preco = document.querySelector("#preco").value;
  const descricao = document.querySelector("#descricao").value;
  const foto = document.querySelector("#foto").value;

  const camisa = {
    id,
    modelo,
    preco,
    descricao,
    foto,
  };

  const modEdicaoAtivado = id != "";

  const endpoint =
    baseURL + (modEdicaoAtivado ? `/update-camisa/${id}` : `/create-camisa`);

  const response = await fetch(endpoint, {
    method: modEdicaoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(camisa),
  });

  const novaCamisa = await response.json();

  if (novaCamisa.message != undefined) {
    localStorage.setItem("message", novaCamisa.message);
    localStorage.setItem("type", "danger");
    showMessageAlert();
    return;
  }

  if (modEdicaoAtivado) {
    localStorage.setItem("message", "Camisa atualizada com sucesso!");
    localStorage.setItem("type", "success");
  } else {
    localStorage.setItem("message", "Camisa criada com sucesso!");
    localStorage.setItem("type", "success");
  }

  document.location.reload(true);

  closeModal();
}

function showModalDelete(id) {
  document.querySelector("#overlay-delete").style.display = "flex";

  const btnSim = document.querySelector(".btn-delete-yes");

  btnSim.addEventListener("click", function () {
    deleteCamisa(id);
  });
}

function closeModalDelete() {
  document.querySelector("#overlay-delete").style.display = "none";
}

async function deleteCamisa(id) {
  const response = await fetch(`${baseURL}/delete-camisa/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  const result = await response.json();

  localStorage.setItem("message", result.message);
  localStorage.setItem("type", "success");

  document.location.reload(true);

  closeModalDelete();
}

let toggle = false;
const img = document.querySelector(".menu-nav");
const nav = document.querySelector(".menu-items");
const section = document.querySelector("section");
const divHomeContainer = document.querySelector(".home-container");
const criar = document.querySelector("#top-create");

img.addEventListener("click", () => {
  handleModal();
  console.log(toggle);
  if (toggle) {
    section.style.opacity = "0.5";
    divHomeContainer.style.opacity = "0.5";
    nav.style.display = "flex";
    nav.style.zIndex = "1";
    img.style.zIndex = "2";
    img.style.position = "fixed";
    criar.addEventListener("click", () => {
      toggle = !toggle;
      nav.style.display = "none";
      divHomeContainer.style.opacity = "1";
      section.style.opacity = "1";
      img.style.position = "fixed";
    });
  } else {
    nav.style.display = "none";
    section.style.opacity = "1";
    divHomeContainer.style.opacity = "1";
    img.style.position = "relative";
  }
});

function handleModal() {
  toggle = !toggle;
}

function closeMessageAlert() {
  setTimeout(function () {
    msgAlert.innerText = "";
    msgAlert.classList.remove(localStorage.getItem("type"));
    localStorage.clear();
  }, 3000);
}

function showMessageAlert() {
  msgAlert.innerText = localStorage.getItem("message");
  msgAlert.classList.add(localStorage.getItem("type"));
  closeMessageAlert();
}

showMessageAlert();
