const URL_API = 'https://api.radicalteen.com.br'

logout = async () => {
    await fetch(`${URL_API}/logout`, {
        credentials: 'include',
        method: 'POST'
    }).then(() => {
        sessionStorage.removeItem('sessionName')
        window.location.reload(true)
    })
}

reverification = async () => {
    await fetch(`${URL_API}/reverification`, {
        credentials: 'include',
        method: 'POST'
    }).then(response => {
        if (response.status == 200) $("#toast").toast({ type: 'sucess', message: 'Email enviado!' })
        else if (response.status == 304) {
            sessionStorage.clear()
            $("#toast").toast({ type: 'error', message: 'Seu email já está verificado', reload: true })
        } else $("#toast").toast({ type: 'error', message: 'Falha ao enviar o email!' })
    })
}

autoLogin = async () => {

    if (sessionStorage.getItem('sessionName') && sessionStorage.getItem('activeEmail')) {
        document.getElementById('sessionName').innerHTML = sessionStorage.getItem('sessionName').replace(/\"/g, "")
        document.getElementById('sessionLink').href = `perfil.html?p=${sessionStorage.getItem('sessionName').replace(/\"/g, "")}`
        document.getElementById('logoutOutput').innerHTML += `<i class="icones faIcones logout fas fa-sign-out-alt" onclick=logout()></i>`
        if (sessionStorage.getItem('activeEmail') === 'false') document.body.innerHTML += '<div class="errorMsg"><p>Email não verificado. Clique <a href="#" onclick="return reverification()">aqui</a> para reenviar o email de verificação.</p></div>'
        return
    }

    await fetch(`${URL_API}/user/info`, {
        credentials: 'include',
        method: 'POST',
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }).then(async response => {
        if (response.status == 200) {
            var data = await response.json()
            sessionStorage.setItem('sessionName', JSON.stringify(data.data.usuario))
            document.getElementById('sessionName').innerHTML = data.data.usuario
            document.getElementById('sessionLink').href = `perfil.html?p=${data.data.usuario}`
            document.getElementById('logoutOutput').innerHTML += `<i class="icones faIcones logout fas fa-sign-out-alt" onclick=logout()></i>`
            if (!data.data.active) {
                sessionStorage.setItem('activeEmail', false)
                document.body.innerHTML += '<div class="errorMsg"><p>Email não verificado. Clique <a href="#" onclick="return reverification()">aqui</a> para reenviar o email de verificação.</p></div>'
            } else sessionStorage.setItem('activeEmail', true)
        } else if (response.status == 404 || response.status == 400) {
            if (sessionStorage.getItem('sessionName')) sessionStorage.removeItem('sessionName')
            if (!window.location.pathname == '/index.html') window.location.href = 'index.html'
        }
    })
}
autoLogin()