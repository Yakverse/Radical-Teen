const mongoose = require('mongoose');
const User = mongoose.model('User');
const Camp = mongoose.model('Camp');

exports.createCamp = (req, res, next) => {

    // header = (sessionID: '')
    // body = {
    //     campType = ''
    // }

    User.findById(req.headers.cookie.split('=')[1]).then(data => {
        if (Object.keys(data).length == 0) {
            res.clearCookie('sessionID', {path: '/'})
            return res.status(404).send()
        }
        if (!data.admin) return res.status(401).send({code: 401, sucess: false})

        new Camp(req.body).save().then(message => {
            res.status(201).send({code: 201, sucess: true, id: message.id})
        }).catch(error => {
            res.status(400).send({code: 400, sucess: false, error: error})
        })
    }).catch(() => {
        res.clearCookie('sessionID', {path: '/'})
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
            if (Object.keys(dataUser).length == 0) {
                res.clearCookie('sessionID', {path: '/'})
                return res.status(404).send()
            }
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

exports.editCamp = (req, res, next) => {

    // header = {sessionID: ''}
    // body = {
    //     campID: '',
    //     campProp: [],
    //     info: [],
    // }

    User.findById(req.headers.cookie.split('=')[1]).then(userData => {
        if (Object.keys(userData).length == 0) {
            res.clearCookie('sessionID', {path: '/'})
            return res.status(404).send()
        }
        if (!userData.admin) return res.status(401).send()

        Camp.findById(req.body.campID).then(campData => {
            campInfos = {
                nome(info) {
                    campData.nome = info
                },
                data(info) {
                    campData.data = info
                },
                maxPlayers(info) {
                    campData.maxPlayers = info
                },
                listaPlayers(info) {
                    campData.listaPlayers = info
                },
                limiteDataInscrições(info) {
                    campData.limiteDataInscrições = info
                },
                inscricoesOn(info) {
                    campData.inscricoesOn = info
                },
                premiacao(info) {
                    campData.premiacao = info
                },
                inscricao(info) {
                    campData.inscricao = info
                },
                campType(info) {
                    campData.campType = info
                }
            }

            req.body.campProp.forEach((value, i) => {
                campInfos[value](req.body.info[i])
            })
            Camp.replaceOne({_id: req.body.campID}, campData).then(() => {
                res.status(201).send()
            }).catch(() => {
                res.status(500).send()
            })
        }).catch(() => {
            res.status(400).send()
        })
    }).catch(() => {
        res.status(400).send()
    })
}

exports.deleteCamp = (req, res, next) => {

    // header = {sessionID: ''}
    // body = {
    //     campID: ''
    // }

    User.findById(req.headers.cookie.split('=')[1]).then(data => {
        if (Object.keys(data).length == 0) {
            res.clearCookie('sessionID', {path: '/'})
            return res.status(404).send()
        }
        if (!data.admin) return res.status(401).send()

        Camp.deleteOne({_id: req.body.campID}).then(() => {
            res.status(200).send()
        }).catch(() => {
            res.status(404).send()
        })
    }).catch(() => {
        res.clearCookie('sessionID', {path: '/'})
        res.status(400).send()
    })
}

exports.allCamps = (req, res, next) => {
    var payload = {}
    if (Object.keys(req.query).length != 0) {
        payload = {campType: req.query.tag}
    }
    Camp.find(payload).then(data => {
        data.forEach(value => {value.listaPlayers = undefined})
        res.status(200).send(data)
    }).catch(() => {
        res.status(500).send()
    })
}

exports.getCamp = (req, res, next) => {
    // header = {sessionID: ''}
    // body = {
    //     campID: ''
    // }

    User.findById(req.headers.cookie.split('=')[1]).then(data => {
        if (Object.keys(data).length == 0) {
            res.clearCookie('sessionID', {path: '/'})
            return res.status(404).send()
        }
        if (!data.admin) return res.status(401).send()

        Camp.findById(req.body.campID, {_id: 0}).then(data => {
            if (Object.keys(data).length == 0) return res.status(404).send()
            res.status(200).send(data)
        }).catch(() => {
            res.status(400).send()
        })
    })
}