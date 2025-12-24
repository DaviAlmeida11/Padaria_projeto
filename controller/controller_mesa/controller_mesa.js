/*********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 05/12/2025
 * Autor: Davi de Almeida
 * Versão: 1.0
 **********************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const mesaDAO = require('../../model/DAO/mesa.js')


const MESSAGE_DEFAULT = require("../modulo/configMessage.js")



const listarMesa = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista de mesas
        let result = await mesaDAO.getSelectAllTable()

        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.total_mesa = result.length
                MESSAGE.HEADER.response.mesa = result

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
const listarMesaId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            let result = await mesaDAO.getSelectMesaById(id)

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.mesa
                    MESSAGE.HEADER.response.mesa = result
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


const inserirMesa = async function (mesa, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {


            let validacao = await validarDadosMesa(mesa)


            if (!validacao) {

                let result = await mesaDAO.setInsertMesa(mesa)

                if (result) {
                    let lastIdMesa = await mesaDAO.getSelectLastId();

                    if (lastIdMesa) {

                         mesa.id = lastIdMesa

                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status;
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code;
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message;
                        MESSAGE.HEADER.response = mesa

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


const atualizarMesa = async function (mesa, id, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            let validarId = await listarMesaId(id)

            if (validarId.status_code == 200) {

                let validarDados = await validarDadosMesa(mesa)

                if (!validarDados) {
                    //Adicionando o ID no JSON com os dados do ator
                    mesa.id = parseInt(id)

                    let result = await mesaDAO.setUpdateMesa(mesa)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = mesa

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


const excluirMesa = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarId = await listarMesaId(id)

        if (validarId.status_code == 200) {


            let result = await mesaDAO.setDeleteMesa(id)

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


const validarDadosMesa = function (mesa) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    // NOME
    if (mesa.numero == '' || mesa.numero == null || mesa.numero == undefined || mesa.numero == String || mesa.numero.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [NOME] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }


    return false 
}


module.exports = {
    listarMesa,
    listarMesaId,
    inserirMesa,
    atualizarMesa,
    excluirMesa,
}