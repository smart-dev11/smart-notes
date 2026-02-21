let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editIndex = null;

const list = document.getElementById("notesList");

function saveAndRender() {
  localStorage.setItem("notes", JSON.stringify(notes));
  render();
}

function addNote() {
  const input = document.getElementById("noteInput");
  if (input.value.trim() === "") return;

  notes.unshift({
    text: input.value,
    priority: "low",
    time: Date.now()
  });

  input.value = "";
  saveAndRender();
}

function deleteNote(index) {
  notes.splice(index, 1);
  saveAndRender();
}

function openEdit(index) {
  editIndex = index;
  document.getElementById("editInput").value = notes[index].text;
  document.getElementById("prioritySelect").value = notes[index].priority;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function saveEdit() {
  notes[editIndex].text = document.getElementById("editInput").value;
  notes[editIndex].priority = document.getElementById("prioritySelect").value;
  saveAndRender();
  closeModal();
}

function sortNotes() {
  const sortType = document.getElementById("sortSelect").value;

  if (sortType === "recent") {
    notes.sort((a, b) => b.time - a.time);
  } else {
    const order = { high: 3, medium: 2, low: 1 };
    notes.sort((a, b) => order[b.priority] - order[a.priority]);
  }

  render();
}

function render() {
  list.innerHTML = "";

  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.classList.add(`note-${note.priority}`);

    li.innerHTML = `
      <span onclick="openEdit(${index})">${note.text}</span>
      <button onclick="deleteNote(${index})">X</button>
    `;

    list.appendChild(li);
  });
}

render();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js")
      .then(() => console.log("Service Worker Registered"))
      .catch(err => console.log("SW Registration Failed:", err));
  });
}
