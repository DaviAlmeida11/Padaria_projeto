crate database padaria;

use database padaria;


CREATE TABLE mesa (
    id_mesa INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL
);


CREATE TABLE categoria (
    id_categodria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);



CREATE TABLE produto (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    img VARCHAR(500) not null,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_catecoria) REFERENCES categoria(id_categoria)
);


CREATE TABLE pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_mesa INT NOT NULL,
    status ENUM('aberto', 'enviado', 'preparando', 'finalizado', 'cancelado') DEFAULT 'aberto',
    total DECIMAL(10,2) DEFAULT 0.00,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_mesa) REFERENCES mesa(id_mesa)
);

CREATE TABLE item_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto),

    UNIQUE (id_pedido, id_produto)
);


-- trigger que calcula e atuiza um novo valor 
CREATE TRIGGER tg_atualiza_total_apos_insercao
AFTER INSERT ON itens_pedido
FOR EACH ROW
BEGIN
    UPDATE pedidos 
    SET total = total + NEW.subtotal
    WHERE id = NEW.pedido_id;
END;