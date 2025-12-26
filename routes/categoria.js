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

const controllerCategoria = require('../controller/controller_categoria/controller_categoria')

router.get('/', cors(), async function (request, response) {
    let categoria = await controllerCategoria.listarCategoria()
    response.status(categoria.status_code)
    response.json(categoria)    
})


router.get('/:id', cors(), async function (request, response){
    let idCategoria = request.params.id

    let categoria = await controllerMesa.listarMesaId(idCategoria)
    response.status(categoria.status_code)
    response.json(categoria)


})

router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let categoria = await controllerCategoria.inserirCategoria(dadosBody, contentType)

    response.status(categoria.status_code)
    response.json(categoria)
})

router.put('/:id', cors(), bodyParserJson, async function (request, response) {
    let dadosBody = request.body

    let idCategoria = request.params.id

    let contentType = request.headers['content-type']
    
    let categoria = await controllerCategoria.atualizarCategoria(dadosBody, idCategoria, contentType)

    response.status(categoria.status_code)
    response.json(categoria)
})

router.delete('/:id', cors(), async function (request, response) {
    let idCategoria = request.params.id

    let categoria = await controllerCategoria.excluirCategoria(idCategoria)
    response.status(categoria.status_code)
    response.json(categoria)

})


module.exports = router