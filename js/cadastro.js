const URL_API = 'https://api.radicalteen.com.br'

document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    document.getElementById('formCadastro').elements[4].setCustomValidity("")

    var user = document.getElementById('userForm').value
    var nome = document.getElementById('nomeForm').value
    var email = document.getElementById('emailForm').value
    var cel = document.getElementById('celForm').value
    var senha = document.getElementById('senhaForm').value
    var repetirSenha = document.getElementById('repetirSenha').value

    if (senha != repetirSenha) {
        document.getElementById('formCadastro').elements[4].setCustomValidity("Senhas diferentes!")
        return
    }

    var payload = JSON.stringify({
        usuario: user,
        nome: nome,
        email: email,
        cel: cel,
        senha: senha
    })

    var cadastro = await fetch(`${URL_API}/cadastro`, {
        credentials: 'include',
        method: 'POST',
        body: payload,
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    await cadastro.json().then(data => {
        if (data.sucess) {
            sessionStorage.setItem('sessionName', user)
            window.location.href = `perfil.html?p=${user}`
        }
        else if (data.code == 409) {
            $("#toast").toast({
                type: 'error',
                message: 'Cadastro Repetido'
            });
        }
        else {
            $("#toast").toast({
                type: 'error',
                message: 'Erro'
            });
        }
    })
})