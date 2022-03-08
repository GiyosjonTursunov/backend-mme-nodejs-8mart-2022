const prisma = require("../lib/prisma");

const date = Date();
const unix_time = Date.parse(date);
const createDate = unix_time / 1000;

class supplierController {
  async getAllSales(req, res) {
    await prisma.sale
      .findMany({
        where: {
          need_send: true,
          delivered: false,
          canceled: false,
        },
        select: {
          id: true,
          salonlist: true,
          given_price: true,
          salon_given_price: true,
          date_created: true,
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
  async delivered(req, res) {
    await prisma.sale
      .update({
        where: {
          id: req.body.sale_id,
        },
        data: {
          delivered: Boolean(true),
        },
      })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  }
}

module.exports = new supplierController();
