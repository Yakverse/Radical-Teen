const URL_API = 'https://api.radicalteen.com.br'
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
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    await login.json().then(data => {
        if (data.sucess) {
            sessionStorage.setItem('sessionName', data.nome)
            sessionStorage.setItem('activeEmail', data.active || 'false')
            window.location.href = document.referrer || 'index.html'
        } else if (data.code == 401) {
            $("#toast").toast({
                type: 'error',
                message: 'Senha inválida!'
            });
        }
        else if (data.code == 404) {
            $("#toast").toast({
                type: 'error',
                message: 'Nenhum cadastro com esse email!'
            });
        }
        else window.location.href = 'index.html'
    })
})