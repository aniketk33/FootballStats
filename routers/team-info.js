const express = require('express');
const routes = express.Router()

const teamInfo = require('../controllers/team-info')

routes.get('/', teamInfo.getTeamsList)

routes.get('/:teamId/squad', teamInfo.getSquadInfo)

routes.get('/:teamId/fixtures', teamInfo.getTeamFixtures)

module.exports = routes