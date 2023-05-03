/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de plantas existentes no servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
function getList() {
  fetch('http://127.0.0.1:5000/cables', {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.cables.forEach(item => insertList(item.id, item.tipo, item.nome, item.diametro, item.peso, item.capacidade, item.quantidade, item.observacao));
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista que será apresentada
  --------------------------------------------------------------------------------------
*/
function insertList(id, tipo, nome, diametro, peso, capacidade, quantidade, obs) {
  var item = [tipo, nome, diametro, peso, capacidade, quantidade, obs];
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length - 1; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }

  insertTrashcan(row.insertCell(-1), id, obs);

  clearInputs();
}

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na base de dados via requisição POST
  --------------------------------------------------------------------------------------
*/
function postItem(input_tipo, input_nome, input_diametro, input_peso, input_capacidade, input_quantidade, input_obs) {
  const formData = new FormData();
  formData.append('tipo', input_tipo);
  formData.append('nome', input_nome);
  formData.append('diametro', input_diametro);
  formData.append('peso', input_peso);
  formData.append('capacidade', input_capacidade);
  formData.append('quantidade', input_quantidade);
  formData.append('observacao', input_obs);

  fetch('http://127.0.0.1:5000/cable', {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      if (typeof data.message != 'undefined') {
        alert(data.message);
        clearInputs();
      }
      else {
        insertList(data.id, input_tipo, input_nome, input_diametro, input_peso, input_capacidade, input_quantidade, input_obs);
        alert("Novo cabo adicionado!");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo cabo com seus atributos
  --------------------------------------------------------------------------------------
*/
function newItem() {
  let input_tipo = document.getElementById("input_tipo").value;
  let input_nome = document.getElementById("input_nome").value;
  let input_diametro = document.getElementById("input_diametro").value;
  let input_peso = document.getElementById("input_peso").value;
  let input_capacidade = document.getElementById("input_capacidade").value;
  let input_quantidade = document.getElementById("input_quantidade").value;
  let input_obs = document.getElementById("input_obs").value;

  if (input_nome === '') {
    alert("Escreva o nome do cabo!");
  } else if (isNaN(input_quantidade)) {
    alert("Quantidade precisam ser numérica!");
  } else {
    postItem(input_tipo, input_nome, input_diametro, input_peso, input_capacidade, input_quantidade, input_obs);
  }
}

/*
  -----------------------------------------------------------------------------------------------
  Função para inserir uma lixeira para deleção e balão de observação em uma linha da tabela
  -----------------------------------------------------------------------------------------------
*/
function insertTrashcan(parent, id, obs) {

  let ndiv = document.createElement("div");
  ndiv.setAttribute("class", "tooltip");
  parent.appendChild(ndiv);

  let image = document.createElement("img");
  image.setAttribute("src", "static/obs.png");
  image.setAttribute("height", "15px");
  image.setAttribute("width", "15px");
  image.style.paddingRight = "10px";
  ndiv.appendChild(image);

  let nspan = document.createElement("span");
  nspan.setAttribute("class", "tooltiptext");
  nspan.innerHTML = obs;
  ndiv.appendChild(nspan);

  let image2 = document.createElement("img");
  image2.setAttribute("src", "static/lixeira.png");
  image2.setAttribute("height", "15px");
  image2.setAttribute("width", "15px");
  image2.setAttribute("onclick", "removeItem(this)");
  image2.style.cursor = "pointer";
  image.style.paddingLeft = "10px";
  image2.setAttribute("id", id);
  parent.appendChild(image2);

}

/*
  ---------------------------------------------------------------------------------------------------
  Função para deletar um cabo do banco de dados via requisição DELETE usando o id do cabo
  ---------------------------------------------------------------------------------------------------
*/
function deleteItem(id) {
  console.log(id)
  let url = 'http://127.0.0.1:5000/cable?cable_id=' + id;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*------------------------------------------------------------------------------------------------
Função para deletar um cabo no clique na lixeira associada
--------------------------------------------------------------------------------------------------
*/

function removeItem(item) {
  const div = item.parentElement.parentElement;
  const nomeItem = div.getElementsByTagName('td')[0].innerHTML;

  if (confirm("Confirma a exclusão?")) {
    div.remove();
    deleteItem(item.id);
    alert("Cabo removido com sucesso!");
    clearInputs();
  }
}

/*------------------------------------------------------------------------------------------------
Função para limpar campos de entrada de dados após alguma operação
--------------------------------------------------------------------------------------------------
*/
function clearInputs() {
  document.getElementById("input_tipo").value = "";
  document.getElementById("input_nome").value = "";
  document.getElementById("input_diametro").value = "";
  document.getElementById("input_peso").value = "";
  document.getElementById("input_capacidade").value = "";
  document.getElementById("input_quantidade").value = "";
  document.getElementById("input_obs").value = "";
}
/*------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------
*/