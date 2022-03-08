const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

const date = Date();
const unix_time = Date.parse(date);
const createDate = unix_time / 1000;

class wareHouseController {
  async registerProduct(req, res) {
    console.log("ketti");
    await prisma.product
      .create({
        data: {
          name: req.body.product_name,
          amount: String(req.body.is_used),
          date_created: createDate,
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

  async getProducts(req, res) {
    await prisma.product
      .findMany()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
        console.log(err);
      });
  }

  async addProduct(req, res) {
    await prisma.warehouse
      .create({
        data: {
          date_created: Number(createDate),
          count: Number(req.body.product_count),
          isused: Boolean(false),
          note: req.body.product_note,
          price: Number(req.body.product_price),
          product: {
            connect: {
              id: Number(req.body.product_id),
            },
          },
        },
      })
      .then(async (data) => {
        // res.json(data);

        const product = await prisma.product.findUnique({
          where: {
            id: Number(req.body.product_id),
          },
        });

        await prisma.product
          .update({
            data: {
              count: String(
                Number(product.count) + Number(req.body.product_count)
              ),
            },
            where: {
              id: Number(req.body.product_id),
            },
          })
          .then((data) => {
            res.json(data);
          })
          .catch((err) => {
            res.json(err);
            console.log(err);
          });
      })
      .catch((err) => {
        res.json(err);
        console.log(err);
      });
  }

  async useProduct(req, res) {
    await prisma.warehouse
      .create({
        data: {
          date_created: Number(createDate),
          count: Number(req.body.product_count),
          isused: Boolean(true),
          note: req.body.product_note,
          product: {
            connect: {
              id: Number(req.body.product_id),
            },
          },
        },
      })
      .then(
        (async() => {
          const product = await prisma.product.findUnique({
            where: {
              id: Number(req.body.product_id),
            },
          });

          await prisma.product
            .update({
              data: {
                count: String(
                  Number(product.count) - Number(req.body.product_count)
                ),
              },
              where: {
                id: Number(req.body.product_id),
              },
            })
            .then((data) => {
              res.json(data);
            })
            .catch((err) => {
              res.json(err);
              console.log(err);
            });
        })
      )
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = new wareHouseController();
