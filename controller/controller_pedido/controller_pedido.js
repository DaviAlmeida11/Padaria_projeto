/*********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 05/12/2025
 * Autor: Davi de Almeida
 * Versão: 1.0
 **********************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const pedidoDAO = require('../../model/DAO/pedido.js')


const MESSAGE_DEFAULT = require("../modulo/configMessage.js")



const listarPedido = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista de mesas
        let result = await pedidoDAO.getSelectAllOrder()

        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.total_pedido = result.length
                MESSAGE.HEADER.response.pedido = result

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//  Listar os comentarios porIDiario 
const listarPedidoId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            let result = await pedidoDAO.getSelectOrderById(id)

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.pedido
                    MESSAGE.HEADER.response.pedido = result
                    return MESSAGE.HEADER


                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [ID] invalido`
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}


const inserirPedido = async function (pedido, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {


            let validacao = await validarDadosPedido(pedido)


            if (!validacao) {

                let result = await pedidoDAO.setInsertOrder(pedido)

                if (result) {
                    let lastIdPedido = await pedidoDAO.getSelectLastId();

                    if (lastIdPedido) {

                         pedido.id = lastIdPedido

                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status;
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code;
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message;
                        MESSAGE.HEADER.response = pedido

                        return MESSAGE.HEADER;
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL;
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL;
                }
            } else {
                return validacao;
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE;
        }

    } catch (error) { 

        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}


const atualizarPedido = async function (pedido, id, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            let validarId = await listarPedidoId(id)

            if (validarId.status_code == 200) {

                let validarDados = await validarDadosPedido(pedido)

                if (!validarDados) {
                    //Adicionando o ID no JSON com os dados do ator
                    pedido.id = parseInt(id)

                    let result = await pedidoDAO.setUpdateOrder(pedido)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = pedido

                        return MESSAGE.HEADER //200
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }

                } else {
                    return validarDados
                }
            } else {
                return validarId
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}


const excluirPedido = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarId = await listarPedidoId(id)

        if (validarId.status_code == 200) {


            let result = await pedidoDAO.setDeleteOrder(id)

            if (result) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETED_ITEM.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETED_ITEM.status_code
                MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETED_ITEM.message

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            return validarId
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}


const validarDadosPedido = function (pedido) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    // NOME
    if (pedido.status == '' || pedido.status == null || pedido.status == undefined || pedido.status == Number || mesa.numero.length > 10) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [STATUS] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(pedido.total == '' || pedido.total == null || pedido.status == undefined || pedido.status.length > 200) {
         MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [TOTAL] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(pedido.criado_em == '' || pedido.criado_em == undefined || pedido.criado_em == null || pedido.criado_em.length > 25 ){
          MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [CRIADO_EM] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){
    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [Id_mesa] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }



    return false 
}


module.exports = {
   listarPedido,
    listarPedidoId,
    inserirPedido,
    atualizarPedido,
    excluirPedido
}