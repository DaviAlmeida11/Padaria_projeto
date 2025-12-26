/*********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de ator no Banco de Dados MySQL
 * Data: 25/12/2025
 * Autor: Davi de Almeida
 * Versão: 1.0
 **********************************************************************************************/

//Import da biblioteca do PrismaClient

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSelectAllProduct = async function () {
    try {
        let sql = 'select * from tb_produto order by id_produto desc'


        let result = await prisma.$queryRawUnsafe(sql)



        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {

        return false
    }
}


const getSelectProductById = async function (id) {
    try {
        let sql = `select * from tb_produto where id_produto = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)
        
        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {

        return false
    }
}

const getSelectLastId = async function () {
    try {
        let sql = 'select id_produto from tb_produto order by id_produto desc limit 1 '

        let result = await prisma.$queryRawUnsafe(sql)
        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {

        return false
    }
}


const setInsertProduct  = async function (produto) {
    try {

        if (produto.img == null) {
            sql = `insert into tb_produto(nome,img, descricao, preco, id_categoria) 
        values('${produto.nome}',${produto.img},${produto.descricao},${produto.preco},${produto.id_categoria}')`

        } else {

           sql = `insert into tb_produto(nome,img, descricao, preco, id_categoria) 
        values('${produto.nome}',${produto.img},${produto.descricao},${produto.preco},${produto.id_categoria}')`
            
        } 

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {
       

        return false
    }
}



const setupdateDiario = async function (produto) {
    try {
        let sql = "";


        if (diario.img == null) {

            // NÃO ATUALIZA A IMAGEM
            sql = `
UPDATE tb_produto
SET 
    nome = '${produto.nome}',
    img = '${produto.img}',
    descricao = '${produto.descricao}',
    preco = '${produto.preco}',
    id_categoria = '${produto.id_categoria}'
WHERE id_produto = ${diario.id};
`;

        } else {

            // ATUALIZA A IMAGEM
                       sql = `
UPDATE tb_produto
SET 
    nome = '${produto.nome}',
    img = '${produto.img}',
    descricao = '${produto.descricao}',
    preco = '${produto.preco}',
    id_categoria = '${produto.id_categoria}'
WHERE id_produto = ${diario.id};
`;

        }

        let result = await prisma.$executeRawUnsafe(sql);

        if (result) {
            return result; // UPDATE OK
        } else {
            return false; // UPDATE não afetou linhas
        }

    } catch (error) {
     
        return false;
    }
}
const setDeleteProduct = async function (id) {
    try {
        let sql = `delete from tb_categoria where id_categoria = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}



module.exports = {
   getSelectAllProduct ,
   getSelectProductById,
    getSelectLastId,
  setInsertProduct  ,
   setupdateDiario  ,
   setDeleteProduct
}