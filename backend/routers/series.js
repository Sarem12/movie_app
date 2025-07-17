const express = require('express')

const { getseries, getallserieses, postseries, patchseries } = require('../controllers/series')
const { getseason, getallseasons, postseason, patchseason } = require('../controllers/season')
const { getep, getallep, postep, patchep, deleteep }= require('../controllers/episode')
const router = express.Router()
router.route('/').get(getallserieses).post(postseries)
router.route('/:id').get(getseries).patch(patchseries).patch(getseries)
router.route('/:id/season/:index').get(getseason).patch(patchseason).patch(getseason).patch(getseason)
router.route('/:id/season').get(getallseasons).post(postseason).post(getallseasons)
router.route('/:id/season/:index/ep/:jindex').get(getep).patch(patchep).patch(getep).delete(deleteep).delete(getallep)
router.route('/:id/season/:index/ep/').get(getallep).post(postep).post(getallep)
module.exports = router