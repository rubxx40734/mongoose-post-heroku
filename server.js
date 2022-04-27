const http = require('http')
const mongoose = require('mongoose')
const Post = require('./models/post.js')
const errorHandel = require('./errorHandel')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
)
mongoose.connect(DB)
 .then(() => {console.log('資料庫連線成功')})
 .catch(error => {console.log(error.errors)})

// Post.create(
//     {
//         content : '今天天氣真好exports2',
//         image: 'hello',
//         name: '穗create',
//         likes: 87
//     }
// ).then(() => {console.log('creare success')})
// .catch(erroe => {console.log(erroe.errors)})

const requestListener = async (req,res) => {
    let body = ''
    req.on('data',chunk=> {
       body += chunk
    })
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
   if(req.url == '/posts' && req.method == 'GET'){
       const posts = await Post.find()
       res.writeHead(200,headers)
       res.write(JSON.stringify({
           "status" : "success",
           posts
       }))
       res.end()
   }else if(req.url == '/posts' && req.method == 'POST') {
      req.on('end',async () => {
          try{
              const data = JSON.parse(body)
              const newPost = await Post.create(data)
              console.log(newPost)
              res.writeHead(200,headers)
              res.write(JSON.stringify({
                  "status" : "success",
                  "post" : newPost
              }))
              res.end()
          }
          catch(error){
            errorHandel(req,res,error)
          }
      })
   }else if (req.method == 'OPTIONS') {
    res.writeHead(200,headers)
    res.end()
   }else if(req.url == '/posts' && req.method == 'DELETE'){
       const post = await Post.deleteMany({})
       res.writeHead(200,headers)
       res.write(JSON.stringify({
           "status" : "success",
           post
       }))
       res.end()
   }else if (req.url.startsWith('/posts/') &&  req.method == 'DELETE'){
       const id = req.url.split('/').pop()
       console.log(id)
       try{
        const post = await Post.findByIdAndDelete(id)
        res.writeHead(200,headers)
        res.write(JSON.stringify({
            "status" : "success",
            post
        }))
        res.end()
       }
       catch(error){
        errorHandel(req,res,error)
       }
   }else if (req.url.startsWith('/posts/') &&  req.method == 'PATCH') {
        req.on('end', async () => {
            const id =  req.url.split('/').pop()
            const content = JSON.parse(body).content
            const image = JSON.parse(body).image
            const name = JSON.parse(body).name
            const likes = JSON.parse(body).likes
            try{
                const post = await Post.findByIdAndUpdate(id,{
                    content: content,
                    image : image,
                    name : name,
                    likes : likes
                })
                res.writeHead(200,headers)
                res.write(JSON.stringify({
                    "status" : "success",
                    post
                }))
                res.end()
            }
            catch(error){
                errorHandel(req,res,error)
            }
        })
   }
   else {
       res.writeHead(404,headers)
       res.write(JSON.stringify({
           "status" : "false",
           "message" : "無此網站路由"
       }))
       res.end()
   }
}

// Create a local server to receive data from
const server = http.createServer(requestListener)
server.listen(process.env.PORT  || 3005);