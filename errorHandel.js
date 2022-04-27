function errorHandel(req,res,error) {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    res.writeHead(400,headers)
    res.write(JSON.stringify({
        "status" : "false",
        "message" : "找無此路由 或無此ID",
        "error" : error
    }))
    res.end()
}

module.exports = errorHandel