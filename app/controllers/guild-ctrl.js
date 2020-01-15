const Guild = require('../models/guild-model')

createGuild = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a guild',
        })
    }

    const guild = new Guild(body)

    if (!guild) {
        return res.status(400).json({ success: false, error: err })
    }

    guild
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: guild._id,
                message: 'Guild created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Guild not created!',
            })
        })
}

updateGuild = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Guild.findOne({ _id: req.params.id }, (err, guild) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Guild not found!',
            })
        }
        guild.name = body.name
        guild.time = body.time
        guild.rating = body.rating
        guild
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: guild._id,
                    message: 'Guild updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Guild not updated!',
                })
            })
    })
}

deleteGuild = async (req, res) => {
    await Guild.findOneAndDelete({ _id: req.params.id }, (err, guild) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!guild) {
            return res
                .status(404)
                .json({ success: false, error: `Guild not found` })
        }

        return res.status(200).json({ success: true, data: guild })
    }).catch(err => console.log(err))
}

getGuildById = async (req, res) => {
    await Guild.findOne({ _id: req.params.id }, (err, guild) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!guild) {
            return res
                .status(404)
                .json({ success: false, error: `Guild not found` })
        }
        return res.status(200).json({ success: true, data: guild })
    }).catch(err => console.log(err))
}

getGuilds = async (req, res) => {
    await Guild.find({}, (err, guilds) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!guilds.length) {
            return res
                .status(404)
                .json({ success: false, error: `Guild not found` })
        }
        return res.status(200).json({ success: true, data: guilds })
    }).catch(err => console.log(err))
}

module.exports = {
    createGuild,
    updateGuild,
    deleteGuild,
    getGuilds,
    getGuildById,
}