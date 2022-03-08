const prisma = require("../lib/prisma");

const date = Date();
const unix_time = Date.parse(date);
const createDate = unix_time / 1000;

class directorController {
  async getmagazin(req, res) {
    // res.json({ message: "Salom" });
    await prisma.magazins
      .findMany()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
        console.log(err);
      });
  }

  async createMagazine(req, res) {
    await prisma.magazins
      .create({
        data: {
          name: req.body.magazine_name,
          date_created: String(createDate),
        },
      })
      .then((data) => res.json(data))
      .catch((err) => {
        res.json(err);
        console.log(err);
      });
  }

  async countDressNeedSend(req, res) {
    await prisma.sale
      .count({
        where: {
          need_send: true,
          delivered: false,
          canceled: false,
        },
      })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
        console.log(err);
      });
  }

  async getCountProduct(req, res) {
    await prisma.product
      .count()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
        console.log(err);
      });
  }
}

module.exports = new directorController();
