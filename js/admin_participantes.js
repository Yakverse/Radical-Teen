$.extend({
    getUrlVars: function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++){
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
})
const campID = $.getUrlVars()['c']

deleteUser = async userID => {
    var payload = JSON.stringify({userID: userID, campID: campID})
    await fetch(`${URL_API}/delete-user`, {
        credentials: 'include',
        method: 'DELETE',
        body: payload,
        headers: {"Content-Type": "application/json; charset=UTF-8"}
    }).then(response => {
        if (!response.ok) window.location.href = 'admin.html'
        else window.location.reload(true) //TEMP
    })
}

editStatus = async userID => {
    var payload = JSON.stringify({userID: userID, campID: campID})
    await fetch(`${URL_API}/change-status`, {
        credentials: 'include',
        method: 'PUT',
        body: payload,
        headers: {"Content-Type": "application/json; charset=UTF-8"}
    }).then(response => {
        if (!response.ok) window.location.href = 'admin.html'
        else window.location.reload(true) //TEMP
    })
}

loadParticipantes = async () => {
    var payload = JSON.stringify({campID: campID})

    await fetch(`${URL_API}/camp-admin`, {
        credentials: 'include',
        method: "POST",
        body: payload,
        headers: {"Content-Type": "application/json; charset=UTF-8"}
    }).then(async response => {
        if (!response.ok) {
            window.alert('Erro') //TEMP
            window.location.href = 'admin.html'
        } else {
            var data = await response.json()

            var table = document.getElementById('table')
            data.listaPlayers.forEach(value => {
                if (value.status) table.innerHTML += 
                `<tr class="cadaUsuario">
                    <td>${value.nome}</td>
                    <td>${value.user}</td>
                    <td>${value.email}</td>
                    <td>${value.cel}</td>
                    <td class="estadoDoUsuario"><i class="fas fa-circle inscrito"></i></td>
                    <td class="botoesUsuario">
                        <i class="fas fa-trash-alt exclude" onclick="deleteUser('${value.id}')"></i>
                    </td>
                </tr>
                `
                else table.innerHTML += 
                `<tr class="cadaUsuario">
                    <td>${value.nome}</td>
                    <td>${value.user}</td>
                    <td>${value.email}</td>
                    <td>${value.cel}</td>
                    <td class="estadoDoUsuario"><i class="fas fa-circle aguardo"></i></td>
                    <td class="botoesUsuario">
                        <i class="fas fa-check add" onclick="editStatus('${value.id}')"></i>
                        <i class="fas fa-trash-alt exclude" onclick="deleteUser('${value.id}')"></i>
                    </td>
                </tr>
                `
            });
        }
    })
}
loadParticipantes()