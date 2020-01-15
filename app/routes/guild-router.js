const express = require('express')

const GuildCtrl = require('../controllers/guild-ctrl')

const router = express.Router()

router.post('/guild', GuildCtrl.createGuild)
router.put('/guild/:id', GuildCtrl.updateGuild)
router.delete('/guild/:id', GuildCtrl.deleteGuild)
router.get('/guild/:id', GuildCtrl.getGuildById)
router.get('/guilds', GuildCtrl.getGuilds)

module.exports = router