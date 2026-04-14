const API = "http://localhost:3000";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) window.location.href = "login.html";

document.getElementById("username").innerText = user.username;

async function loadPosts() {
    const res = await fetch(API + "/posts");
    const posts = await res.json();

    const container = document.getElementById("posts");
    container.innerHTML = "";

    posts.forEach(p => {
        container.innerHTML += `
            <div class="post">
                <h3>${p.title}</h3>
                <p>${p.content}</p>
                <small>${p.username}</small>
            </div>
        `;
    });
}

async function addPost() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    await fetch(API + "/posts", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            user_id: user.id,
            title,
            content
        })
    });

    loadPosts();
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

function goUsers() {
    alert("Uděláme později 😄");
}

loadPosts();