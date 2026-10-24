const inputData = document.getElementById("data");
const botao = document.getElementById("buscar");
const resultado = document.getElementById("resultado");

const BASE_URL = "https://science.nasa.gov/wp-json/wp/v2/apod-basic";

// "2026-10-22" -> "261022"
function dataParaCodigo(dataISO) {
  return dataISO.replaceAll("-", "").slice(2);
}

async function buscarFoto() {
  const data = inputData.value;

  const url = data
    ? `${BASE_URL}/${dataParaCodigo(data)}`
    : `${BASE_URL}?per_page=1`;

  resultado.innerHTML = "<p>Carregando...</p>";

  try {
    const resposta = await fetch(url);

    if (!resposta.ok) {
      resultado.innerHTML = "<p>Não encontrei foto para essa data. Tente outra!</p>";
      return;
    }

    const dados = await resposta.json();
    const item = Array.isArray(dados) ? dados[0] : dados;

    mostrarFoto(item);
  } catch (erro) {
    resultado.innerHTML = "<p>Não foi possível buscar os dados solicitados.</p>";
  }
}

function mostrarFoto(dados) {
  let midia = `<img src="${dados.hdurl}" alt="${dados.title}">`;

  if (dados.media_type !== "image") {
    midia += `<p><a href="${dados.permalink}" target="_blank">Ver o vídeo no site da NASA</a></p>`;
  }

  resultado.innerHTML = `
    <h2>${dados.title}</h2>
    <p><strong>${dados.date}</strong></p>
    ${midia}
    <p>${dados.explanation}</p>
    <p><small>Crédito: ${dados.credit}</small></p>
  `;
}

botao.addEventListener("click", buscarFoto);
buscarFoto();