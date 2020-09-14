const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    nome: {
        type: String,
        required: false,
        default: "Campeonato sem nome"
    },
    data: {
        type: String,
        required: false,
        default: "01/01/1970" //Indefinido
    },
    hora: {
        type: String,
        required: false,
        default: "00:00"
    },
    maxPlayers: {
        type: Number,
        required: false,
        default: 0 //ilimitado
    },
    listaPlayers: [{ type: Object }],
    limiteDataInscricoes: {
        type: String,
        required: false,
        default: "01/01/1970" //sem limite
    },
    inscricoesOn: {
        type: Boolean,
        required: false,
        default: true
    },
    premiacao: {
        type: Number,
        required: false,
        default: 0
    },
    inscricao: {
        type: Number,
        required: false,
        default: 0
    },
    campType: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Camp', schema);