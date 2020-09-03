const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    nome: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: false,
        default: 0 //Indefinido
    },
    maxPlayers: {
        type: Number,
        required: false,
        default: 0 //ilimitado
    },
    listaPlayers: [{
        type: String,
        require: false
    }],
    limiteDataInscrições: {
        type: String,
        required: false,
        default: 0 //sem limite
    },
    inscricoesOn: {
        type: Boolean,
        required: false,
        default: true
    },
    premiacao: {
        type: Number,
        required: true
    },
    inscricao: {
        type: Number,
        required: true
    },
    campType: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Camp', schema);