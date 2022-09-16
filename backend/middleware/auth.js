const jwt = require("jsonwebtoken");
const { promisify } = require("util");

module.exports = {
  eAdmin: async function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({
        erro: true,
        menssage: "Erro 1",
      });
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(400).json({
        erro: true,
        menssage: "Erro 2",
      });
    }

    try {
      const decode = await promisify(jwt.verify)(
        token,
        "D68021SAD21W854F1SA1CA5S6DAS4156FS4A1CSA32D41AS56D4"
      );
      req.userID = decode.id;
      req.userEmail = decode.email;

      return next();
    } catch (error) {
      return res.status(400).json({
        erro: true,
        menssage: "Necessario realizar login - Token Invalido",
      });
    }
  },
};
