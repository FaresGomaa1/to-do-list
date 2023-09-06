// Select DOM elements
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.querySelector(".todo-list");
const exportButton = document.getElementById("export-button");
const importForm = document.getElementById("import-form");
const importInput = document.getElementById("import-input");

// Initialize to-do items array
let todos = [];

async function fetchTodos() {
  try {
    const response = await fetch("todos.json");

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data)) {
        todos = data;
        renderTodoList();
    } else {
        console.error("Data fetched is not an array format.");
    }
    
  } catch (error) {
    console.error('Fetch error: ' + error.message);
  }
}

fetchTodos();

// Event listener for form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const todoText = input.value.trim();
  if (todoText !== "") {
    const todoItem = { id: Date.now(), text: todoText, completed: false };
    todos.push(todoItem);
    renderTodoList();
    input.value = "";
  }
});

// Event listener for export button
exportButton.addEventListener("click", (event) => {
  event.preventDefault();
  const dataStr = JSON.stringify(todos);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  const exportLink = document.createElement("a");
  exportLink.setAttribute("href", dataUri);
  exportLink.setAttribute("download", "todos.json");
  document.body.appendChild(exportLink);
  exportLink.click();
  document.body.removeChild(exportLink);
});

// Event listener for import form submission
importForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const importData = importInput.value.trim();
  try {
    const newTodos = JSON.parse(importData);
    if (Array.isArray(newTodos)) {
      todos = newTodos;
      renderTodoList();
      importInput.value = "";
    } else {
      throw new Error("Imported data is not an array format.");
    }
  } catch (error) {
    console.error(error.message);
    alert("Invalid JSON data. Please check your input and try again.");
  }
});

// Function to render the to-do list
function renderTodoList() {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? "checked" : ""}>
      <label>${todo.text}</label>
      <button>Delete</button>
    `;
    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
    });
    const deleteButton = li.querySelector("button");
    deleteButton.addEventListener("click", () => {
      todos = todos.filter((item) => item.id !== todo.id);
      renderTodoList();
    });
    todoList.appendChild(li);
  });
}
