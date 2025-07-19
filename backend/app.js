require('./database/main')

const user = require('./routers/users')
const streamed =  require('./routers/streamed')
const movies =  require('./routers/movies')
const series = require('./routers/series')
const actor = require('./routers/actor')
const express =  require('express')
const PORT = 3000
const app =  express()

app.use(express.json())
app.use('/api/v1/user',user)
app.use('/api/v1/streamed',streamed)
app.use('/api/v1/movies',movies)
app.use('/api/v1/series',series)
app.use('/api/v1/actor',actor)
const start = async () =>{
    try{
        app.listen(PORT,console.log(`server is listening on port ${PORT}`))
    }catch(error){
        console.log(error)
    }
}
start()