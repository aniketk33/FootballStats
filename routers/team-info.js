const express = require('express');
const routes = express.Router()

const teamInfo = require('../controllers/team-info')

//authorization
const tokenAuthorization = require('../middlewares/token-authorization')

routes.get('/', tokenAuthorization, teamInfo.getTeamsList)

routes.get('/:teamId/squad', tokenAuthorization, teamInfo.getSquadInfo)

routes.get('/:teamId/fixtures', tokenAuthorization, teamInfo.getTeamFixtures)

module.exports = routes