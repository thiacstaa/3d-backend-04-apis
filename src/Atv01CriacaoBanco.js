/*
  * [ATIVIDADE 1 - Criação do banco]
  *
  * Crie um aplicativo Express em uma variável chamada app
  * que, ao ser inicializado, cria um banco de dados chamado
  * "beyblade.db". Siga o exemplo no arquivo "app.js" para
  * referência.
  *
  * Após criar o banco de dados, crie uma tabela chamada 
  * "beyblades" com as colunas abaixo:
  *
  * id, com propriedades INTEGER, PRIMARY KEY e AUTOINCREMENT
  * nome, com propriedades TEXT, NOT NULL e UNIQUE
  * lamina, com propriedade TEXT,
  * catraca, com propriedade TEXT,
  * ponta, com propriedade TEXT,
  * participante, com propriedades TEXT, NOT NULL e UNIQUE
  *
  * Após isso, você deve criar uma rota "GET" no endereço "/"
  * que envia o arquivo "indexAtv.html".
  *
  * Por fim, o servidor deve ouvir a porta 3000.
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

app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`)
})

module.exports = app
