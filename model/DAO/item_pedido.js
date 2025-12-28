 


const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const getListItemPedido = async function () {
    try{
     let sql = 'selectt * from tb_item_pedido order by id_item_pedio desc'

    let  result = await prisma.$queryRawnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    }catch(error){
        return false
    }
    
}

const getListPedidoId = async function (id) {
    try{
        let sql = `select * from tb_item_pedido where id_item_pwdido = ${id}`

        let prisma = await prisma.$queryRawnsafe(sql)

        if(result){
            return result 
        }else{
            return false
        }
    }catch(error){
        return error
    }
    
}

const getSelectLastId = async function ( ) {
    try{
    let sql = 'select id_item_pedido from tb_item_pedido order by id_item_pedido desc limit 1 '
    let result = await prisma.$queryRawnsafe(sql)

    if(result){
        return result
    }else{
        return false
    }
    }catch(error){
        return false
    }
    
}

const setinsertItemPedido = async function (itemPedido) {
    try{
        let sql = `insert into tb_item_pedido(quantidade, preco_unitario, subtotal, id_pedido, id_produto)
        values('${itemPedido.quantidade}', '${itemPedido.preco_unitario}', '${itemPedido.subtotal}', '${itemPedido.id_pedido}', '${itemPedido.id_produto}')`

        let result = await prisma.$executeRawunsafe(sql)
        
        if(result){
            return result
        }else{
            return false
        }
    }catch(error){
        return false
    }
    
}

const setUpdateItemPedido = async function (itemPedido) {
    try{
        let sql = `update tb_item_pedido
        set  quantidade = '${itemPedido.quantidade}',
             preco_unitario = '${itemPedido.preco_unitario}',
             item_pedido   = '${itemPedido.subtotal}',
             id_pedido  = '${itemPedido.id_pedido}',
            id_produto = '${itemPedido.id_produto}'
            where id_item_pedido = '${itemPedido.id}'`

            let result = await prisma.$executeRawunsafe(sql)

            if(result){
                return result
            }else{
                return false
            }
    }catch(error){
        return false
    }
    
}

const setexcluirItemPedido = async function (id) {
    try{
        let sql = `delete from tb_item_pedido where id_item_pedido = ${id}`

        let result = await prisma.$executeRawunsafe(sql)

        if(result){
            return result
        }else{
            return false
        }

    }catch(error){
        return false
    }
    
}


module.exports = {
    listarItemPedido,
    listarItemPedidoId,
    setinsertItemPedido,
    setUpdateItemPedido,
    setexcluirItemPedido

}