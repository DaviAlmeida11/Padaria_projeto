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

const controllerPedido = require('../controller/controller_pedido/controller_pedido')

router.get('/', cors(), async function (request, response) {
    let pedido = await controllerPedido.listarPedido()
    response.status(pedido.status_code)
    response.json(pedido)    
})


router.get('/:id', cors(), async function (request, response){
    let idPedido = request.params.id

    let pedido = await controllerPedido.listarPedidoId(idPedido)
    response.status(pedido.status_code)
    response.json(pedido)


})

router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let pedido = await controllerPedido.inserirPedido(dadosBody, contentType)

    response.status(pedido.status_code)
    response.json(pedido)
})

router.put('/:id', cors(), bodyParserJson, async function (request, response) {
    let dadosBody = request.body

    let idPedido = request.params.id

    let contentType = request.headers['content-type']
    
    let pedido = await controllerPedido.atualizarPedido(dadosBody, idPedido, contentType)

    response.status(pedido.status_code)
    response.json(pedido)
})

router.delete('/:id', cors(), async function (request, response) {
    let idPedido = request.params.id

    let pedido = await controllerPedido.excluirPedido(idPedido)
    response.status(pedido.status_code)
    response.json(pedido)

})


module.exports = router