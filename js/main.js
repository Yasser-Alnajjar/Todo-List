// Start Logic Dark mode
let lis = document.querySelectorAll("#icons li");
let day = document.querySelector("#day");
let night = document.querySelector("#night");

// Shuffle

// Local
window.addEventListener("load", () => {
  day.firstChild.classList.replace("fa-sun", "fa-moon");
  if (document.body.classList.contains("day")) {
    day.firstChild.classList.replace("fa-sun", "fa-moon");
  } else {
    day.firstChild.classList.replace("fa-moon", "fa-sun");
  }
});
let theme = localStorage.getItem("theme");
if (theme !== null) {
  document.body.classList.remove("day");
  document.body.classList.add(theme);

  lis.forEach((li) => {
    li.classList.remove("active");
  });
  if (localStorage.getItem("theme") === "day") {
    day.firstChild.classList.replace("fa-sun", "fa-moon");
  }
}

day.addEventListener("click", function () {
  document.body.classList.replace("night", "day");
  if (day.firstChild.classList.contains("fa-sun")) {
    day.firstChild.classList.replace("fa-sun", "fa-moon");
    document.body.classList.remove("night");
    document.body.classList.add("day");
    localStorage.setItem("theme", "day");
  } else {
    day.firstChild.classList.replace("fa-moon", "fa-sun");
    document.body.classList.remove("day");
    document.body.classList.add("night");
    localStorage.setItem("theme", "night");
  }
});

/******************** Start To do App ********************/
let addBtn = document.getElementById("add-btn");
let input = document.getElementById("input-text");
let todo = document.getElementById("todos");
let form = document.getElementById("form");
let alertDiv = document.getElementById("alert");
let alertp = document.querySelector("#alert p");
let alertbtn = document.querySelector("#alert button");
function warning(text) {
  alertp.innerHTML = text;
  alertDiv.style.cssText = `
  transform: translateY(100%) scale(1);
  `;
}
alertbtn.addEventListener("click", () => {
  alertDiv.style.cssText = `
  transform: translateY(100%) scale(0);
  `;
});
let arrTask = [];

let list = localStorage.getItem("list");
// Add Task To localStorage
if (list !== null) {
  let lists = JSON.parse(list);
  arrTask = lists;
  appendLis(arrTask);
}
// Handle input and form
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addBtn.click();
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  input.value = input.value.trim();
  if (input.value.toLowerCase() !== "") {
    //check if the item is found or not
    let targetElement = arrTask.find(
      (task) => task.title === input.value.toLowerCase()
    );
    if (targetElement) {
      let same = "Can't Add The Same Task Any More";
      warning(same);
      // alert("Can't Add The Same Task Any More");
    } else {
      add(input.value);
      input.value = "";
    }
  } else {
    let empty = "Can't Add Empty Task ";
    warning(empty);
  }
});

function add(inputValue) {
  let task = {
    id: Date.now(),
    time: formatAmPm(new Date()),
    title: inputValue.toLowerCase(),
    completed: false,
  };
  arrTask.push(task);
  appendLis(arrTask);
  addloacal(arrTask);
}

function formatAmPm(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}
function appendLis(arrTask) {
  todo.innerHTML = "";
  arrTask.forEach((task) => {
    // Li
    let li = document.createElement("li");
    li.className = "todo_list";
    li.classList.add("all");
    li.setAttribute("data-uniqe", task.id);
    // Input
    let inputTitle = document.createElement("input");
    inputTitle.className = "title";
    inputTitle.type = "text";
    inputTitle.setAttribute("readonly", "readonly");
    inputTitle.setAttribute("disabled", "disabled");

    inputTitle.value = task.title;
    // Add Class completed to list
    li.appendChild(inputTitle);
    if (task.completed === true) {
      li.classList.add("completed");
    }

    // Span time
    let spanTime = document.createElement("span");
    spanTime.className = "time";
    spanTime.appendChild(document.createTextNode(task.time));
    li.appendChild(spanTime);
    li.appendChild(spanTime);
    // Span edit
    let spanEdit = document.createElement("span");
    spanEdit.className = "edit";
    spanEdit.appendChild(document.createTextNode("Edit"));

    let spanDelete = document.createElement("span");
    spanDelete.className = "delete";
    spanDelete.appendChild(document.createTextNode("X"));
    let div = document.createElement("div");
    div.className = "container-spans";
    div.appendChild(spanEdit);
    div.appendChild(spanDelete);
    li.appendChild(div);
    todo.appendChild(li);
    inputTitle.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        spanEdit.click();
      }
    });
    spanEdit.addEventListener("click", (e) => {
      if (spanEdit.innerText.toLowerCase() == "edit") {
        spanEdit.innerText = "Save";
        inputTitle.removeAttribute("readonly");
        inputTitle.removeAttribute("disabled");
        inputTitle.focus();
      } else {
        spanEdit.innerText = "Edit";
        inputTitle.setAttribute("readonly", "readonly");
        inputTitle.setAttribute("disabled", "disabled");
        arrTask.find((task) => {
          let target =
            e.target.parentElement.parentElement.getAttribute("data-uniqe");
          if (task.id == target) {
            task.title = inputTitle.value;
          }
        });
      }
      addloacal(arrTask);
    });
  });
}

todo.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.parentElement.remove();
    arrTask = arrTask.filter(
      (task) =>
        task.id !=
        e.target.parentElement.parentElement.getAttribute("data-uniqe")
    );
    addloacal(arrTask);
  }
  if (e.target.classList.contains("todo_list")) {
    toggleCompleted(e.target.getAttribute("data-uniqe"));
    e.target.classList.toggle("completed");
  }
  if (e.target.classList.contains("title")) {
    e.target.parentElement.classList.toggle("completed");
    toggleCompleted(e.target.parentElement.getAttribute("data-uniqe"));
  }
});
function addloacal(arrTask) {
  localStorage.setItem("list", JSON.stringify(arrTask));
}
function toggleCompleted(id) {
  for (let i = 0; i < arrTask.length; i++) {
    if (arrTask[i].id == id) {
      if (arrTask[i].completed == false) {
        arrTask[i].completed = true;
      } else {
        arrTask[i].completed = false;
      }
    }
  }
  addloacal(arrTask);
}

let clearAll = document.querySelector("#clear-all");
let todoLi = document.querySelectorAll(".todo_list");
let arrTodoli = Array.from(todoLi);
clearAll.addEventListener("click", function (id) {
  arrTodoli.forEach((li) => {
    li.style.display = "none";
    clear(li.getAttribute("data-uniqe"));
  });
});

function clear(id) {
  for (let i = 0; i < arrTask.length; i++) {
    if (arrTask[i].id == id) {
      if ((arrTask[i].completed = true)) {
        arrTask = arrTask.filter((task) => task.id != id);
      }
    }
  }
  addloacal(arrTask);
}

// Shuffle
let allbtn = document.querySelector("#all");
let complete = document.querySelector("#complete");
let AllLis = document.querySelectorAll(".all");

let arr = Array.from(AllLis);
let btnarr = [allbtn, complete];
btnarr.forEach((btn) => {
  btn.addEventListener("click", function () {
    todoLi.forEach((li) => {
      if (li.classList.contains("completed")) {
        arr.forEach((li) => {
          li.style.display = "none";
        });
      }
    });
    document.querySelectorAll(this.dataset.attr).forEach((li) => {
      li.style.display = "flex";
    });
  });
});
let filterBtn = document.querySelectorAll(".filter button");
filterBtn.forEach((btn) => {
  btn.addEventListener("click", function () {
    filterBtn.forEach((btn) => {
      btn.classList.remove("active");
      this.classList.add("active");
    });
  });
});
