const URL_API = 'http://34.74.80.166:3000'
const form = document.getElementById('formLogin')

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    var email = document.getElementById('emailForm').value
    var senha = document.getElementById('senhaForm').value

    var payload = JSON.stringify({
        email: email,
        senha: senha
    })

    var login = await fetch(`${URL_API}/login`, {
        credentials: 'include',
        method: 'POST',
        body: payload,
        headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    await login.json().then(data => {
        if (data.sucess) {
            sessionStorage.setItem('sessionName', data.nome)
            if (link == 'perfil') window.location.href = `perfil.html?p=${data.nome}`
            else window.location.href = document.referrer || 'index.html'
        } else if (data.code == 401) window.alert('Senha inválida') //TEMP
        else if (data.code == 404) window.alert('Nenhum cadastro encontrado com esse email') //TEMP
        else window.location.href = 'index.html'
    })
})