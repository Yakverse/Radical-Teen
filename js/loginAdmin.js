const URL_API = 'https://radicalcamp-api.herokuapp.com'

autoLogin = async () => {
    await fetch(`${URL_API}/user/info`,{
        credentials: 'include',
        method: 'POST',
        headers: {"Content-Type": "application/json; charset=UTF-8"}
    }).then(async response => {
        if (response.status != 200) {
            if (sessionStorage.getItem('sessionName')) sessionStorage.removeItem('sessionName')
            window.location.href = 'index.html'
        } else {
            var data = await response.json()
            if (sessionStorage.getItem('sessionName')){
                document.getElementById('sessionName').innerHTML = sessionStorage.getItem('sessionName').replace(/\"/g, "")
                document.getElementById('sessionLink').href = `perfil.html?p=${sessionStorage.getItem('sessionName').replace(/\"/g, "")}`
            } else {
                sessionStorage.setItem('sessionName', JSON.stringify(data.data.usuario))
                document.getElementById('sessionName').innerHTML = data.data.usuario
                document.getElementById('sessionLink').href = `perfil.html?p=${data.data.usuario}`
            }
            if (!data.data.admin) window.location.href = 'index.html'
        }
    })
}
autoLogin()