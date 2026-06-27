const btnEditar = document.getElementById('btn-editar');
const modalLogin = document.getElementById('modal-login');
const modalEditar = document.getElementById('modal-editar');

const btnLogin = document.getElementById('btn-login');
const btnCancelarLogin = document.getElementById('btn-cancelar-login');
const btnSalvar = document.getElementById('btn-salvar');
const btnCancelarEditar = document.getElementById('btn-cancelar-editar');

const loginErro = document.getElementById('login-erro');
const editSucesso = document.getElementById('edit-sucesso');
const editErro = document.getElementById('edit-erro');

const API_BASE = 'http://127.0.0.1:8000';

btnEditar.addEventListener('click', function() {
    const token = localStorage.getItem('access_token');
    if (token) {
        carregarPerfil(token);
    } else {
        modalLogin.style.display = 'block';
    }
});

btnLogin.addEventListener('click', function() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    loginErro.style.display = 'none';

    fetch(API_BASE + '/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password }),
    })
    .then(function(response) {
        if (!response.ok) throw new Error('Username ou senha incorretos');
        return response.json();
    })
    .then(function(data) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_id', data.user_id);
        modalLogin.style.display = 'none';
        carregarPerfil(data.access);
    })
    .catch(function(erro) {
        loginErro.textContent = erro.message;
        loginErro.style.display = 'block';
    });
});

function carregarPerfil(token) {
    fetch(API_BASE + '/api/perfil/', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
    })
    .then(function(response) {
        if (!response.ok) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            modalLogin.style.display = 'block';
            throw new Error('Token expirado. Faca login novamente.');
        }
        return response.json();
    })
    .then(function(perfil) {
        document.getElementById('edit-nome').value = perfil.nome || '';
        document.getElementById('edit-descricao').value = perfil.descricao || '';
        document.getElementById('edit-curso').value = perfil.curso || '';
        document.getElementById('edit-periodo').value = perfil.periodo || '';
        document.getElementById('edit-email').value = perfil.email || '';
        document.getElementById('edit-git').value = perfil.git || '';
        document.getElementById('edit-linked').value = perfil.linked || '';
        document.getElementById('edit-url_imagem').value = perfil.url_imagem || '';

        editSucesso.style.display = 'none';
        editErro.style.display = 'none';
        modalEditar.style.display = 'block';
    })
    .catch(function(erro) {
        console.error(erro);
    });
}

btnSalvar.addEventListener('click', function() {
    const token = localStorage.getItem('access_token');

    const dados = {
        nome: document.getElementById('edit-nome').value,
        descricao: document.getElementById('edit-descricao').value,
        curso: document.getElementById('edit-curso').value,
        periodo: document.getElementById('edit-periodo').value,
        email: document.getElementById('edit-email').value,
        git: document.getElementById('edit-git').value,
        linked: document.getElementById('edit-linked').value,
        url_imagem: document.getElementById('edit-url_imagem').value,
    };

    fetch(API_BASE + '/api/perfil/', {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    })
    .then(function(response) {
        if (!response.ok) {
            return response.json().then(function(erros) {
                throw new Error(JSON.stringify(erros));
            });
        }
        return response.json();
    })
    .then(function(perfil) {
        editSucesso.style.display = 'block';
        editErro.style.display = 'none';
        setTimeout(function() {
            location.reload();
        }, 1000);
    })
    .catch(function(erro) {
        editErro.textContent = 'Erro ao salvar: ' + erro.message;
        editErro.style.display = 'block';
        editSucesso.style.display = 'none';
    });
});

btnCancelarLogin.addEventListener('click', function() {
    modalLogin.style.display = 'none';
});

btnCancelarEditar.addEventListener('click', function() {
    modalEditar.style.display = 'none';
});