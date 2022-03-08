const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");

const date = Date();
const unix_time = Date.parse(date);
const createDate = unix_time / 1000;

const generateAccessToken = (id, username, role) => {
  const payload = {
    id,
    username,
    role,
  };
  return jwt.sign(payload, secret, { expiresIn: "30d" });
};

class authController {
  async registration(req, res) {
    const { name, password, phone, role, born_date } = req.body;
    if ((!name, !password, !phone, !role, !born_date)) {
      return res.status(400).json({ message: "Barcha maydonlarni to'ldiring" });
    } else {
      const isUser = await prisma.users.findUnique({
        where: {
          phone: phone,
        },
      });

      // agar user bor bo'lsa
      if (isUser) {
        return res.status(400).json({ message: "Bu telefon raqami bor" });
      } else {
        // agar user bor bo'lmasa
        const hashPassword = await bcrypt.hash(password, 7);

        prisma.users
          .create({
            data: {
              date_created: String(createDate),
              password: hashPassword,
              roles: {
                connect: {
                  role: "SALON",
                },
              },
              name: name,
              phone: phone,
              born_date: born_date,
            },
            include: {
              roles: true,
            },
          })
          .then(() => {
            const token = generateAccessToken(
              createUser.id,
              createUser.phone,
              createUser.roles?.role
            );
            console.log(token);
            console.log(createUser);
            let CombinedUser = { token, ...createUser };
            res.json(CombinedUser);
          })
          .catch((err) => {
            res.json({ message: err });
            console.log(err);
          });
      }
    }
  }

  async login(req, res) {
    try {
      const { phone, password } = req.body;
      const isUser = await prisma.users.findUnique({
        where: { phone: phone },
        include: {
          roles: true,
        },
      });
      if (!isUser) {
        return res
          .status(400)
          .json({ message: `Bu ${username}  username yoq reg qilib aling!` });
      }
      const validPassword = await bcrypt.compare(password, isUser.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Parol notogri terilgan" });
      }
      const token = generateAccessToken(
        isUser.id,
        isUser.username,
        isUser.roles?.role
      );
      return res.json({ token, ...isUser });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "login error" });
    }
  }

  async getUsers(req, res) {
    try {
      const getUser = await prisma.users.findMany();
      res.json({ "server working now.!😄": getUser });
    } catch (error) {
      res.json({ message: "get user catch error" });
    }
  }

  async createRole(req, res) {
    try {
      const { role } = req.body;

      let isRole = await prisma.roles.findUnique({
        where: { role: role },
      });
      if (isRole) {
        return res.status(400).json({ message: "Bu role mavjud" });
      } else {
        await prisma.roles
          .create({
            data: {
              role: role,
            },
          })
          .then((data) => {
            res.json({ message: data });
          })
          .catch((err) => {
            res.json({ message: err });
            console.log(err);
          });
      }
    } catch (error) {
      res.json({ message: "Can't create role" });
    }
  }
}

module.exports = new authController();
