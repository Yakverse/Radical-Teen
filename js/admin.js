deleteCamp = async (campID, campName) => {
    if (confirm(`Deseja deletar o campeonato ${campName}?`)){
        var payload = JSON.stringify({campID: campID})
        await fetch(`${URL_API}/delete-camp`, {
            credentials: 'include',
            method: 'DELETE',
            body: payload,
            headers: {"Content-Type": "application/json; charset=UTF-8"}
        }).then(response => {
            if (!response.ok) window.location.href = 'index.html'
            window.location.reload(true)
        })
    }
}

loadCamps = async () => {
    await fetch(`${URL_API}/camps`, {
        credentials: 'include',
        method: "GET",
    }).then(async response => {
        if (response.status == 500) window.alert("Internal Server Error")
        else {
            var data = await response.json()
            data.forEach(value => {
                try {
                    document.getElementById(value.campType).innerHTML += 
                    `<div class="blocoCampeonato">
                        <div class="blocoCampeonatoCompleto">
                            <img class="blocoCampeonatoImg" title="${value['nome'].toUpperCase()}" src="img/${value.campType}.jpg">
                            <div class="blocoNomeCampeonato">
                                <div class="nomeCampeonatoDiv">
                                    <h2 class="nomeCampeonato" title="${value['nome'].toUpperCase()}">${value['nome'].toUpperCase()}</h2>
                                </div>
                            </div>
                            <div class="blocoCampeonatoBotoes">
                                <button class="botaoDeletar botaoBlocoCampeonato" onclick="deleteCamp('${value._id}', '${value.nome}')"><span></span></button>
                                <a href="admin_edit.html?c=${value._id}"><button class="botaoEditar botaoBlocoCampeonato"><span></span></button></a>
                                <a href="admin_participantes.html?c=${value._id}"><button class="botaoParticipantes botaoBlocoCampeonato"><span></span></button></a>
                            </div>
                        </div>
                    </div>`
                } catch {
                    document.getElementById('campeonatosDiv').innerHTML += 
                    `<div class="campeonatoJogo">
                        <h2 class="nomeJogoCampeonato">${value['campType'].toUpperCase()}<span class="iconeClicar iconeArroRight"></span></h2>
                        <div class="blocoJogosCampeonato" id="${value.campType}"></div>
                    </div>`
                    document.getElementById(value.campType).innerHTML += 
                    `<div class="blocoCampeonato">
                        <div class="blocoCampeonatoCompleto">
                            <img class="blocoCampeonatoImg" title="${value['nome'].toUpperCase()}" src="img/${value.campType}.jpg">
                            <div class="blocoNomeCampeonato">
                                <div class="nomeCampeonatoDiv">
                                    <h2 class="nomeCampeonato" title="${value['nome'].toUpperCase()}">${value['nome'].toUpperCase()}</h2>
                                </div>
                            </div>
                            <div class="blocoCampeonatoBotoes">
                                <button class="botaoDeletar botaoBlocoCampeonato" onclick="deleteCamp('${value._id}', '${value.nome}')"><span></span></button>
                                <a href="admin_edit.html?c=${value._id}"><button class="botaoEditar botaoBlocoCampeonato"><span></span></button></a>
                                <a href="admin_participantes.html?c=${value._id}"><button class="botaoParticipantes botaoBlocoCampeonato"><span></span></button></a>
                            </div>
                        </div>
                    </div>`
                }
            });
            data.forEach(element => {
                try {
                    document.getElementById(`btnAdd${element.campType}`).value
                } catch {
                    document.getElementById(element.campType).innerHTML += 
                    `<div class="blocoCampeonato editBloco" id="btnAdd${element.campType}">
                        <div class="blocoCampeonatoCompleto">
                            <img class="blocoCampeonatoImgAdicionar" src="img/plus.png">
                            <div class="blocoNomeCampeonato">
                                <div class="nomeCampeonatoDiv">
                                    <h2 class="nomeCampeonato">NOME DO CAMPEONATO</h2>
                                </div>
                            </div>
                            <div class="blocoCampeonatoBotoes">
                                <button class="botaoDeletar botaoBlocoCampeonato"><span></span></button>
                                <button class="botaoEditar botaoBlocoCampeonato"><span></span></button>
                                <button class="botaoParticipantes botaoBlocoCampeonato"><span></span></button>
                            </div>
                        </div>
                    </div>`
                }
            });
        }
    })
}

document.addEventListener('readystatechange', async () => {
    if (document.readyState == 'complete'){
        await loadCamps()
        
        $(".nomeJogoCampeonato").click(async function(){
            $(this).find(".iconeClicar").toggleClass("iconeArrowDown ")
            $(this).parent().children(".blocoJogosCampeonato").toggle()
        });

        $('.blocoCampeonato').click(async function() {
            var payload = JSON.stringify({campType: this['id'].replace('btnAdd', '')})

            await fetch(`${URL_API}/create-camp`, {
                credentials: 'include',
                method: "POST",
                body: payload,
                headers: {"Content-Type": "application/json; charset=UTF-8"}
            }).then(async response => {
                if (!response.ok) {
                    window.alert('Erro') //TEMP
                    window.location.reload(true)
                } else {
                    var data = await response.json()
                    window.location.href = `admin_edit.html?c=${data.id}`
                }
            })
        });
    }
});
