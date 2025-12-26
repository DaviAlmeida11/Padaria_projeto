/*********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de ator no Banco de Dados MySQL
 * Data: 25/12/2025
 * Autor: Davi de Almeida
 * Versão: 1.0
 **********************************************************************************************/

//Import da biblioteca do PrismaClient

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSelectAllCategory = async function () {
    try {
        let sql = 'select * from tb_categoria order by id_categoria desc'


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


const getSelectCategoryById = async function (id) {
    try {
        let sql = `select * from tb_categoria where id_categoria = ${id}`

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
        let sql = 'select id_categoria from tb_categoria order by id_categoria desc limit 1 '

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


const setInsertCategory = async function (categoria) {
    try {

         let sql = `insert into tb_categoria(nome) 
        values('${categoria.nome}')`
        
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



const setUpdateCategory  = async function (categoria) {
    try{

    
         let sql = `update tb_categoria
         set
         nome = '${categoria.nome}'
         where id_categoria = '${categoria.id}'`

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

const setDeleteCategory = async function (id) {
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
   getSelectAllCategory ,
    getSelectCategoryById ,
    getSelectLastId,
    setInsertCategory ,
    setUpdateCategory  ,
    setDeleteCategory 
}