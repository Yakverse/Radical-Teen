const mongoose = require('mongoose');
const User = mongoose.model('User');
const Camp = mongoose.model('Camp');

exports.createCamp = (req, res, next) => {

    // header = (sessionID: '')
    // body = {
    //     nome = '',
    //     maxPlayers = '',
    //     premiacao = XXX,
    //     inscricao = XXX,
    //     campType = ''
    // }

    User.findById(req.headers.cookie.split('=')[1]).then(data => {
        if (!data.admin) return res.status(401).send({code: 401, sucess: false})

        new Camp(req.body).save().then(() => {
            res.status(201).send({code: 201, sucess: true})
        }).catch(error => {
            res.status(400).send({code: 400, sucess: false, error: error})
        })
    }).catch(() => {
        res.status(401).send({code: 401, sucess: false, error: 'Invalid SessionID'})
    })
}

exports.inscriçãoCamp = (req, res, next) => {

    // header = {sessionID: ''}
    // body = {
    //     campID: ''
    // }

    Camp.findById(req.body.campID).then(dataCamp => {
        if ((!dataCamp.inscricoesOn) || (dataCamp['listaPlayers'].length >= dataCamp.maxPlayers && dataCamp.maxPlayers != "0") || (dataCamp.limiteDataInscrições != "0")) {
            if (dataCamp.inscricoesOn){
                dataCamp.inscricoesOn = false
                Camp.replaceOne({_id: req.body.campID}, dataCamp).then()
            }
            return res.status(200).send({code: 200, sucess: false, error: 'Fim das inscricoes'})
        }

        User.findById(req.headers.cookie.split('=')[1]).then(dataUser => {
            for (users in dataUser.listaPlayers) {
                if (dataUser.listaPlayers[users] == req.headers.cookie.split('=')[1]) return res.status(409).send({code: 409, sucess: false, error: 'Ja cadastrado'})
            }

            dataCamp['listaPlayers'].push(req.headers.cookie.split('=')[1])
            Camp.replaceOne({_id: req.body.campID}, dataCamp).then(() => {
                res.status(200).send({code: 200, sucess: true})
            }).catch(() => {
                res.status(500).send({code: 500, sucess: false})
            })
        }).catch(() => {
            res.status(401).send({code: 401, sucess: false})
        })
    }).catch(() => {
        res.status(400).send({code: 400, sucess: false, error: 'Campeonato nao encontrado'})
    })
}

exports.allCamps = (req, res, next) => {
    var payload = {}
    if (Object.keys(req.query).length != 0) {
        payload = {campType: req.query.tag}
    }
    Camp.find(payload).then(data => {
        res.status(200).send(data)
    }).catch(() => {
        res.status(500).send()
    })
}