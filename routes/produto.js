//Import das bibliotecas para criar a API
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// CRIA UM FORMATO JSON
const bodyParserJson = bodyParser.json()


//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

// ENDPOINTS DA TABELA Usuario

const controllerProduto = require('../controller/controller_produto/controller_produto')

router.get('/', cors(), async function (request, response) {
    let produto = await controllerProduto.listarProduto()
    response.status(produto.status_code)
    response.json(produto)    
})


router.get('/:id', cors(), async function (request, response){
    let idProduto = request.params.id

    let produto = await controllerProduto.listarProdutoId(idProduto)
    response.status(produto.status_code)
    response.json(produto)


})

router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let produto = await controllerProduto.inserirProduto(dadosBody, contentType)

    response.status(produto.status_code)
    response.json(produto)
})

router.put('/:id', cors(), bodyParserJson, async function (request, response) {
    let dadosBody = request.body

    let idProduto = request.params.id

    let contentType = request.headers['content-type']
    
    let produto = await controllerProduto.atualizarProduto(dadosBody, idProduto, contentType)

    response.status(produto.status_code)
    response.json(produto)
})

router.delete('/:id', cors(), async function (request, response) {
    let idProduto = request.params.id

    let produto = await controllerProduto.excluirProduto(idProduto)
    response.status(produto.status_code)
    response.json(produto)

})


module.exports = router