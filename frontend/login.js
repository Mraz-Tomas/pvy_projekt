const API = "http://localhost:3000";

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(API + "/auth/login", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
        alert("Špatné údaje");
        return;
    }

    const user = await res.json();
    localStorage.setItem("user", JSON.stringify(user));

    window.location.href = "index.html";
}

function goRegister() {
    window.location.href = "register.html";
}