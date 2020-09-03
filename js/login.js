const URL_API = 'https://radicalcamp-api.herokuapp.com'

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
        console.log(data)
        if (data.sucess) {
            sessionStorage.setItem('sessionName', data.nome)
            window.location.href = `perfil.html?p=${data.nome}`
        } else if (data.code == 401) window.alert('Senha inválida') //TEMP
        else window.alert('Nenhum cadastro encontrado com esse email') //TEMP
    })
})