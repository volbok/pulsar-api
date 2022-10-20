const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const app = express();
const port = 3333;

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Request-Private-Network", "true");
  res.header("Access-Control-Allow-Private-Network", "true");
  res.header(
    "Access-Control-Request-Private-Network",
    "Access-Control-Allow-Private-Network",
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({
    info: "API Node.js + Express + Postgres API - PULSAR",
  });
});

app.listen(port, () => {
  console.log("API rodando na porta " + port);
});

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "pulsar",
  password: "pulsar",
  port: 5432,
});

// ENDPOINTS - PULSAR //

// CLIENTES (HOSPITAIS E UNIDADES DE SAÚDE).
// listar todos os clientes (hospitais).
app.get("/list_hospitais", (req, res) => {
  var sql = "SELECT * FROM cliente_hospital";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// CLIENTES (HOSPITAIS E UNIDADES DE SAÚDE).
// listar todos as unidades de internação.
app.get("/list_unidades", (req, res) => {
  var sql = "SELECT * FROM cliente_unidade";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// USUÁRIOS.
// login e identificação do usuário.
app.post("/checkusuario", (req, res) => {
  const {
    usuario,
    senha
  } = req.body;
  var sql = "SELECT * FROM usuarios WHERE login = $1 AND senha = $2";
  pool.query(sql, [usuario, senha], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// identificando unidades de acesso do usuário logado.
app.post("/getunidades", (req, res) => {
  const {
    id_usuario,
  } = req.body;
  var sql = "SELECT * FROM usuarios_acessos WHERE id_usuario = $1";
  pool.query(sql, [id_usuario], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// PACIENTES.
// listar todos os pacientes internados.
app.get("/list_pacientes", (req, res) => {
  var sql = "SELECT * FROM paciente";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// inserir paciente internado.
app.post("/insert_paciente", (req, res) => {
  const {
    nome_paciente,
    nome_mae_paciente,
    dn_paciente,
    antecedentes_pessoais,
    medicacoes_previas,
    exames_previos,
  } = req.body;
  var sql = "INSERT INTO paciente (nome_paciente, nome_mae_paciente, dn_paciente, antecedentes_pessoais, medicacoes_previas, exames_previos) VALUES ($1, $2, $3, $4, $5, $6)"
  pool.query(sql, [
    nome_paciente,
    nome_mae_paciente,
    dn_paciente,
    antecedentes_pessoais,
    medicacoes_previas,
    exames_previos,
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// atualizar paciente.
app.post("/update_paciente/:id_paciente", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  const {
    nome_paciente,
    nome_mae_paciente,
    dn_paciente,
    antecedentes_pessoais,
    medicacoes_previas,
    exames_previos,
  } = req.body;
  var sql = "UPDATE paciente SET nome_paciente = $1, nome_mae_paciente = $2, dn_paciente = $3, antecedentes_pessoais = $4, medicacoes_previas = $5, exames_previos = $6 WHERE id_paciente = $7";
  pool.query(sql, [
    nome_paciente,
    nome_mae_paciente,
    dn_paciente,
    antecedentes_pessoais,
    medicacoes_previas,
    exames_previos,
    id_paciente
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluir paciente.
app.get("/delete_paciente/:id_paciente", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  var sql = "DELETE FROM paciente WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// PACIENTES - ALERGIAS.
// listar todas as alergias do paciente selecionado.
app.get("/paciente_alergias/:id_paciente", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  var sql = "SELECT * FROM paciente_alergias WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// inserir alergia.
app.post("/insert_alergia", (req, res) => {
  const {
    id_paciente,
    alergia
  } = req.body;
  var sql = "INSERT INTO paciente_alergias (id_paciente, alergia) VALUES ($1, $2)"
  pool.query(sql, [
    id_paciente,
    alergia,
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// atualizar alergia.
app.post("/update_alergia/:id_alergia", (req, res) => {
  const id_alergia = parseInt(req.params.id_alergia);
  const {
    id_paciente,
    alergia
  } = req.body;
  var sql = "UPDATE paciente_alergias SET id_paciente = $1, alergia = $2 WHERE id_alergia = $3";
  pool.query(sql, [
    id_paciente,
    alergia,
    id_alergia
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluir alergia.
app.get("/delete_alergia/:id_alergia", (req, res) => {
  const id_alergia = parseInt(req.params.id_alergia);
  var sql = "DELETE FROM paciente_alergias WHERE id_alergia = $1";
  pool.query(sql, [id_alergia], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// PACIENTES - LESÕES.
// listar todas as lesões do paciente selecionado.
app.get("/paciente_lesoes/:id_paciente", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  var sql = "SELECT * FROM paciente_lesoes WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// inserir lesão.
app.post("/insert_lesao", (req, res) => {
  const {
    id_paciente,
    local,
    grau,
    curativo,
    observacoes,
    data_abertura,
    data_fechamento
  } = req.body;
  var sql = "INSERT INTO paciente_lesoes (id_paciente, local, grau, curativo, observacoes, data_abertura, data_fechamento) VALUES ($1, $2, $3, $4, $5, $6, $7)"
  pool.query(sql, [
    id_paciente,
    local,
    grau,
    curativo,
    observacoes,
    data_abertura,
    data_fechamento
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// atualizar lesão.
app.post("/update_lesao/:id_lesao", (req, res) => {
  const id_lesao = parseInt(req.params.id_lesao);
  const {
    id_paciente,
    local,
    grau,
    curativo,
    observacoes,
    data_abertura,
    data_fechamento
  } = req.body;
  var sql = "UPDATE paciente_lesoes SET id_paciente = $1, local = $2, grau = $3, curativo = $4, observacoes = $5, data_abertura = $6, data_fechamento = $7 WHERE id_lesao = $8";
  pool.query(sql, [
    id_paciente,
    local,
    grau,
    curativo,
    observacoes,
    data_abertura,
    data_fechamento,
    id_lesao
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluir lesão.
app.get("/delete_lesao/:id_lesao", (req, res) => {
  const id_lesao = parseInt(req.params.id_lesao);
  var sql = "DELETE FROM paciente_lesoes WHERE id_lesao = $1";
  pool.query(sql, [id_lesao], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// PACIENTES - PRECAUÇÕES.
// listar todas as precauções do paciente selecionado.
app.get("/paciente_precaucoes/:id_paciente", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  var sql = "SELECT * FROM paciente_precaucoes WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// inserir precaução.
app.post("/insert_precaucao", (req, res) => {
  const {
    id_paciente,
    precaucao,
    data_inicio,
    data_termino
  } = req.body;
  var sql = "INSERT INTO paciente_precaucoes (id_paciente, precaucao, data_inicio, data_termino) VALUES ($1, $2, $3, $4)"
  pool.query(sql, [
    id_paciente,
    precaucao,
    data_inicio,
    data_termino
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// atualizar precaução.
app.post("/update_precaucao/:id_precaucao", (req, res) => {
  const id_precaucao = parseInt(req.params.id_precaucao);
  const {
    id_paciente,
    precaucao,
    data_inicio,
    data_termino
  } = req.body;
  var sql = "UPDATE paciente_precaucoes SET id_paciente = $1, precaucao = $2, data_inicio = $3, data_termino = $4 WHERE id_precaucao = $5";
  pool.query(sql, [
    id_paciente,
    precaucao,
    data_inicio,
    data_termino,
    id_precaucao
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluir precaução.
app.get("/delete_precaucao/:id_precaucao", (req, res) => {
  const id_precaucao = parseInt(req.params.id_precaucao);
  var sql = "DELETE FROM paciente_precaucoes WHERE id_precaucao = $1";
  pool.query(sql, [id_precaucao], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// PACIENTES - PRECAUÇÕES.
// listar todos os riscos do paciente selecionado.
app.get("/paciente_riscos/:id_paciente", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  var sql = "SELECT * FROM paciente_riscos WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// inserir risco.
app.post("/insert_risco", (req, res) => {
  const {
    id_paciente,
    risco
  } = req.body;
  var sql = "INSERT INTO paciente_riscos (id_paciente, risco) VALUES ($1, $2)"
  pool.query(sql, [
    id_paciente,
    risco
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// atualizar risco.
app.post("/update_risco/:id_risco", (req, res) => {
  const id_risco = parseInt(req.params.id_risco);
  const {
    id_paciente,
    risco
  } = req.body;
  var sql = "UPDATE paciente_riscos SET id_paciente = $1, risco = $2 WHERE id_risco = $3";
  pool.query(sql, [
    id_paciente,
    risco,
    id_risco
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluir risco.
app.get("/delete_risco/:id_risco", (req, res) => {
  const id_risco = parseInt(req.params.id_risco);
  var sql = "DELETE FROM paciente_riscos WHERE id_risco = $1";
  pool.query(sql, [id_risco], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// ATENDIMENTOS.
// listar todos os atendimentos do paciente selecionado.
app.get("/list_atendimentos/:id_unidade", (req, res) => {
  const id_unidade = parseInt(req.params.id_unidade);
  var sql = "SELECT * FROM atendimento WHERE id_unidade = $1 AND data_termino IS NULL";
  pool.query(sql, [id_unidade], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// inserir atendimento.
app.post("/insert_atendimento", (req, res) => {
  const {
    data_inicio,
    data_termino,
    historia_atual,
    id_paciente,
    id_unidade,
    nome_paciente,
    leito
  } = req.body;
  var sql = "INSERT INTO atendimento (data_inicio, data_termino, historia_atual, id_paciente, id_unidade, nome_paciente, leito) VALUES ($1, $2, $3, $4, $5, $6, $7)"
  pool.query(sql, [
    data_inicio,
    data_termino,
    historia_atual,
    id_paciente,
    id_unidade,
    nome_paciente,
    leito
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// atualizar atendimento.
app.post("/update_atendimento/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  const {
    data_inicio,
    data_termino,
    historia_atual,
    id_paciente,
    id_unidade,
    nome_paciente,
    leito
  } = req.body;
  var sql = "UPDATE atendimento SET data_inicio = $1, data_termino = $2, historia_atual = $3, id_paciente = $4, id_unidade = $5, nome_paciente = $6, leito = $7 WHERE id_atendimento = $8";
  pool.query(sql, [
    data_inicio,
    data_termino,
    historia_atual,
    id_paciente,
    id_unidade,
    nome_paciente,
    leito,
    id_atendimento
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluir atendimento.
app.get("/delete_atendimento/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "DELETE FROM atendimento WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// ATENDIMENTOS - EVOLUÇÕES.
// listar todas as evoluções do atendimento selecionado.
app.get("/list_evolucoes/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_evolucoes WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// inserir evolução.
app.post("/insert_evolucao", (req, res) => {
  const {
    id_atendimento,
    evolucao,
    data_evolucao,
    id_usuario
  } = req.body;
  var sql = "INSERT INTO atendimento_evolucoes (id_atendimento, evolucao, data_evolucao, id_usuario) VALUES ($1, $2, $3, $4)"
  pool.query(sql, [
    id_atendimento,
    evolucao,
    data_evolucao,
    id_usuario
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// atualizar evolucao.
app.post("/update_evolucao/:id_evolucao", (req, res) => {
  const id_evolucao = parseInt(req.params.id_evolucao);
  const {
    id_atendimento,
    evolucao,
    data_evolucao,
    id_usuario
  } = req.body;
  var sql = "UPDATE atendimento_evolucoes SET id_atendimento = $1, evolucao = $2, data_evolucao = $3, id_usuario = $4 WHERE id_evolucao = $5";
  pool.query(sql, [
    id_atendimento,
    evolucao,
    data_evolucao,
    id_usuario,
    id_evolucao
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluir evolucao.
app.get("/delete_evolucao/:id_evolucao", (req, res) => {
  const id_evolucao = parseInt(req.params.id_evolucao);
  var sql = "DELETE FROM atendimento_evolucoes WHERE id_evolucao = $1";
  pool.query(sql, [id_evolucao], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// ATENDIMENTOS - INFUSÕES.
// listar todas as infusões do atendimento selecionado.
app.get("/list_infusoes/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_infusoes WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// inserir infusão.
app.post("/insert_infusao", (req, res) => {
  const {
    id_atendimento,
    droga,
    velocidade,
    data_inicio,
    data_termino
  } = req.body;
  var sql = "INSERT INTO atendimento_infusoes (id_atendimento, droga, velocidade, data_inicio, data_termino) VALUES ($1, $2, $3, $4, $5)"
  pool.query(sql, [
    id_atendimento,
    droga,
    velocidade,
    data_inicio,
    data_termino
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// atualizar infusão.
app.post("/update_infusao/:id_infusao", (req, res) => {
  const id_infusao = parseInt(req.params.id_infusao);
  const {
    id_atendimento,
    droga,
    velocidade,
    data_inicio,
    data_termino
  } = req.body;
  var sql = "UPDATE atendimento_infusoes SET id_atendimento = $1, droga = $2, velocidade = $3, data_inicio = $4, data_termino = $5 WHERE id_infusao = $6";
  pool.query(sql, [
    id_atendimento,
    droga,
    velocidade,
    data_inicio,
    data_termino,
    id_infusao
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluir infusão.
app.get("/delete_infusao/:id_infusao", (req, res) => {
  const id_infusao = parseInt(req.params.id_infusao);
  var sql = "DELETE FROM atendimento_infusoes WHERE id_infusao = $1";
  pool.query(sql, [id_infusao], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// ATENDIMENTOS - INVASÕES.
// listar todas as invasões do atendimento selecionado.
app.get("/list_invasoes/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_invasoes WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// inserir invasão.
app.post("/insert_invasao", (req, res) => {
  const {
    id_atendimento,
    local,
    dispositivo,
    data_implante,
    data_retirada
  } = req.body;
  var sql = "INSERT INTO atendimento_invasoes (id_atendimento, local, dispositivo, data_implante, data_retirada) VALUES ($1, $2, $3, $4, $5)"
  pool.query(sql, [
    id_atendimento,
    local,
    dispositivo,
    data_implante,
    data_retirada
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// atualizar invasão.
app.post("/update_invasao/:id_invasao", (req, res) => {
  const id_invasao = parseInt(req.params.id_invasao);
  const {
    id_atendimento,
    local,
    dispositivo,
    data_implante,
    data_retirada
  } = req.body;
  var sql = "UPDATE atendimento_invasoes SET id_atendimento = $1, local = $2, dispositivo = $3, data_implante = $4, data_retirada = $5 WHERE id_invasao = $6";
  pool.query(sql, [
    id_atendimento,
    local,
    dispositivo,
    data_implante,
    data_retirada,
    id_invasao
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluir invasão.
app.get("/delete_invasao/:id_invasao", (req, res) => {
  const id_invasao = parseInt(req.params.id_invasao);
  var sql = "DELETE FROM atendimento_invasoes WHERE id_invasao = $1";
  pool.query(sql, [id_invasao], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// ATENDIMENTOS - PROPOSTAS.
// listar todas as propostas do atendimento selecionado.
app.get("/list_propostas/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_propostas WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// inserir proposta.
app.post("/insert_proposta", (req, res) => {
  const {
    id_atendimento,
    proposta,
    status,
    data_proposta,
    id_usuario,
    prazo
  } = req.body;
  var sql = "INSERT INTO atendimento_propostas (id_atendimento, proposta, status, data_proposta, id_usuario, prazo) VALUES ($1, $2, $3, $4, $5, $6)"
  pool.query(sql, [
    id_atendimento,
    proposta,
    status,
    data_proposta,
    id_usuario,
    prazo
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// atualizar proposta.
app.post("/update_proposta/:id_proposta", (req, res) => {
  const id_proposta = parseInt(req.params.id_proposta);
  const {
    id_atendimento,
    proposta,
    status,
    data_proposta,
    id_usuario,
    prazo
  } = req.body;
  var sql = "UPDATE atendimento_propostas SET id_atendimento = $1, proposta = $2, status = $3, data_proposta = $4, id_usuario = $5, prazo = $6 WHERE id_proposta = $7";
  pool.query(sql, [
    id_atendimento,
    proposta,
    status,
    data_proposta,
    id_usuario,
    prazo,
    id_proposta
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluir proposta.
app.get("/delete_proposta/:id_proposta", (req, res) => {
  const id_proposta = parseInt(req.params.id_proposta);
  var sql = "DELETE FROM atendimento_propostas WHERE id_proposta = $1";
  pool.query(sql, [id_proposta], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// ATENDIMENTOS - SINAIS VITAIS.
// listar todos os registros de sinais vitais do atendimento selecionado.
app.get("/list_sinais_vitais/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_sinais_vitais WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// inserir sinais vitais.
app.post("/insert_sinais_vitais", (req, res) => {
  const {
    id_atendimento,
    pas, pad, fc, fr, sao2, tax,
    glicemia,
    diurese, balanco,
    evacuacao, estase,
    data_sinais_vitais
  } = req.body;
  var sql = "INSERT INTO atendimento_sinais_vitais (id_atendimento, pas, pad, fc, fr, sao2, tax, glicemia, diurese, balanco, evacuacao, estase, data_sinais_vitais) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)"
  pool.query(sql, [
    id_atendimento,
    pas, pad, fc, fr, sao2, tax,
    glicemia,
    diurese, balanco,
    evacuacao, estase,
    data_sinais_vitais
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// atualizar sinais vitais.
app.post("/update_sinais_vitais/:id_sinais_vitais", (req, res) => {
  const id_sinais_vitais = parseInt(req.params.id_sinais_vitais);
  const {
    id_atendimento,
    pas, pad, fc, fr, sao2, tax,
    glicemia,
    diurese, balanco,
    evacuacao, estase,
    data_sinais_vitais
  } = req.body;
  var sql = "UPDATE atendimento_sinais_vitais SET id_atendimento = $1, pas = $2, pad = $3, fc = $4, fr = $5, sao2 = $6, tax  = $7, glicemia  = $8, diurese = $9, balanco = $10, evacuacao = $11, estase  = $12, data_sinais_vitais  = $13 WHERE id_sinais_vitais = $14";
  pool.query(sql, [
    id_atendimento,
    pas, pad, fc, fr, sao2, tax,
    glicemia,
    diurese, balanco,
    evacuacao, estase,
    data_sinais_vitais,
    id_sinais_vitais
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluir sinais vitais.
app.get("/delete_sinais_vitais/:id_sinais_vitais", (req, res) => {
  const id_sinais_vitais = parseInt(req.params.id_sinais_vitais);
  var sql = "DELETE FROM atendimento_sinais_vitais WHERE id_sinais_vitais = $1";
  pool.query(sql, [id_sinais_vitais], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// ATENDIMENTOS - VENTILAÇÃO MECÂNICA.
// listar todos os registros de ventilaçção mecânica (VM) do atendimento selecionado.
app.get("/list_vm/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_vm WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// inserir vm.
app.post("/insert_vm", (req, res) => {
  const {
    id_atendimento,
    modo,
    pressao,
    volume,
    peep,
    fio2,
    data_vm
  } = req.body;
  var sql = "INSERT INTO atendimento_vm (id_atendimento, modo, pressao, volume, peep, fio2, data_vm) VALUES ($1, $2, $3, $4, $5, $6, $7)"
  pool.query(sql, [
    id_atendimento,
    modo,
    pressao,
    volume,
    peep,
    fio2,
    data_vm
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// atualizar vm.
app.post("/update_vm/:id_vm", (req, res) => {
  const id_vm = parseInt(req.params.id_vm);
  const {
    id_atendimento,
    modo,
    pressao,
    volume,
    peep,
    fio2,
    data_vm
  } = req.body;
  var sql = "UPDATE atendimento_propostas SET id_atendimento = $1, modo = $2, pressao = $3, volume = $4, peep = $5, fio2 = $6, data_vm  = $7 WHERE id_vm = $8";
  pool.query(sql, [
    id_atendimento,
    modo,
    pressao,
    volume,
    peep,
    fio2,
    data_vm,
    id_vm
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluir vm.
app.get("/delete_vm/:id_vm", (req, res) => {
  const id_vm = parseInt(req.params.id_vm);
  var sql = "DELETE FROM atendimento_vm WHERE id_vm = $1";
  pool.query(sql, [id_vm], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// ATENDIMENTOS - CULTURAS.
// listar todos os registros de culturas relativos ao atendimento selecionado.
app.get("/list_culturas/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_culturas WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// inserir cultura.
app.post("/insert_cultura", (req, res) => {
  const {
    id_atendimento,
    material,
    resultado,
    data_pedido,
    data_resultado,
  } = req.body;
  var sql = "INSERT INTO atendimento_culturas (id_atendimento, material, resultado, data_pedido, data_resultado) VALUES ($1, $2, $3, $4, $5)"
  pool.query(sql, [
    id_atendimento,
    material,
    resultado,
    data_pedido,
    data_resultado,
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// atualizar cultura.
app.post("/update_cultura/:id_cultura", (req, res) => {
  const id_cultura = parseInt(req.params.id_cultura);
  const {
    id_atendimento,
    material,
    resultado,
    data_pedido,
    data_resultado,
  } = req.body;
  var sql = "UPDATE atendimento_culturas SET id_atendimento = $1, material = $2, resultado = $3, data_pedido = $4, data_resultado = $5 WHERE id_cultura = $6";
  pool.query(sql, [
    id_atendimento,
    material,
    resultado,
    data_pedido,
    data_resultado,
    id_cultura
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluir cultura.
app.get("/delete_cultura/:id_cultura", (req, res) => {
  const id_cultura = parseInt(req.params.id_cultura);
  var sql = "DELETE FROM atendimento_culturas WHERE id_cultura = $1";
  pool.query(sql, [id_cultura], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// ATENDIMENTOS - DIETA.
// listar todos os registros de dieta relativos ao atendimento selecionado.
app.get("/list_dietas/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_dietas WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// inserir dieta.
app.post("/insert_dieta", (req, res) => {
  const {
    infusao,
    get,
    tipo,
    data_inicio,
    data_termino,
    id_atendimento
  } = req.body;
  var sql = "INSERT INTO atendimento_dietas (infusao, get, tipo, data_inicio, data_termino, id_atendimento) VALUES ($1, $2, $3, $4, $5, $6)"
  pool.query(sql, [
    infusao,
    get,
    tipo,
    data_inicio,
    data_termino,
    id_atendimento
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// atualizar dieta.
app.post("/update_dieta/:id_dieta", (req, res) => {
  const id_dieta = parseInt(req.params.id_dieta);
  const {
    infusao,
    get,
    tipo,
    data_inicio,
    data_termino,
    id_atendimento
  } = req.body;
  var sql = "UPDATE atendimento_culturas SET infusao = $1, get = $2, tipo = $3, data_inicio = $4, data_termino = $5, id_atendimento = $6 WHERE id_dieta = $7";
  pool.query(sql, [
    infusao,
    get,
    tipo,
    data_inicio,
    data_termino,
    id_atendimento,
    id_dieta
  ], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// excluir dieta.
app.get("/delete_dieta/:id_dieta", (req, res) => {
  const id_dieta = parseInt(req.params.id_dieta);
  var sql = "DELETE FROM atendimento_dietas WHERE id_dieta = $1";
  pool.query(sql, [id_dieta], (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});