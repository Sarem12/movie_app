const express = require('express')
const { getactor } =  require('../controllers/actor')
const router = express.Router()
router.route('/:id').get(getactor)

module.exports = router