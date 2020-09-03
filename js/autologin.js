const URL_API = 'https://radicalcamp-api.herokuapp.com'

autoLogin = async () => {

    if (sessionStorage.getItem('sessionName')){
        document.getElementById('sessionName').innerHTML = sessionStorage.getItem('sessionName').replace(/\"/g, "")
        document.getElementById('sessionLink').href = `perfil.html?p=${sessionStorage.getItem('sessionName').replace(/\"/g, "")}`
        return
    } 

    await fetch(`${URL_API}/user/info`,{
        credentials: 'include',
        method: 'POST',
        headers: {"Content-Type": "application/json; charset=UTF-8"}
    }).then(async response => {
        var data = await response.json()
        if (response.ok) {
            sessionStorage.setItem('sessionName', JSON.stringify(data.data.usuario))
            document.getElementById('sessionName').innerHTML = data.data.usuario
            document.getElementById('sessionLink').href = `perfil.html?p=${data.data.usuario}`
        } else {
            if (sessionStorage.getItem('sessionName')){
                sessionStorage.removeItem('sessionName')
            }
            if(!window.location.pathname == '/index.html') window.location.href = 'index.html'
        }
    })
}
autoLogin()