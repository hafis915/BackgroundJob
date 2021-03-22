const express = require('express')
const app = express()
const port = 3000
const Queue = require('bull')
const { setQueues, BullAdapter } = require('bull-board')
const { router } = require('bull-board')
let progress = 0 

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/admin/queues', router)
let testQue = new Queue('test queue')

setQueues([new BullAdapter(testQue)])

testQue.process( async (job,done) => {
    let msg = job.data.mesage
    for (let i = 0 ; i < 4 ; i++){
        await doSomething()
        progress += 25
        console.log(progress)
        job.progress(progress)
    }
    progress = 0 
    done(null,msg)
} )

function doSomething (msg) {
    return new Promise ( (res,rej) => {
        setTimeout(() => {
            res('done')
        }, 3000);
    } )
}

app.post('/test-bull', async (req, res) => {
    try {
        let {msg} = req.body
        let addMsg = await testQue.add({mesage: msg})
        let doneAdd = await addMsg.finished()
        res.status(200).json({
            msg: `${doneAdd}, ress`
        })
    } catch (error) {
        
    }

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})