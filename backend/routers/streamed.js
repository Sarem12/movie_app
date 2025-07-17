const { getallstreamed, poststreamed, getstreamed, deletestreamed, putstreamed, patchstreamed } = require('../controllers/streamed')
const { getstreamedr, postreviews, deletreviewbystream, givedeleteforreview } = require('../controllers/streamed_review')
const express =  require('express')
const router = express.Router()
router.route('/').get(getallstreamed).post(poststreamed)
router.route('/id/:id').get(getstreamed).delete(deletestreamed).put(putstreamed).patch(patchstreamed).delete(givedeleteforreview).delete(deletreviewbystream)
router.route('/id/:id/reviews').get(getstreamedr).post(postreviews).post(getallstreamed)
module.exports = router