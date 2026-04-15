const API = "http://localhost:3000/api";

// LOGIN BUTTON (eventListener = spolehlivé)
window.onload = () => {
  const btn = document.getElementById("loginBtn");

  if (btn) {
    btn.addEventListener("click", login);
  }

  if (typeof feed !== "undefined") {
    loadPosts();
  }
};

// LOGIN
async function login() {
  console.log("klik");

  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: document.getElementById("u").value,
      password: document.getElementById("p").value
    })
  });

  console.log("status:", res.status);

  if (res.ok) {
    console.log("LOGIN OK");
    location.href = "feed.html";
  } else {
    console.log("LOGIN FAIL");
    alert("Špatné jméno nebo heslo");
  }
}

// REGISTER
async function register() {
  if (age.value < 13) return alert("Musíš mít 13+");

  await fetch(API + "/auth/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: u.value,
      password: p.value,
      age: age.value
    })
  });

  alert("Registrace hotová");
  location.href = "login.html";
}

// POSTS
async function loadPosts() {
  const res = await fetch(API + "/posts", {
    credentials: "include"
  });

  const data = await res.json();

  if (!Array.isArray(data)) {
    location.href = "login.html";
    return;
  }

  feed.innerHTML = data.map(p => `
    <div class="card">
      <div class="post-user">${p.username}</div>
      <div class="post-text">${p.text}</div>

      <div class="post-actions">
        <span>❤️ ${p.likes}</span>
        <button class="like-btn" onclick="like(${p.id})">Like</button>
      </div>
    </div>
  `).join("");
}

// CREATE POST
async function createPost() {
  await fetch(API + "/posts", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: text.value
    })
  });

  text.value = "";
  loadPosts();
}

// LIKE
async function like(id) {
  await fetch(API + "/posts/like", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      postId: id
    })
  });

  loadPosts();
}
async function loadPosts() {
  const res = await fetch("http://localhost:3000/api/posts", {
    credentials: "include"
  });

  const data = await res.json();

  // když není přihlášený → zpět
  if (!Array.isArray(data)) {
    location.href = "login.html";
    return;
  }

  const feed = document.getElementById("feed");

  const postsHTML = await Promise.all(data.map(async (p) => {

    // 🔹 načti komentáře
    const resComments = await fetch(
      "http://localhost:3000/api/posts/comments/" + p.id,
      { credentials: "include" }
    );

    const comments = await resComments.json();

    const commentsHTML = comments.map(c => `
      <div class="comment">
        <b>${c.username}</b>: ${c.text}
      </div>
    `).join("");

    return `
      <div class="post">

        <div class="post-header">
          👤 ${p.username}
        </div>

        <div class="post-text">
          ${p.text}
        </div>

<div class="post-actions">
  <span>❤️ ${p.likes}</span>

  <div>
    <button class="like-btn" onclick="like(${p.id})">
      👍
    </button>

    ${p.isOwner ? `
      <button onclick="editPost(${p.id})">✏️ Upravit</button>
      <button onclick="deletePost(${p.id})">🗑️ Smazat</button>
    ` : ""}
  </div>
</div>

        <div class="comments">
          ${commentsHTML}
        </div>

        <div class="comment-box">
          <input id="c${p.id}" placeholder="Napiš komentář">
          <button onclick="addComment(${p.id})">➤</button>
        </div>

      </div>
    `;
  }));

  feed.innerHTML = postsHTML.join("");
}
// USER INFO 
window.onload = () => {
  const btn = document.getElementById("loginBtn");

  if (btn) {
    btn.addEventListener("click", login);
  }

  if (typeof feed !== "undefined") {
    loadPosts();
    loadUser();
  }
};
async function loadComments(postId) {
  const res = await fetch(API + "/posts/comments/" + postId, {
    credentials: "include"
  });

  const data = await res.json();

  return data.map(c => `
    <div style="font-size:13px;">
      <b>${c.username}</b>: ${c.text}
    </div>
  `).join("");
}

async function addComment(postId) {
  const text = document.getElementById("c" + postId).value;

  await fetch(API + "/posts/comments", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, text })
  });

  loadPosts();
}

// LOAD USER
async function loadUser() {
  const res = await fetch("http://localhost:3000/api/auth/me", {
    credentials: "include"
  });

  if (!res.ok) {
    location.href = "login.html";
    return;
  }

  const user = await res.json();

  document.getElementById("username").innerText = user.username;

  // první písmeno jako avatar
  document.getElementById("avatar").innerText =
    user.username.charAt(0).toUpperCase();
}

async function logout() {
  await fetch("http://localhost:3000/api/auth/logout", {
    method: "POST",
    credentials: "include"
  });

  location.href = "login.html";
}

// MODAL
function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

async function deletePost(id) {
  await fetch(API + "/posts/" + id, {
    method: "DELETE",
    credentials: "include"
  });

  loadPosts();
}

async function editPost(id) {
  const newText = prompt("Uprav příspěvek:");

  await fetch(API + "/posts/" + id, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: newText })
  });

  loadPosts();
}
let editPostId = null;

function editPost(id, text) {
  editPostId = id;

  document.getElementById("editText").value = text;
  document.getElementById("editModal").style.display = "flex";
}

function closeEdit() {
  document.getElementById("editModal").style.display = "none";
}

async function saveEdit() {
  const newText = document.getElementById("editText").value;

  await fetch("http://localhost:3000/api/posts/" + editPostId, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: newText })
  });

  closeEdit();
  loadPosts();
}