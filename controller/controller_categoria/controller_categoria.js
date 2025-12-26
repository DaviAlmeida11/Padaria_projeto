/*********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 05/12/2025
 * Autor: Davi de Almeida
 * Versão: 1.0
 **********************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const categoriaDAO = require('../../model/DAO/categoria.js')


const MESSAGE_DEFAULT = require("../modulo/configMessage.js")



const listarCategoria = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista de mesas
        let result = await categoriaDAO.getSelectAllCategory()

        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.total_categoria = result.length
                MESSAGE.HEADER.response.categoria = result

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
const listarCategoriaId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            let result = await categoriaDAO.getSelectCategoryById(id)

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.categoria
                    MESSAGE.HEADER.response.categoria = result
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


const inserirCategoria = async function (categoria, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {


            let validacao = await validarDadosCategoria(categoria)


            if (!validacao) {

                let result = await categoriaDAO.setInsertCategory(categoria)

                if (result) {
                    let lastIdMesa = await categoriaDAO.getSelectLastId();

                    if (lastIdMesa) {

                         mesa.id = lastIdMesa

                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status;
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code;
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message;
                        MESSAGE.HEADER.response = categoria

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


const atualizarCategoria = async function (categoria, id, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            let validarId = await listarCategoriaId(id)

            if (validarId.status_code == 200) {

                let validarDados = await validarDadosCategoria(categoria)

                if (!validarDados) {
                    //Adicionando o ID no JSON com os dados do ator
                    mesa.id = parseInt(id)

                    let result = await categoriaDAO.setUpdateCategory(categoria)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = categoria

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


const excluirCategoria = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarId = await listarCategoriaId(id)

        if (validarId.status_code == 200) {


            let result = await categoriaDAO.setDeleteCategory(id)

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


const validarDadosCategoria = function (categoria) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    // NOME
    if (categoria.nome == '' || categoria.nome == null || categoria.nome == undefined || categoria.nome.length > 20) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [NOME] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }


    return false 
}


module.exports = {
    listarCategoria,
    listarCategoriaId,
    inserirCategoria,
    atualizarCategoria,
    excluirCategoria,
}