const URL_API = 'https://radicalcamp-api.herokuapp.com'

const form = document.getElementById('formCadastro')

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeForm').value
    const email = document.getElementById('emailForm').value
    const cel = document.getElementById('celForm').value
    const senha = document.getElementById('senhaForm').value
    const repetirSenha = document.getElementById('repetirSenha').value

    if (senha != repetirSenha){
        document.getElementById('formCadastro').elements[4].setCustomValidity("Senhas diferentes!")
        return
    }

    var payload = JSON.stringify({
        nome: nome,
        email: email,
        cel: cel,
        senha: senha
    })

    var cadastro = await fetch(`${URL_API}/cadastro`, {
        credentials: 'include',
        method: 'POST',
        body: payload,
        headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    await cadastro.json().then(data => {
        if (data.sucess) window.alert('Cadastrado') //TEMP
        else if (data.code == 409) window.alert('Cadastro repetido') //TEMP
        else window.alert('Server Error') //TEMP
    })
})