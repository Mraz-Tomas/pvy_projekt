const API = "http://localhost:3000";

async function register() {
    const age = document.getElementById("age").value;

    if (age < 13) {
        alert("Musíš mít alespoň 13 let!");
        return;
    }

    await fetch(API + "/auth/register", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            first_name: document.getElementById("first_name").value,
            last_name: document.getElementById("last_name").value,
            age,
            gender: document.getElementById("gender").value
        })
    });

    alert("Registrován!");
    window.location.href = "login.html";
}