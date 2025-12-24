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

const controllerMesa = require('../controller/controller_mesa/controller_mesa')

router.get('/', cors(), async function (request, response) {
    let mesa = await controllerMesa.listarMesa()
    response.status(mesa.status_code)
    response.json(mesa)    
})


router.get('/:id', cors(), async function (request, response){
    let idMesa = request.params.id

    let mesa = await controllerMesa.listarMesaId(idMesa)
    response.status(mesa.status_code)
    response.json(mesa)


})

router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let mesa = await controllerMesa.inserirMesa(dadosBody, contentType)

    response.status(local.status_code)
    response.json(local)
})

router.put('/:id', cors(), bodyParserJson, async function (request, response) {
    let dadosBody = request.body

    let idMesa = request.params.id

    let contentType = request.headers['content-type']
    
    let mesa = await controllerMesa.atualizarMesa(dadosBody, idMesa, contentType)

    response.status(mesa.status_code)
    response.json(mesa)
})

router.delete('/:id', cors(), async function (request, response) {
    let idmesa = request.params.id

    let mesa = await controllerMesa.excluirMesa(idmesa)
    response.status(mesa.status_code)
    response.json(mesa)

})


module.exports = router