const baseURL = "http://localhost:3000/camisas";

async function findAllCamisas() {
  const response = await fetch(`${baseURL}/todas-camisas`);

  const camisas = await response.json();

  camisas.forEach(function (camisa) {
    document.querySelector("#camisaList").insertAdjacentHTML(
      "beforeend",
      `
    <div class="CamisaListaItem" id="CamisaListaItem_${camisa.id}">
      <div>
        <div class="CamisaListaItem__modelo">${camisa.modelo}</div>
        <div class="CamisaListaItem__preco">${camisa.preco}</div>
        <li class="CamisaListaItem__descricao">${camisa.descricao}</li>

        <div class="CamisaListaItem__acoes Acoes">
          <button class="Acoes__editar btn" onclick="abrirModal(${camisa.id})" >Editar</button>
          <button class="Acoes__apagar btn" onclick="abrirModalDelete(${camisa.id})">Apagar</button>
        </div>
      </div>
         <img class="CamisaListaItem__foto" src="${camisa.foto}"
          alt="Camisa de ${camisa.modelo}" />
    </div>
    `
    );
  });
}

async function findByIdCamisas() {
  const id = document.querySelector("#idCamisa").value;

  const response = await fetch(`${baseURL}/camisa/${id}`);
  const camisa = await response.json();

  const camisaEscolhidaDiv = document.querySelector("#camisaEscolhida");

  camisaEscolhidaDiv.innerHTML = `
  <div class="CamisaCardItem" id="CamisaListaItem_${camisa.id}">
    <div>
      <div class="CamisaCardItem__modelo">${camisa.modelo}</div>
      <div class="CamisaCardItem__preco">${camisa.preco}</div>
      <div class="CamisaCardItem__descricao">${camisa.descricao}</div>
      <div class="CamisaListaItem__acoes Acoes">
        <button class="Acoes__editar btn" onclick="abrirModal(${camisa.id})">Editar</button>
        <button class="Acoes__apagar btn" onclick="abrirModalDelete(${camisa.id})">Apagar</button>
      </div>
    </div>
     <img class="CamisaCardItem__foto" src="${camisa.foto}"
      alt="Camisa de ${camisa.modelo}" />
</div>`;
}

findAllCamisas();

async function abrirModal(id = null) {
  if (id != null) {
    document.querySelector("#title-header-modal").innerText =
      "Atualizar uma Camisa";

    document.querySelector("#button-form-modal").innerText = "Atualizar";

    const response = await fetch(`${baseURL}/camisa/${id}`);
    const camisa = await response.json();

    document.querySelector("#modelo").value = camisa.modelo;
    document.querySelector("#preco").value = camisa.preco;
    document.querySelector("#descricao").value = camisa.descricao;
    document.querySelector("#foto").value = camisa.foto;
    document.querySelector("#id").value = camisa.id;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar uma Camisa";

    document.querySelector("#button-form-modal").innerText = "Cadastrar";
  }

  document.querySelector("#overlay").style.display = "flex";
}

function fecharModal() {
  document.querySelector(".modal-overlay").style.display = "none";

  document.querySelector("#modelo").value = "";
  document.querySelector("#preco").value = "";
  document.querySelector("#descricao").value = "";
  document.querySelector("#foto").value = "";
}

async function createCamisa() {
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

  const modEdicaoAtivado = id > 0;

  const endpoint = baseURL + (modEdicaoAtivado ? `/update/${id}` : `/create`);

  const response = await fetch(endpoint, {
    method: modEdicaoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(camisa),
  });

  const novaCamisa = await response.json();

  const html = `
  <div class="CamisaListaItem" id="CamisaListaItem_${camisa.id}">
    <div>
    <div class="Home__cardCreate" onclick="abrirModal()">
          <section class="button-modal-create">
            <a class="fake-card" type="button" onclick="abrirModal()">
              <img
                src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/38/000000/external-plus-user-interface-tanah-basah-glyph-tanah-basah-2.png"
                alt="Criar">
            </a>
          </section>
        </div>
      <div class="CamisaListaItem__modelo">${novaCamisa.modelo}</div>
      <div class="CamisaListaItem__preco">${novaCamisa.preco}</div>
      <li class="CamisaListaItem__descricao">${novaCamisa.descricao}</li>
      <div class="CamisaListaItem__acoes Acoes">
        <button class="Acoes__editar btn" onclick="abrirModal(${camisa.id})">Editar</button>
        <button class="Acoes__apagar btn" onclick="abrirModalDelete(${camisa.id})">Apagar</button>
      </div>
    </div>
      <img class="CamisaListaItem__foto" src="${novaCamisa.foto}"
        alt="Camisa de ${novaCamisa.modelo}" />
</div>`;

  if (modEdicaoAtivado) {
    document.querySelector(`CamisaListaItem_${id}`).outerHTML = html;
  } else {
    document.querySelector("#camisaList").insertAdjacentHTML("beforeend", html);
  }

  fecharModal();
}

function abrirModalDelete(id) {
  document.querySelector("#overlay-delete").style.display = "flex";

  const btnSim = document.querySelector(".btn_delete_yes");

  btnSim.addEventListener("click", function () {
    deleteCamisa(id);
  });
}

function fecharModalDelete() {
  document.querySelector("#overlay-delete").style.display = "none";
}

async function deleteCamisa(id) {
  const response = await fetch(`${baseURL}/delete/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  const result = await response.json();
  alert(result.message);
  fecharModalDelete();

  document.location.reload(true);
}

let toggle = false;
const img = document.querySelector(".Menu_NavBar");
const nav = document.querySelector(".menu-items");
const section = document.querySelector("section");
const criar = document.querySelector("#top_criar");

img.addEventListener("click", () => {
  handleModal();
  if (toggle) {
    section.style.opacity = "0.5";
    nav.style.display = "flex";
    nav.style.zIndex = "1";
    img.style.zIndex = "2";
    img.style.position = "fixed";
    criar.addEventListener("click", () => {
      toggle = !toggle
      nav.style.display = "none";
      section.style.opacity = "1";
      img.style.position = "relative";
    });
  } else {
    nav.style.display = "none";
    section.style.opacity = "1";
    img.style.position = "relative";
  }
});

function handleModal() {
  toggle = !toggle;
}
