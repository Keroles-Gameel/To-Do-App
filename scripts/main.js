let input = document.querySelector(".input");
let submit = document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks");
let tasksArray = [];

if (localStorage.getItem("tasks")) {
  tasksArray = JSON.parse(localStorage.getItem("tasks"));
}
getFromLocal();

submit?.addEventListener("click", function () {
  if (input && input.value !== "") {
    addTask(input.value);
    input.value = "";
  }
});

function addTask(taskText) {
  const task = { id: Date.now(), title: taskText, completed: false };
  tasksArray.push(task);
  addElements(tasksArray);
  addToLocal(tasksArray);
}

function addElements(tasksArray) {
  if (!tasksDiv) return;
  tasksDiv.innerHTML = "";
  tasksArray.forEach((task) => {
    let div = document.createElement("div");
    div.className = task.completed ? "task done" : "task";
    div.setAttribute("data-id", task.id);
    div.appendChild(document.createTextNode(task.title));

    let spanEdit = document.createElement("span");
    spanEdit.className = "edit";
    spanEdit.setAttribute("data-key", "editBtn");
    spanEdit.innerHTML = '<i class="fas fa-pen"></i>';
    div.appendChild(spanEdit);

    let span = document.createElement("span");
    span.className = "del";
    span.setAttribute("data-key", "deleteBtn");
    span.appendChild(document.createTextNode("Delete"));
    div.appendChild(span);

    tasksDiv.appendChild(div);
  });
}

function addToLocal(tasksArray) {
  window.localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

function getFromLocal() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addElements(tasks);
  }
}

tasksDiv?.addEventListener("click", (e) => {
  if (e.target.classList.contains("del")) {
    deleteTask(e.target.parentElement.getAttribute("data-id"));
    e.target.parentElement.remove();
  }
  if (e.target.closest(".edit")) {
    let taskId = e.target.closest(".task").getAttribute("data-id");
    let newTitle = prompt("Edit your task:", "");
    if (newTitle && newTitle.trim() !== "") {
      editTask(taskId, newTitle.trim());
    }
  }
  if (e.target.classList.contains("task")) {
    toggleTask(e.target.getAttribute("data-id"));
    e.target.classList.toggle("done");
  }
});

function deleteTask(taskId) {
  tasksArray = tasksArray.filter((task) => task.id != taskId);
  addToLocal(tasksArray);
}

function toggleTask(taskId) {
  for (let i = 0; i < tasksArray.length; i++) {
    if (tasksArray[i].id == taskId) {
      tasksArray[i].completed = !tasksArray[i].completed;
    }
  }
  addToLocal(tasksArray);
}

function editTask(taskId, newTitle) {
  for (let i = 0; i < tasksArray.length; i++) {
    if (tasksArray[i].id == taskId) {
      tasksArray[i].title = newTitle;
      break;
    }
  }
  addToLocal(tasksArray);
  addElements(tasksArray);
}

const translations = {
  en: {
    appTitle: "To Do App",
    welcomeText: "Welcome, USER! Small steps today, big results tomorrow!",
    quote: "Let’s make today productive",
    addNewTask: "Add a new task...",
    addTaskBtn: "Add Task",
    deleteBtn: "Delete",
    logoutBtn: "Logout",
    editBtn: "Edit",
    loginTitle: "Login",
    email: "Email",
    password: "Password",
    loginBtn: "Login",
    noAccount: "Don't have an account?",
    registerLink: "Register",
    registerTitle: "Register",
    firstName: "First Name",
    lastName: "Last Name",
    registerBtn: "Register",
    haveAccount: "Already have an account?",
    loginLink: "Login",
  },
  ar: {
    appTitle: "قائمة المهام",
    welcomeText: "مرحبًا، USER! خطوات صغيرة اليوم، نتائج كبيرة غدًا!",
    quote: "لنَجعل اليوم مثمرًا",
    addNewTask: "أضف مهمة جديدة...",
    addTaskBtn: "إضافة مهمة",
    deleteBtn: "حذف",
    logoutBtn: "تسجيل الخروج",
    editBtn: "تعديل",
    loginTitle: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    loginBtn: "دخول",
    noAccount: "ليس لديك حساب؟",
    registerLink: "إنشاء حساب",
    registerTitle: "إنشاء حساب",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    registerBtn: "تسجيل",
    haveAccount: "لديك حساب بالفعل؟",
    loginLink: "تسجيل الدخول",
  },
};

function setLanguage(lang) {
  localStorage.setItem("selectedLang", lang);
  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    if (translations[lang][key]) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        if (el.type === "submit" || el.type === "button") {
          el.value = translations[lang][key];
        } else {
          el.placeholder = translations[lang][key];
        }
      } else if (el.tagName === "BUTTON" || el.tagName === "SPAN") {
        if (el.querySelector("i")) return;
        el.textContent = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const welcomeText = document.getElementById("welcomeText");
  if (user && welcomeText) {
    let txt = translations[lang]["welcomeText"];
    welcomeText.textContent = txt.replace("USER", user.firstName);
  }
  document.body.dir = lang === "ar" ? "rtl" : "ltr";
}

document
  .getElementById("btn-en")
  ?.addEventListener("click", () => setLanguage("en"));
document
  .getElementById("btn-ar")
  ?.addEventListener("click", () => setLanguage("ar"));

const savedLang = localStorage.getItem("selectedLang") || "en";
setLanguage(savedLang);
