/*********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de ator no Banco de Dados MySQL
 * Data: 27/12/2025
 * Autor: Davi de Almeida
 * Versão: 1.0
 **********************************************************************************************/

//Import da biblioteca do PrismaClient

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSelectAllOrder = async function () {
    try {
        let sql = 'select * from tb_pedido order by id_pedido desc'


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




const getSelectOrderById = async function (id) {
    try {
        let sql = `select * from tb_pedido where id_pedido = ${id}`

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
        let sql = 'select id_pedido from tb_pedido order by id_pedido desc limit 1 '

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


const setInsertOrder = async function (pedido) {
    try {

         let sql = `insert into tb_pedido(status, total, criado_em, id_mesa) 
        values('${pedido.status}', '${pedido.total}', '${pedido.criado_em}','${pedido.id_mesa}')`
        
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



const setUpdateOrder = async function (pedido) {
    try{

    
         let sql = `update tb_pedido
         set
         status = '${pedido.status}',
         total = '${pedido.total}',
         criado_em = '${pedido.criado_em}',
         id_mesa = ${pedido.id_mesa}
         where id_pedido = '${pedido.id}'`

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

const setDeleteOrder = async function (id) {
    try {
        let sql = `delete from tb_pedido where id_pedido = ${id}`

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
  getSelectAllOrder,
    getSelectOrderById ,
    getSelectLastId,
    setInsertOrder ,
    setUpdateOrder,
   setDeleteOrder 
}