/*********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 05/12/2025
 * Autor: Davi de Almeida
 * Versão: 1.0
 **********************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const produtoDAO = require('../../model/DAO/produto.js')


const MESSAGE_DEFAULT = require("../modulo/configMessage.js")

const UPLOAD = require('../upload/upload_azure.js')



// Lista todos os objetos relacionados a esta tabela no banco de dados
const listarProduto = async function () {
  //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

  try {
    //Chama a função do DAO para retornar a lista de diretores
    let result = await produtoDAO.getSelectAllProduct()

    if (result) { 
      if (result.length > 0) {
        MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
        MESSAGE.HEADER.response.total_produto = result.length
        MESSAGE.HEADER.response.produto = result

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

const listarProdutoId = async function (id) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

  try {
    if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
      let result = await produtoDAO.getSelectProductById(id)

      if (result) {
        if (result.length > 0) {
            MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
            MESSAGE.HEADER.response.produto
            MESSAGE.HEADER.response.produto = result
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


const inserirProduto = async function (dados, img, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {

        if (!contentType || !contentType.toLowerCase().includes('multipart/form-data')) {
            return MESSAGE.ERROR_CONTENT_TYPE; // 415
        }

       
        if (!img || !img.originalname || !img.buffer) {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; // 500
        }

        let urlImg = await UPLOAD.uploadFiles(img);

        if (!urlImg) {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; // 500
        }

    
        dados.img = urlImg;

     
        let result = await produtoDAO.setInsertProduct(dados);

        if (result) {

       
            let lastIdProduto = await produtoDAO.getSelectLastId();

            if (lastIdProduto) {
                dados.id = lastIdProduto;
            }

            MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status;
            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code;
            MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message;
            MESSAGE.HEADER.response = dados;

            return MESSAGE.HEADER;
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; // 500
        }

    } catch (error) {
   
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
    }
};

  const atualizarProduto = async function (produto, id, contentType, img) {
    // Cópia profunda do objeto MESSAGE_DEFAULT
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        // 1. Verificar Content-Type
        if (!contentType || !contentType.toLowerCase().includes("multipart/form-data")) {
            return MESSAGE.ERROR_CONTENT_TYPE; // 415
        }

 // 2. Verificar se o ID existe
      const validarId = await listarProdutoId(id);
      if (validarId.status_code !== 200) {
          return validarId; // 404 ou outro erro
      }

        // 5. Verificar imagem enviada
        if (!img || !img.originalname || !img.buffer) {
            console.log("Arquivo de imagem inválido:", img);
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; // 500
        }

        // 6. Upload da imagem
        const urlImg = await UPLOAD.uploadFiles(img);
       
        if (!urlImg) {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; // 500
        }

        // 7. Adiciona URL ao objeto
        produto.img = urlImg;

        // 8. Validar dados do usuário
        const validarDados = validarDadosProduto(produto);
        if (validarDados) {
            return validarDados; // erro de validação
        }

        // 9. Atualizar usuário no banco
        produto.id = parseInt(id);
        const result = await produtoDAO.setupdateDiario(produto);

        if (!result) {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; // 500
        }

        // 10. Sucesso
        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status;
        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code;
        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message;
        MESSAGE.HEADER.response = produto;

        return MESSAGE.HEADER; // 200

    } catch (error) {

        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
    }
}





const excluirProduto = async function (id) {
  //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

  try {
    let validarId = await listarProdutoId(id)

    if (validarId.status_code == 200) {


      let result = await produtoDAO.setDeleteProduct(id)

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


const validarDadosProduto = function (produto) {

  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

  // NOME
  if (produto.nome == '' || produto.nome == null || produto.nome == undefined || produto.nome.length > 100) {
    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [NOME] invalido`
    return MESSAGE.ERROR_REQUIRED_FIELDS //400

  }else if (produto.descricao == '' || produto.descricao == null || produto.descricao == undefined || produto.descricao.length > 350) {
    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [DESCRIÇÃO] invalido`
    return MESSAGE.ERROR_REQUIRED_FIELDS //400

  } else if (produto.preco == '' || produto.criado_em == null || produto.criado_em == undefined || produto.criado_em.length > 100) {
    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [PREÇO] invalido`
    return MESSAGE.ERROR_REQUIRED_FIELDS //400

    
  } else if (diario.img == null) {
    return false

    
  } else if (diario.img == '' || diario.img == undefined) {
    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [FOTO] invalido`
    return MESSAGE.ERROR_REQUIRED_FIELDS //400

  }

  return false; // validação OK
}


module.exports = {
    listarProduto,
    listarProdutoId,
    inserirProduto,
    atualizarProduto,
    excluirProduto




}