/*
  * [ATIVIDADE 4 - Eliminar Item]
  *
  * Copie o servidor feito na atividade 03, e acrescente uma
  * rota "DLETE" para o endereço "/api/beyblade/remover" após a rota
  * "/api/beyblade/cadastrar" criada no exercício anterior.
  *
  * Esta rota é executada quando, na tabela de beyblades cadastradas,
  * o botão "Remaover" é clicado. Esta rota deve armazenar as o id
  * da beyblade a ser removida (desta vez, por não ser uma rota do
  * tipo GET, essa informação não existe dentro de req.query, mas sim
  * dentro de req.params), e repassar esse id para o comando
  * SQL que realiza a remoção de itens da tabela. Confira como foi 
  * feito no app.js para referência.
  *
  * Ao final deste arquivo, use "module.exports = app" para
  * exportar o objeto do servidor para os testes automatizados.
  */
 const express = require('express')
 const path = require('path')
 const cors = require('cors');
 // Importando a ferramenta pra utilizar bancos de dados
 const sql = require('sqlite3').verbose()
 
 // Definindo a porta usada para abrir o servidor (no final deste código)
 const porta = 3000
 
 const app = express()
 // Necessário para leitura do corpo de uma requisição
 app.use(express.urlencoded({ extended: true }))
 // Necessário para interpretação do formato JSON
 app.use(express.json())
 // Para evitar erros de CORS
 app.use(cors());
 // Para configurar o servidor para olhar dentro da pasta src por padrão
 app.use(express.static(path.join(__dirname, 'src')));
 
 const db = new sql.Database(
   './beyblade.db', // Nome do arquivo do banco de dados
   (erro) => { // Função que executa que o banco é criado
     if (erro) {
       console.error('Erro ao abrir o banco de dados "beyblade.db":', erro.message);
     } else {
       console.log('Conectado ao banco de dados SQLite3 "beyblade.db"');
     }
   }
 )
 db.run(
   // 1º argumento = comando SQL
   `CREATE TABLE IF NOT EXISTS beyblades (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   nome TEXT NOT NULL UNIQUE,
   lamina TEXT,
   catraca TEXT,
   ponta TEXT,
   participante NOT NULL UNIQUE
   )`,
   // 2º argumento = função executada após termos o resultado do comando SQL
   (erro) => {
     if (erro) {
       console.error('Erro ao criar a tabela "beyblades"', erro.message);
     } else {
       console.log('Tabela "beyblades" pronta!');
     }
   }
 )
 app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'indexAtv.html'))
 })
 

 app.get('/api/beyblade', (req, res) => {
 
   // "all" envia todas as informações que combinarem com os parâmetros
   db.all(
     // 1º argumento: comando SQL
     `SELECT * FROM beyblades`, 
     // 2º argumento: parâmetros (exemplo: posição = "zagueiro")
     [],
     // 3º argumento: Função executada após termos o resultado do comando SQL
     (erro, itensDaTabela) => {
       // Se der ruim, enviamos a mensagem  de erro
       if (erro) {
         res.status(400).json({ error: erro.message })
         return
       }
 
       // Se der bom, enviamos o resultado
       res.status(200).json({
         message: "Requisição feita com sucesso",
         data: itensDaTabela
       })
     }
   )
 })
 app.get('/api/beyblade/cadastrar', (req, res) => {
   // Se não houver requisição, enviamos um erro
   if (!req.query) {
     res.status(400).json({ error: erro.message });
     return
   }
 
   // Extraímos os argumentos enviados pela requisição
   const {
     nome, lamina, catraca, ponta, participante
   } = req.query
 
   db.all(
     // Comando INSERT no SQL, onde as interrogações vão ser substituídas pelos valores
     `INSERT INTO beyblades (nome, lamina, catraca, ponta, participante) VALUES (?, ?, ?, ?, ?)`,
     [ nome, lamina, catraca, ponta, participante],
     // Tratamento básico de erros como nos casos acima
     (erro, itensDaTabela) => {
       if (erro) {
         res.status(400).json({ error: erro.message });
         return;
       }
       res.json({
         message: `Beyblade ${nome} adicionada com sucesso com lamina ${lamina} catraca ${catraca} ponta ${ponta}`,
         data: { id: this.lastID },
         id: this.lastID,
         total: itensDaTabela,
       });
     }
   )
 })
 app.delete('/api/beyblade/remover', (req, res) => {
  if (!req.params) {
    res.status(400).json({ error: erro.message });
    return
  }

  const { id } = req.params

  db.all(
    `DELETE FROM selecao WHERE id = ?`,
    [ id ],
    (erro, itensDaTabela) => {
      if (erro) {
        res.status(400).json({ error: erro.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Beyblade não encontrado' });
        return;
      }
      res.json({
        message: `Beyblade removido.`,
        data: { id: this.lastID },
        id: this.lastID,
        total: itensDaTabela,
      });
    }
  )
})
 app.listen(porta, () => {
   console.log(`Servidor rodando em http://localhost:${porta}`)
 })
