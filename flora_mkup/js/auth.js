// Mostrar / ocultar senha
function togglePassword(el) {
    const input = el.previousElementSibling;
    if (input.type === "password") {
        input.type = "text";
        el.textContent = "Ocultar";
    } else {
        input.type = "password";
        el.textContent = "Mostrar";
    }
}

// Simulação de login
function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        alert("Preencha todos os campos.");
        return;
    }

    // Mock simples
    alert("Login realizado com sucesso!");
    window.location.href = "index.html";
}

// Simulação de cadastro
function register() {
    const name = document.getElementById("cad-name").value;
    const email = document.getElementById("cad-email").value;
    const password = document.getElementById("cad-password").value;

    if (!name || !email || !password) {
        alert("Preencha todos os campos.");
        return;
    }

    alert("Conta criada com sucesso!");
    window.location.href = "login.html";
}
