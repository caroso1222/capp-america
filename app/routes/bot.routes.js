'use strict'

var User = require('../models/user')
var Message = require('../models/message')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const Bot = require('messenger-bot')
const ai = require('../ai/engine')
const messager = require('../ai/messages')
const constants = require('../constants')
var config_params = require('../../config/params')

if (config_params.environment == config_params.DEVELOPMENT) {
    var bot_config = require('../../config/bot.development')
} else {
    var bot_config = require('../../config/bot.production')
}

let bot = new Bot({
    token: bot_config.token,
    verify: bot_config.verify
})

bot.on('error', (err) => {
    console.log(err.message)
})



bot.on('message', (payload, reply) => {
    let text = payload.message.text
    getOrCreateUser(payload.sender.id, (err, user) => {
        if (user.status == "undefined") {
            sendTournamentPrompt(user, 'AMERICA')
            user.last_message = 'tournament_prompt:AMERICA'
            user.status = "existent"
            user.save()
        } else {
            let components = user.last_message.split(':')
            if (components[0] == 'tournament_prompt') {
                let reply_text = ""
                let tournament = components[1]
                if (identifyPositive(text)) {
                    if (user.tournaments.indexOf(tournament) == -1) {
                        user.tournaments.push(tournament)
                    }
                    reply_text = '¡Perfecto! Te enviaré todos los resultados de la ' + constants.tournaments[tournament] + '.'
                    user.last_message = 'subscribed'
                } else if (identifyNegative(text)) {
                    let index = user.tournaments.indexOf(tournament)
                    if (index > -1) {
                        user.tournaments.splice(index, 1)
                    }
                    reply_text = 'Está bien. No te molestaré con notificaciones de la ' + constants.tournaments[tournament] + '.'
                    user.last_message = 'unsubscribed'
                } else {
                    reply_text = 'Por favor responde Si o No pues es lo único que puedo entender. ¿Deseas suscribirte a mis notificaciones?'
                }
                user.save((err, obj) => {
                    let temp_text = ""
                    if (err) {
                        temp_text = {
                            text: 'No pudimos agregarte a nuestra lista de suscritos'
                        }
                    } else {
                        temp_text = {
                            text: reply_text
                        }
                    }
                    replyMessage(reply, temp_text)
                })
            } else {
                //The user is sending random messages.
                //IF SOME AI FUNCTIONALITY IS TO BE IMPLEMENTED, THIS IS THE PLACE TO DO IT
                let engineOutput = ai.processMessage(text)
                messager.getMessageToSend(engineOutput, function(err, message) {
                    if (message.type == "card") {
                        let elems = message.payload
                        let carrousel = new CardCarrousel()
                        for (let i = 0; i < elems.length; i++) {
                            carrousel.appendCard(elems[i].title, '', elems[i].image_url)
                        }
                        //console.log(JSON.stringify(carrousel.getBody()))
                        carrousel.send(payload.sender.id)
                    } else {
                        reply_text = {
                            text: message.message
                        }
                        replyMessage(reply, reply_text)
                    }
                })
            }
        }
    })
})

//Postback called when showing the notification permission prompt
bot.on('postback', (payload, reply) => {
    var reply_text = "";
    let text = ""
    User.findOne({
        user_id: payload.sender.id
    }, (err, user) => {
        if (err) return console.log("there was an error")

        let components = payload.postback.payload.split("_") //the payload comes separated with '_'

        if (components[0] == "tournament") {
            let response = components[1] //The payload comes as "yes_EURO" "no_AMERICA". So here is the response stored
            let tournament = components[2] //The payload comes as "yes_EURO" "no_AMERICA". So here is the tournament stored
            if (response == 'yes') {
                if (user.tournaments.indexOf(tournament) == -1) {
                    user.tournaments.push(tournament)
                }
                reply_text = '¡Perfecto! Te enviaré todos los resultados de la ' + constants.tournaments[tournament] + '.'
                user.last_message = 'subscribed'
            } else {
                let index = user.tournaments.indexOf(tournament)
                if (index > -1) {
                    user.tournaments.splice(index, 1)
                }
                reply_text = 'Está bien. No te molestaré con notificaciones de la ' + constants.tournaments[tournament] + '.'
                user.last_message = 'unsubscribed'
            }
        }
        user.save((err, obj) => {
            let temp_text = ""
            if (err) {
                temp_text = {
                    text: 'No pudimos agregarte a nuestra lista de suscritos'
                }
            } else {
                temp_text = {
                    text: reply_text
                }
            }
            replyMessage(reply, temp_text)
        })
    })
})

/* Finds a user or creates one if not found */
function getOrCreateUser(user_id, cb) {
    User.findOne({
        user_id: user_id
    }, (err, user) => { //Looks for the user in the DB
        if (err) {
            cb(err)
        }
        if (user) {
            cb(null, user)
        } else {
            bot.getProfile(user_id, (err, profile) => {
                if (err) {
                    cb(err)
                }
                //Adds new user to the database
                var user = {
                    name: profile.first_name,
                    lastname: profile.last_name,
                    user_id: user_id,
                    status: 'undefined', //when a user is added it's not unsubscribed nor subscribed
                    last_message: 'prompt'
                }
                var elem = new User(user)
                elem.save((err, obj) => {
                    if (err) {
                        cb(err)
                    }
                    cb(null, obj)
                })
            })
        }
    })
}

function getUser(user_id, cb) {
    User.findOne({
        user_id: user_id
    }, (err, user) => { //Looks for the user in the DB
        if (err) {
            cb(err)
        }
        cb(null, user)
    })
}

function addUser(user, cb) {
    var elem = new User(user)
    elem.save((err, obj) => {
        if (err) {
            return console.log(err)
        }
        cb(null, obj)
    })
}

function replyMessage(reply, replyText) {
    reply(replyText, (err) => {
        if (err) return console.log(err)
    })
}

function sendGoalToUser(in_payload, user_id) {
    var info = in_payload.scorer + "\nMinuto " + in_payload.minute + "\n" + constants.countryNames[in_payload.team_1.country] + " (" + in_payload.team_1.score + ") - " + constants.countryNames[in_payload.team_2.country] + " (" + in_payload.team_2.score + ")"
    let img = constants.pics.goals[in_payload.country]
    let carrousel = new CardCarrousel()
    carrousel.appendCard('¡Gol de ' + constants.countryNames[in_payload.country] + "!", info, img)
    carrousel.send(user_id)
}

function sendMatchResults(in_payload, user_id) {
    var result = constants.countryNames[in_payload.team_1.country] + " (" + in_payload.team_1.score + ") - " + constants.countryNames[in_payload.team_2.country] + " (" + in_payload.team_2.score + ")";
    var img = constants.getPicForMatch(in_payload.team_1.country, in_payload.team_2.country, 'results')
    let carrousel = new CardCarrousel()
    carrousel.appendCard(result, in_payload.comment, img)
    carrousel.send(user_id)
}

function sendMatchStart(in_payload, user_id) {
    var result = constants.countryNames[in_payload.team_1.country] + " - " + constants.countryNames[in_payload.team_2.country]
    var img = constants.getPicForMatch(in_payload.team_1.country, in_payload.team_2.country, 'start')
    let carrousel = new CardCarrousel()
    carrousel.appendCard(result, in_payload.comment, img)
    carrousel.send(user_id)
}

function sendTextToUser(text, user_id) {
    bot.sendMessage(user_id, {
        text: text
    }, function(err, info) {
        if (err) {
            return console.log(err)
        } else {
            //console.log(info)
        }
    })
}

// Returns true is message contains some affirmation text. False if not recognizable
function identifyPositive(message) {
    var validation = ((message.match(/si/i)) ? true : false)
    validation = validation || ((message.match(/sí/i)) ? true : false)
    validation = validation || ((message.match(/clar/i)) ? true : false)
    validation = validation || ((message.match(/afirm/i)) ? true : false)
    validation = validation || ((message.match(/perf/i)) ? true : false)
    validation = validation || ((message.match(/vale/i)) ? true : false)
    return validation;
}

// Returns true is message contains some negation text. False if not recognizable
function identifyNegative(message) {
    var validation = ((message.match(/no/i)) ? true : false)
    validation = validation || ((message.match(/ni/i)) ? true : false)
    validation = validation || ((message.match(/nunc/i)) ? true : false)
    validation = validation || ((message.match(/negati/i)) ? true : false)
    return validation;
}

// Returns true is message contains some negation text. False if not recognizable
function identifyGratefulness(message) {
    var validation = ((message.match(/grac/i)) ? true : false)
    validation = validation || ((message.match(/super/i)) ? true : false)
    validation = validation || ((message.match(/súper/i)) ? true : false)
    validation = validation || ((message.match(/chév/i)) ? true : false)
    validation = validation || ((message.match(/chev/i)) ? true : false)
    validation = validation || ((message.match(/increi/i)) ? true : false)
    validation = validation || ((message.match(/geni/i)) ? true : false)
    validation = validation || ((message.match(/fant/i)) ? true : false)
    validation = validation || ((message.match(/vale/i)) ? true : false)
    validation = validation || ((message.match(/fenome/i)) ? true : false)
    validation = validation || ((message.match(/fantás/i)) ? true : false)
    validation = validation || ((message.match(/excele/i)) ? true : false)
    return validation;
}

function sendTournamentPrompt(user, tournament) {
    let message = "Quieres suscribirte?"
    if (tournament == 'AMERICA') {
        message = 'Hola ' + user.name + '! Soy un bot apasionado por el fútbol. ¿Me autorizas a enviarte notificaciones de todo lo que pase en la Copa América Centenario?'
    } else if (tournament == 'EURO') {
        message = "¿Disfrutando de la Copa América " + user.name + "? Pues ahora también puedo hablar de la Eurocopa! Sin notificaciones de goles ni inicio de partidos, solo resultados para que estés enterado. ¿Deseas suscribirte a las notificaciones de la Eurocopa?"
    }
    var payload = {
        'attachment': {
            type: 'template',
            payload: {
                'template_type': 'button',
                'text': message,
                'buttons': [{
                    'type': 'postback',
                    'title': 'Si',
                    'payload': 'tournament_yes_' + tournament
                }, {
                    'type': 'postback',
                    'title': 'No',
                    'payload': 'tournament_no_' + tournament
                }]
            }
        }
    }
    bot.sendMessage(user.user_id, payload, function(err, info) {
        if (err) {
            return console.log(err)
        } else {
            console.log(info)
        }
    })
}


var routes = function(app) {

    /*app.get('/', (req, res) => {
    	return bot._verify(req, res)
    })*/

    app.post('/', (req, res) => {
        bot._handleMessage(req.body)
        res.end(JSON.stringify({
            status: 'ok'
        }))
    })

    app.post('/bot/send_message', (req, res) => {
        console.log(req.body)
        User.count({}, function(err, count) {
            User.find(function(err, elems) {
                elems.forEach(function(elem, idx) {
                    let tournament = req.body.tournament
                    if (elem.tournaments.indexOf(tournament) > -1) {
                        if (req.body.type == 'text') {
                            sendTextToUser(req.body.text, elem.user_id)
                        } else if (req.body.type == 'goal') {
                            sendGoalToUser(req.body, elem.user_id)
                        } else if (req.body.type == 'match') {
                            sendMatchResults(req.body, elem.user_id)
                        } else if (req.body.type == 'start') {
                            sendMatchStart(req.body, elem.user_id)
                        }
                    }
                })
            })
        })
        return res.send("Messages sucessfully sent")
    })

    app.post('/bot/sendEuroPrompt', (req, res) => {
        User.find((err, elems) => {
            elems.forEach((elem, idx) => {
                //Send prompt only if the user is not already subscribed
                if (elem.tournaments.indexOf('EURO') == -1) {
                    sendTournamentPrompt(elem, 'EURO')
                    elem.last_message = 'tournament_prompt:EURO'
                    elem.save()
                }
            })
        })
        return res.send("Messages sucessfully sent")
    })

    app.get('/bot/test', (req, res) => {
        let user_id = '282809145392153'

        getOrCreateUser(user_id, (err, user) => {
            console.log(user)
        })
        return res.send("ready")
    })
}

class CardCarrousel {
    constructor() {
        this.body = {
            'attachment': {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: []
                }
            }
        }
    }

    //append new element to card carrousel
    appendCard(title, subtitle, img) {
        this.body.attachment.payload.elements.push({
            title: title,
            subtitle: subtitle,
            image_url: img
        })
    }

    getBody() {
        return this.body
    }

    //sends this card to a user
    send(user_id) {
        bot.sendMessage(user_id, this.body, function(err, info) {
            if (err) {
                return console.log(err)
            } else {
                console.log(info)
            }
        })
    }
}


module.exports = routes;
