const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { eAdmin } = require("./middleware/auth");

//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

//Pegar todos Usuarios
// app.get("/", eAdmin, async (req, res) => {
//   return res.json({
//     erro: false,
//     menssage: "Listar Usuario",
//     userId: req.userID,
//     token: req.token,
//   });
// });
app.get("/", async (req, res) => {
  return res.json({
    erro: false,
    menssage: "Servidor Online",
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////USUARIOS//////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//Criar Usuario
app.post("/users/create", async (req, res) => {
  try {
    const { user_email, user_password, user_level } = req.body;
    const password = await bcrypt.hash(user_password, 8);
    const newTodo = await pool.query(
      "INSERT INTO users (user_email, user_password, user_level) VALUES($1,$2,$3) RETURNING *",
      [user_email, password, user_level]
    );
    return res.json({
      erro: false,
      menssage: newTodo.rows[0],
    });
  } catch (err) {
    console.error(err);
  }
});

app.get("/login", eAdmin, async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM users");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Login
app.post("/login", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM users");
    const newUser = allTodos.rows.filter(
      (item) => item.user_email === req.body.user_email
    );

    if (req.body.user_email != newUser[0].user_email) {
      return res.status(400).json({
        erro: true,
        menssage: "Erro: Email ou Senha incorreta",
      });
    }

    if (
      !(await bcrypt.compare(req.body.user_password, newUser[0].user_password))
    ) {
      return res.status(400).json({
        erro: true,
        menssage: "Erro: Email ou Senha incorreta",
      });
    }

    let token = jwt.sign(
      {
        id: newUser[0].user_id,
      },
      "D68021SAD21W854F1SA1CA5S6DAS4156FS4A1CSA32D41AS56D4",
      {
        //expiresIn: 600 // 10Min
        //expiresIn: '7d' // 7 dias
        // expiresIn: 60,
        expiresIn: "10h",
      }
    );
    return res.json({
      erro: false,
      menssage: "Login realizado com sucesso",
      token: token,
      level: newUser[0].user_level,
      id: newUser[0].user_id,
    });
  } catch (err) {
    console.error(err.message);
  }
});

//Pegar todos Usuarios
app.get("/users", eAdmin, async (req, res) => {
  return res.json({
    erro: false,
    menssage: "Listar Usuario",
    userId: req.userID,
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////CLIENTES//////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//Criar Clientes
app.post("/client/create", eAdmin, async (req, res) => {
  try {
    const {
      client_name,
      client_tel,
      client_street,
      client_number,
      client_district,
      client_city,
      client_dia,
    } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO client (client_name, client_tel, client_street, client_number, client_district, client_city, client_dia) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [
        client_name,
        client_tel,
        client_street,
        client_number,
        client_district,
        client_city,
        client_dia,
      ]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Pegar todos Clientes
app.get("/client", eAdmin, async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM client");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Deletar Cliente
app.delete("/client/delete/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM client WHERE client_id = $1",
      [id]
    );
    res.json("Deletado com Sucesso!");
  } catch (err) {
    console.log(err.message);
  }
});

//Atualizar Clientes
app.put("/client/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      client_name,
      client_tel,
      client_street,
      client_number,
      client_district,
      client_city,
      client_dia,
    } = req.body;

    const updateTodo = await pool.query(
      "UPDATE client SET client_name = $1, client_tel = $2, client_street = $3, client_number = $4, client_district = $5, client_city = $6, client_dia = $7 WHERE client_id = $8",
      [
        client_name,
        client_tel,
        client_street,
        client_number,
        client_district,
        client_city,
        client_dia,
        id,
      ]
    );
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////SERVICOS//////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//Criar Servicos
app.post("/service/create", eAdmin, async (req, res) => {
  try {
    const {
      servico_name,
      servico_price,
      servico_environment,
      servico_progress,
      servico_status,
      servico_statusdelivery,
      servico_progressdelivery,
      servico_month,
      servico_year,
      servico_closed,
      servico_delivery,
    } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO servico (servico_name, servico_price, servico_environment, servico_status, servico_progress, servico_statusdelivery,servico_progressdelivery,servico_month,servico_year, servico_closed,servico_delivery) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",
      [
        servico_name,
        servico_price,
        servico_environment,
        servico_progress,
        servico_status,
        servico_statusdelivery,
        servico_progressdelivery,
        servico_month,
        servico_year,
        servico_closed,
        servico_delivery,
      ]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Pegar todas Tag Servicos
app.get("/service/tag", eAdmin, async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM servicotag");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Criar Tag Servicos
app.post("/service/tag/create", eAdmin, async (req, res) => {
  try {
    const { servicotag_name, servicotag_valor } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO servicotag (servicotag_name, servicotag_valor ) VALUES($1,$2) RETURNING *",
      [servicotag_name, servicotag_valor]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Deletar Tag Servicos
app.delete("/service/tag/delete/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM servicotag WHERE servicotag_id = $1",
      [id]
    );
    res.json("Deletado com Sucesso!");
  } catch (err) {
    console.log(err.message);
  }
});

//Atualizar Tag Servicos
app.put("/service/tag/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { servicotag_name, servicotag_valor } = req.body;

    const updateTodo = await pool.query(
      "UPDATE servicotag SET servicotag_name = $1, servicotag_valor = $2  WHERE servicotag_id = $3",
      [servicotag_name, servicotag_valor, id]
    );
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

//Pegar todos Servicos
app.get("/service", eAdmin, async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM servico");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Deletar Servicos
app.delete("/service/delete/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM servico WHERE servico_id = $1",
      [id]
    );
    res.json("Deletado com Sucesso!");
  } catch (err) {
    console.log(err.message);
  }
});

//Atualizar Servicos
app.put("/service/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      servico_name,
      servico_price,
      servico_environment,
      servico_progress,
      servico_status,
      servico_statusdelivery,
      servico_progressdelivery,
      servico_month,
      servico_year,
      servico_closed,
      servico_delivery,
    } = req.body;

    const updateTodo = await pool.query(
      "UPDATE servico SET servico_name = $1, servico_price = $2, servico_environment = $3, servico_status = $4, servico_progress = $5, servico_statusdelivery = $6, servico_progressdelivery = $7, servico_month = $8, servico_year = $9, servico_closed = $10, servico_delivery = $11  WHERE servico_id = $12",
      [
        servico_name,
        servico_price,
        servico_environment,
        servico_progress,
        servico_status,
        servico_statusdelivery,
        servico_progressdelivery,
        servico_month,
        servico_year,
        servico_closed,
        servico_delivery,
        id,
      ]
    );
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////FRABRICACAO///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//Pegar todas Tag Fabricacao
app.get("/service/production/tag", eAdmin, async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM fabricartag");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Criar Tag Fabricacao
app.post("/service/production/tag/create", eAdmin, async (req, res) => {
  try {
    const { fabricartag_name, fabricartag_valor } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO fabricartag (fabricartag_name, fabricartag_valor ) VALUES($1,$2) RETURNING *",
      [fabricartag_name, fabricartag_valor]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Deletar Tag Fabricacao
app.delete("/service/production/tag/delete/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM fabricartag WHERE fabricartag_id = $1",
      [id]
    );
    res.json("Deletado com Sucesso!");
  } catch (err) {
    console.log(err.message);
  }
});

//Atualizar Tag Fabricacao
app.put("/service/production/tag/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { fabricartag_name, fabricartag_valor } = req.body;

    const updateTodo = await pool.query(
      "UPDATE fabricartag SET fabricartag_name = $1, fabricartag_valor = $2  WHERE fabricartag_id = $3",
      [fabricartag_name, fabricartag_valor, id]
    );
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

//Atualizar Fabricacao
app.put("/service/production/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      servico_price,
      servico_environment,
      servico_progress,
      servico_statusdelivery,
      servico_progressdelivery,
    } = req.body;

    const updateTodo = await pool.query(
      "UPDATE servico SET servico_price = $1, servico_environment = $2, servico_progress = $3, servico_statusdelivery = $4, servico_progressdelivery = $5 WHERE servico_id = $6",
      [
        servico_price,
        servico_environment,
        servico_progress,
        servico_statusdelivery,
        servico_progressdelivery,
        id,
      ]
    );
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

//Deletar Fabricacao
app.delete("/service/production/delete/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM servico WHERE servico_id = $1",
      [id]
    );
    res.json("Deletado com Sucesso!");
  } catch (err) {
    console.log(err.message);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////FINANCEIRO////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//Pegar Todos Financeiro
app.get("/finance", eAdmin, async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM financeiro");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Criar Financeiro
app.post("/finance/create", eAdmin, async (req, res) => {
  try {
    const {
      financeiro_name,
      financeiro_price,
      financeiro_date,
      financeiro_type,
      financeiro_split,
      financeiro_obs,
      financeiro_payment,
    } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO financeiro (financeiro_name, financeiro_price, financeiro_date, financeiro_type, financeiro_split, financeiro_obs, financeiro_payment ) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [
        financeiro_name,
        financeiro_price,
        financeiro_date,
        financeiro_type,
        financeiro_split,
        financeiro_obs,
        financeiro_payment,
      ]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Atualizar Financeiro
app.put("/finance/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      financeiro_name,
      financeiro_price,
      financeiro_date,
      financeiro_type,
      financeiro_split,
      financeiro_obs,
      financeiro_payment,
    } = req.body;

    const updateTodo = await pool.query(
      "UPDATE financeiro SET financeiro_name = $1, financeiro_price = $2, financeiro_date = $3, financeiro_type = $4, financeiro_split = $5, financeiro_obs = $6, financeiro_payment = $7 WHERE financeiro_id = $8",
      [
        financeiro_name,
        financeiro_price,
        financeiro_date,
        financeiro_type,
        financeiro_split,
        financeiro_obs,
        financeiro_payment,
        id,
      ]
    );
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

//Deletar Fabricacao
app.delete("/finance/delete/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM financeiro WHERE financeiro_id = $1",
      [id]
    );
    res.json("Deletado com Sucesso!");
  } catch (err) {
    console.log(err.message);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////COMPRAS///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//Buscar Compras
app.get("/buy", eAdmin, async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM compras");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Criar Compras
app.post("/buy/create", eAdmin, async (req, res) => {
  try {
    const {
      compras_name,
      compras_price,
      compras_date,
      compras_type,
      compras_obs,
      compras_payment,
    } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO compras (compras_name, compras_price, compras_date, compras_type, compras_obs, compras_payment ) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
      [
        compras_name,
        compras_price,
        compras_date,
        compras_type,
        compras_obs,
        compras_payment,
      ]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Atualizar Compras
app.put("/buy/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      compras_name,
      compras_price,
      compras_date,
      compras_type,
      compras_obs,
      compras_payment,
    } = req.body;

    const updateTodo = await pool.query(
      "UPDATE compras SET compras_name = $1, compras_price = $2, compras_date = $3, compras_type = $4, compras_obs = $5, compras_payment = $6 WHERE compras_id = $7",
      [
        compras_name,
        compras_price,
        compras_date,
        compras_type,
        compras_obs,
        compras_payment,
        id,
      ]
    );
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

//Deletar Compras
app.delete("/buy/delete/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM compras WHERE compras_id = $1",
      [id]
    );
    res.json("Deletado com Sucesso!");
  } catch (err) {
    console.log(err.message);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////FORNECEDOR////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//Buscar Fornecedor
app.get("/company", eAdmin, async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM fornecedor");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Criar Fornecedor
app.post("/company/create", eAdmin, async (req, res) => {
  try {
    const { fornecedor_name, fornecedor_phone } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO fornecedor (fornecedor_name, fornecedor_phone ) VALUES($1,$2) RETURNING *",
      [fornecedor_name, fornecedor_phone]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Atualiza Fornecedor
app.put("/company/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { fornecedor_name, fornecedor_phone } = req.body;

    const updateTodo = await pool.query(
      "UPDATE fornecedor SET fornecedor_name = $1, fornecedor_phone = $2 WHERE fornecedor_id = $3",
      [fornecedor_name, fornecedor_phone, id]
    );
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

//Deletar Fornecedor
app.delete("/company/delete/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM fornecedor WHERE fornecedor_id = $1",
      [id]
    );
    res.json("Deletado com Sucesso!");
  } catch (err) {
    console.log(err.message);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////CARROS////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//Buscar Carros
app.get("/car", eAdmin, async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM carro");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Deletar Car
app.delete("/car/delete/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM carro WHERE carro_id = $1",
      [id]
    );
    res.json("Deletado com Sucesso!");
  } catch (err) {
    console.log(err.message);
  }
});

//Criar Carro
app.post("/car/create", eAdmin, async (req, res) => {
  try {
    const {
      carro_name,
      carro_plate,
      carro_status,
      carro_km,
      carro_iddoc,
      carro_driver,
      carro_car,
      carro_kmstop,
      carro_kmstart,
      carro_obs,
      carro_daystop,
      carro_destiny,
      carro_date,
      carro_oil,
    } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO carro ( carro_name,carro_plate,carro_status,carro_km,carro_iddoc,carro_driver,carro_car,carro_kmstop,carro_kmstart,carro_obs, carro_daystop,carro_destiny,carro_date,carro_oil) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *",
      [
        carro_name,
        carro_plate,
        carro_status,
        carro_km,
        carro_iddoc,
        carro_driver,
        carro_car,
        carro_kmstop,
        carro_kmstart,
        carro_obs,
        carro_daystop,
        carro_destiny,
        carro_date,
        carro_oil,
      ]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Atualiza Carro
app.put("/car/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      carro_name,
      carro_plate,
      carro_status,
      carro_km,
      carro_iddoc,
      carro_driver,
      carro_car,
      carro_kmstart,
      carro_destiny,
      carro_date,
      carro_oil,
    } = req.body;

    const updateTodo = await pool.query(
      "UPDATE carro SET carro_name = $1,carro_plate = $2,carro_status = $3,carro_km = $4,carro_iddoc = $5,carro_driver = $6,carro_car = $7, carro_kmstart = $8, carro_destiny = $9,carro_date = $10,carro_oil = $11 WHERE carro_id = $12",
      [
        carro_name,
        carro_plate,
        carro_status,
        carro_km,
        carro_iddoc,
        carro_driver,
        carro_car,
        carro_kmstart,
        carro_destiny,
        carro_date,
        carro_oil,
        id,
      ]
    );
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

//Atualiza Oleo
app.put("/car/oil/updated/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { carro_oil } = req.body;

    console.log(carro_oil, id);
    const updateTodo = await pool.query(
      "UPDATE carro SET carro_oil = $1 WHERE carro_id = $2",
      [carro_oil, id]
    );
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

//Atualiza Saida Carro
app.put("/car/exit/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { carro_kmstop, carro_status, carro_kmstart, carro_km } = req.body;

    const updateTodo = await pool.query(
      "UPDATE carro SET carro_kmstop = $1, carro_status = $2, carro_kmstart = $3, carro_km = $4 WHERE carro_id = $5",
      [carro_kmstop, carro_status, carro_kmstart, carro_km, id]
    );

    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

//Deletar Carro
app.delete("/car/delete/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM carro WHERE carro_id = $1",
      [id]
    );
    res.json("Deletado com Sucesso!");
  } catch (err) {
    console.log(err.message);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////LISTA KM//////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//Buscar KM
app.get("/km", eAdmin, async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM km");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Criar Km
app.post("/km/create", eAdmin, async (req, res) => {
  try {
    const {
      km_car,
      km_date,
      km_destiny,
      km_driver,
      km_kmstop,
      km_kmstart,
      km_obs,
      km_daystop,
    } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO km (km_car,km_date,km_destiny,km_driver,km_kmstop,km_kmstart,km_obs,km_daystop) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [
        km_car,
        km_date,
        km_destiny,
        km_driver,
        km_kmstop,
        km_kmstart,
        km_obs,
        km_daystop,
      ]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Atualizar Saida
// app.put("/km/update/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { km_kmstop, km_obs, km_daystop } = req.body;

//     const updateTodo = await pool.query(
//       "UPDATE km SET km_kmstop = $1, km_obs = $2, km_daystop = $3 WHERE km_id = $4",
//       [km_kmstop, km_obs, km_daystop, id]
//     );
//     console.log("Saida KM", updateTodo.rows[0]);

//     res.json("Atualizado com Sucesso!");
//   } catch (err) {
//     console.error(err.message);
//   }
// });
app.put("/km/exit/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { km_kmstop, km_obs, km_daystop } = req.body;

    const updateTodo = await pool.query(
      "UPDATE km SET km_kmstop = $1, km_obs = $2, km_daystop = $3  WHERE km_id = $4",
      [km_kmstop, km_obs, km_daystop, id]
    );
    console.log(updateTodo.rows);
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////MOTORISTA/////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//Buscar Motorista
app.get("/driver", eAdmin, async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM motorista");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Criar Motorista
app.post("/driver/create", eAdmin, async (req, res) => {
  try {
    const { motorista_name, motorista_validate } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO motorista (motorista_name,motorista_validate) VALUES($1,$2) RETURNING *",
      [motorista_name, motorista_validate]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Deletar Motorista
app.delete("/driver/delete/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM motorista WHERE motorista_id = $1",
      [id]
    );
    res.json("Deletado com Sucesso!");
  } catch (err) {
    console.log(err.message);
  }
});

//Atualizar Motorista
app.put("/driver/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { motorista_name, motorista_validate } = req.body;

    const updateTodo = await pool.query(
      "UPDATE motorista SET motorista_name = $1, motorista_validate = $2  WHERE motorista_id = $3",
      [motorista_name, motorista_validate, id]
    );
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////AGENDA////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//Buscar Agenda
app.get("/schedule", eAdmin, async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM agenda");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Criar Agenda
app.post("/schedule/create", eAdmin, async (req, res) => {
  try {
    const {
      agenda_title,
      agenda_color,
      agenda_start,
      agenda_end,
      agenda_year,
      agenda_status,
    } = req.body;
    console.log(req.body);

    const newTodo = await pool.query(
      "INSERT INTO agenda (agenda_title, agenda_color, agenda_start, agenda_end, agenda_year, agenda_status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
      [
        agenda_title,
        agenda_color,
        agenda_start,
        agenda_end,
        agenda_year,
        agenda_status,
      ]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Atualizar Agenda
app.put("/schedule/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      agenda_title,
      agenda_color,
      agenda_start,
      agenda_end,
      agenda_year,
      agenda_status,
    } = req.body;

    const updateTodo = await pool.query(
      "UPDATE agenda SET agenda_title = $1,agenda_color = $2,agenda_start = $3,agenda_end = $4,agenda_year = $5, agenda_status = $6  WHERE agenda_id = $7",
      [
        agenda_title,
        agenda_color,
        agenda_start,
        agenda_end,
        agenda_year,
        agenda_status,
        id,
      ]
    );
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

//Pegar todas Tag Calendario
app.get("/schedule/tag", eAdmin, async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM calendariotag");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Criar Tag Calendario
app.post("/schedule/tag/create", eAdmin, async (req, res) => {
  try {
    const { calendariotag_name, calendariotag_valor } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO calendariotag (calendariotag_name, calendariotag_valor ) VALUES($1,$2) RETURNING *",
      [calendariotag_name, calendariotag_valor]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Deletar Tag Calendario
app.delete("/schedule/tag/delete/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM calendariotag WHERE calendariotag_id = $1",
      [id]
    );
    res.json("Deletado com Sucesso!");
  } catch (err) {
    console.log(err.message);
  }
});

//Atualizar Tag Calendario
app.put("/schedule/tag/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { calendariotag_name, calendariotag_valor } = req.body;

    const updateTodo = await pool.query(
      "UPDATE calendariotag SET calendariotag_name = $1, calendariotag_valor = $2  WHERE calendariotag_id = $3",
      [calendariotag_name, calendariotag_valor, id]
    );
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

//Deletar Carro
app.delete("/schedule/delete/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM agenda WHERE agenda_id = $1",
      [id]
    );
    res.json("Deletado com Sucesso!");
  } catch (err) {
    console.log(err.message);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////Pagamento////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//Pegar todas Tag Calendario
app.get("/payment", eAdmin, async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM tipopagamento");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Criar Tag Calendario
app.post("/payment/create", eAdmin, async (req, res) => {
  try {
    const { pagamento_name, pagamento_valor, pagamento_status } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO tipopagamento (pagamento_name,pagamento_valor, pagamento_status) VALUES($1,$2,$3) RETURNING *",
      [pagamento_name, pagamento_valor, pagamento_status]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Deletar Tag Calendario
app.delete("/payment/delete/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM tipopagamento WHERE pagamento_id = $1",
      [id]
    );
    res.json("Deletado com Sucesso!");
  } catch (err) {
    console.log(err.message);
  }
});

//Atualizar Tag Calendario
app.put("/payment/update/:id", eAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { pagamento_name, pagamento_valor, pagamento_status } = req.body;

    const updateTodo = await pool.query(
      "UPDATE tipopagamento SET pagamento_name = $1, pagamento_valor = $2 , pagamento_status = $3  WHERE pagamento_id = $4",
      [pagamento_name, pagamento_valor, pagamento_status, id]
    );
    res.json("Atualizado com Sucesso!");
  } catch (err) {
    console.error(err.message);
  }
});

//////////////////////////////////////////////////////////////////////////////////////////

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
