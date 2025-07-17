const express = require('express')
const router = express.Router()
const { getmovie, getallmovies, postmovie,deletemovie,patchmovies, 
    putmovie, addvideo, getallvideos,getvideo,deletevideo,getallsubs,addsubs,
    getsub,deletesub,patchsub,patchvideo
} = require('../controllers/movie')
router.route('/id/:id').get(getmovie).delete(deletemovie).delete(getallmovies).patch(patchmovies).patch(getmovie).put(putmovie).put(getmovie)
router.route('/').get(getallmovies).post(postmovie)
router.route('/id/:id/videos').post(addvideo).post(getmovie).get(getallvideos)
router.route('/id/:id/videos/:index').get(getvideo).delete(deletevideo).delete(getallvideos).patch(patchvideo).patch(getvideo)
router.route('/id/:id/subs').get(getallsubs).post(addsubs).post(getmovie)
router.route('/id/:id/subs/:index').get(getsub).delete(deletesub).delete(getallsubs).patch(patchsub).patch(getsub)
module.exports = router