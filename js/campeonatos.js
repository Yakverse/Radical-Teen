$.extend({
    getUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
})
const campType = $.getUrlVars()['j']
document.getElementById('tituloJogo').innerHTML = campType.toUpperCase()

loadCamp = async () => {
    await fetch(`${URL_API}/camps?tag=${campType}`, {
        credentials: 'include',
        method: 'GET'
    }).then(async response => {
        if (response.status == 500) window.href = 'index.html'
        else {
            var data = await response.json()
            var campeonatos = document.getElementById('campeonatos')

            data.forEach(value => {
                campeonatos.innerHTML +=
                    `<a href=campeonato.html?j=${campType}&id=${value._id}><div class="campeonato">
                <div class="imagemCampeonato" style="background: url(img/${campType}.jpg) no-repeat center / cover;">
                    <div class="premiacaoEInscricao">
                        <div class="premiacao">
                            <i class="fas fa-trophy"></i><p>R$ ${value.premiacao}</p>
                        </div>
                        <div class="inscricao">
                            <i class="fas fa-ticket-alt"></i><p>R$ ${value.inscricao}</p>
                        </div>
                    </div>
                </div>
                <div class="campoTitutloCampeonato"> 
                    <h3 class="tituloCampeonato">${value.nome}</h3>
                </div>
                <div class="informacoesCampeonato">
                    <div class="data">
                        <i class="far fa-calendar"></i><p>${value.data}</p>
                    </div>
                    <div class="horario">
                        <i class="far fa-clock"></i><p>${value.hora}</p>
                    </div>
                </div>
                <div class="botaoCampeonato">
                    <button class="botaoCampeonatoInscreva-se"><span>Inscreva-se</span></button>
                </div>
            </div></a>`
            });
        }
    })
}
loadCamp()