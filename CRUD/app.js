const STORAGE_KEY = "bpds-corcho-fichas";
const form = document.getElementById("card-form");
const board = document.getElementById("board");
const emptyNote = document.getElementById("empty-note");
let fichas = cargarFichas();
let editandoId = null;

function cargarFichas() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : [];
  } catch (error) {
    console.error("No se pudieron cargar las fichas:", error);
    return [];
  }
}

function guardarFichas() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fichas));
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const materia = document.getElementById("materia").value.trim();
  const tema = document.getElementById("tema").value.trim();
  const prioridad = document.getElementById("prioridad").value;
  if (!materia || !tema) return;
  if (editandoId) {
    fichas = fichas.map((f) =>
      f.id === editandoId ? { ...f, materia, tema, prioridad } : f
    );
    editandoId = null;
    form.querySelector(".pin-button").textContent = "Clavar ficha";
  } else {
    fichas.push({ id: Date.now().toString(), materia, tema, prioridad });
  }
  guardarFichas();
  form.reset();
  render();
});

function borrarFicha(id) {
  fichas = fichas.filter((f) => f.id !== id);
  guardarFichas();
  render();
}

function editarFicha(id) {
  const ficha = fichas.find((f) => f.id === id);
  if (!ficha) return;
  document.getElementById("materia").value = ficha.materia;
  document.getElementById("tema").value = ficha.tema;
  document.getElementById("prioridad").value = ficha.prioridad;
  editandoId = id;
  form.querySelector(".pin-button").textContent = "Guardar cambios";
  document.getElementById("materia").focus();
}

function render() {
  board.innerHTML = "";
  if (fichas.length === 0) {
    board.appendChild(emptyNote);
    return;
  }
  fichas.forEach((ficha) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <span class="badge ${ficha.prioridad}">${ficha.prioridad}</span>
      <p class="materia">${escapeHtml(ficha.materia)}</p>
      <p class="tema">${escapeHtml(ficha.tema)}</p>
      <div class="card-actions">
        <button type="button" class="edit-btn">Editar</button>
        <button type="button" class="delete-btn">Quitar</button>
      </div>
    `;
    card.querySelector(".edit-btn").addEventListener("click", () => editarFicha(ficha.id));
    card.querySelector(".delete-btn").addEventListener("click", () => borrarFicha(ficha.id));
    board.appendChild(card);
  });
}

function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

render();