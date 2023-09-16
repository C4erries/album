const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')


const readFileAsync = async () => {
    return new Promise((resolve, reject) => fs.readFile(path.resolve(__dirname, 'urls.json'), {encoding: "utf-8"}, (err, data) => {
        if(err){
            return reject(err.message)
        }
        resolve(data)
    }))
}



const app = express()


app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const PORT = process.env.PORT || 5000


app.get("/api", (req, res) => {
    // res.json({"url": "https://lh3.googleusercontent.com/pw/AIL4fc-XUXfevXAB9mrd-JQc7V6-6zI4csDLQcGECvQsPHhhnDK8j32dMFZhwm55Zjrg2xsq1DaUnAdztn-uWI754Z7yLMJt-yyDMiQHg8dqiJ1tfBrSNg"})
    res.sendFile(path.resolve(__dirname, 'urls.json'))
})

app.post("/api/set", (req, res) => {
    readFileAsync()
        .then((res) => {
            return JSON.parse(res)
        })
        .then((json) => {
            json.data[req.body.id - 1] = req.body
            return json
        })
        .then((json) =>{
            let str = JSON.stringify(json)
            fs.writeFileSync(path.resolve(__dirname, 'urls.json'), str, {})
        })
        .catch((e) => {
            if(e){
                res.err(e)
            }
        })
        .then(() =>{
            res.send('accepted')
            console.log('accepted')
        })

})
// readFileAsync(path.resolve(__dirname, 'urls.txt'))
//     .then(data => {app.get("/api/url", (req, res) => {
//         res.send({data})
//     })})
//     .catch(err => console.log(err))

// if(process.env.NODE_ENV === 'production'){
//     app.use('/', express.static(path.join(__dirname, 'frontend' , 'build')))
//
//     app.get('*', (req, res) =>{
//         res.sendFile(path.resolve(__dirname, 'frontend' , 'build', 'index.html'))
//     })
// }


app.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`)
})