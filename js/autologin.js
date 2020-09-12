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

autoLogin = async () => {

    if (sessionStorage.getItem('sessionName')){
        document.getElementById('sessionName').innerHTML = sessionStorage.getItem('sessionName').replace(/\"/g, "")
        document.getElementById('sessionLink').href = `perfil.html?p=${sessionStorage.getItem('sessionName').replace(/\"/g, "")}`
        document.getElementById('logoutOutput').innerHTML += `<i class="icones faIcones logout fas fa-sign-out-alt" onclick=logout()></i>`
        return
    } 

    await fetch(`${URL_API}/user/info`,{
        credentials: 'include',
        method: 'POST',
        headers: {"Content-Type": "application/json; charset=UTF-8"}
    }).then(async response => {
        if (response.status == 200) {
            var data = await response.json()
            sessionStorage.setItem('sessionName', JSON.stringify(data.data.usuario))
            document.getElementById('sessionName').innerHTML = data.data.usuario
            document.getElementById('sessionLink').href = `perfil.html?p=${data.data.usuario}`
            document.getElementById('logoutOutput').innerHTML += `<i class="icones faIcones logout fas fa-sign-out-alt" onclick=logout()></i>`
        } else if (response.status == 404 || response.status == 400) {
            if (sessionStorage.getItem('sessionName')) sessionStorage.removeItem('sessionName')
            if(!window.location.pathname == '/index.html') window.location.href = 'index.html'
        }
    })
}
autoLogin()