/*********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de ator no Banco de Dados MySQL
 * Data: 24/12/2025
 * Autor: Davi de Almeida
 * Versão: 1.0
 **********************************************************************************************/

//Import da biblioteca do PrismaClient

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSelectAllTable = async function () {
    try {
        let sql = 'select * from tb_mesa order by id_mesa desc'


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


const getSelectMesaById = async function (id) {
    try {
        let sql = `select * from tb_mesa where id_mesa = ${id}`

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
        let sql = 'select id_diario from tb_mesa order by id_mesa desc limit 1 '

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


const setInsertMesa = async function (mesa) {
    try {

         let sql = `insert into tb_diario(numero) 
        values('${mesa.numero}')`
        
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



const setUpdateMesa = async function (mesa) {
    try{

    
         let sql = `update tb_mesa
         set
         numero = '${mesa.numero}'
         where id_masa = '${mesa.id}'`

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

const setDeleteMesa = async function (id) {
    try {
        let sql = `delete from tb_mesa where id_mesa = ${id}`

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
    getSelectAllTable ,
    getSelectMesaById ,
    getSelectLastId,
    setInsertMesa,
    setUpdateMesa ,
    setDeleteMesa
}