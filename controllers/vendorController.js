const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

const date = Date();
const unix_time = Date.parse(date);
const createDate = unix_time / 1000;

class vendorController {
  async test(req, res) {
    res.json({ message: "test salom" });
  }

  async createDress(req, res) {
    console.log("req.user ==>", req.user);
    console.log("ish boshladik");
    await prisma.dress
      .create({
        data: {
          name: req.body.name,
          img: req.body.imgBase64,
          date_created: String(createDate),
          users: {
            connect: {
              id: Number(req.user.id),
            },
          },
          price: String(req.body.price),
        },
      })
      .then((data) => {
        res.json(data);
        console.log("data =>  ", data);
      })
      .catch((err) => {
        res.json(err);
        console.log(err);
      });
  }

  async getDress(req, res) {
    await prisma.dress
      .findMany({
        select: {
          id: true,
          name: true,
          date_created: true,
          price: true,
        },
      })
      .then((data) => {
        res.json(data);
        console.log("Magazin ==>", data);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  }

  async getDressMag(req, res) {
    await prisma.dress
      .findMany({
        select: {
          id: true,
          name: true,
          date_created: true,
          price: true,
          users: {
            include: {
              magazins: true,
            },
          },
        },
        where: {
          users: {
            magazins: {
              name: {
                equals: req.body.magazine_name,
              },
            },
          },
        },
      })
      .then((data) => {
        res.json(data);
        console.log("Magazin ==>", data);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  }

  async createSalon(req, res) {
    // res.json({ message: "Salom createSalon" });
    const isCandidate = await prisma.users.findUnique({
      where: { username: req.body.username },
    });
    if (isCandidate) {
      return res
        .status(400)
        .json({ message: "Bu username bilan uja odam yest" });
    } else {
      const hashPassword = await bcrypt.hash(req.body.password, 7);
      const createUser = await prisma.users.create({
        data: {
          username: req.body.username,
          password: hashPassword,
          roles: {
            connect: {
              role: "SALON",
            },
          },
          name: req.body.salonChiName,
          phone: req.body.salonPhone,
          born_date: "",
          date_created: String(createDate),
        },
        include: {
          roles: true,
        },
      });

      await prisma.salonlist
        .create({
          data: {
            salonchi_name: req.body.salonChiName,
            salon_name: req.body.salonName,
            phone: req.body.salonPhone,
            address: req.body.salonAddress,
            user_id: Number(createUser.id),
            date_created: String(createDate),
          },
        })
        .then((dataSalonList) => {
          res.json({ dataSalonList });
        })
        .catch((err) => {
          res.json(err);
          console.log(err, " salonListCreate");
        });
    }
  }

  async getSalonList(req, res) {
    await prisma.salonlist
      .findMany({
        select: {
          id: true,
          salon_name: true,
          address: true,
        },
      })
      .then((data) => {
        res.json(data);
        // console.log("Nimasi bu datasalonlist => ", data);
      })
      .catch((err) => {
        res.json(err);
      });
  }

  async createSale(req, res) {
    if (Boolean(req.body.isFifty)) {
      console.log("TURE diamush");
      await prisma.sale
        .create({
          data: {
            dress: {
              connect: {
                id: Number(req.body.dress_id),
              },
            },
            main_price: req.body.main_price,
            dress_note: req.body.dress_note,
            given_price: req.body.given_price,
            left_price: req.body.left_price,
            sold_by_phone: Boolean(req.body.sold_by_phone),
            // salonlist: {
            //   connect: {
            //     id: Number(req.body.salon_id),
            //   },
            // },
            delivery_date: req.body.delivery_date,
            need_send: Boolean(req.body.need_send),
            isfifty: true,
            girl_name: req.body.girl_name,
            wedding_date: req.body.wedding_date,
            ispassport: Boolean(req.body.is_passport),
            salon_given_price: req.body.salon_given_price,
            date_created: String(createDate),
            users: {
              connect: {
                id: Number(req.body.id),
              },
            },
            // dress_count: req.body.dress_count,
          },
        })
        .then((data) => {
          res.json(data);
          console.log(data);
        })
        .catch((err) => {
          res.json(err);
          console.log(err);
        });
    } else {
      console.log("ELSEKU BUU");
      await prisma.sale
        .create({
          data: {
            dress: {
              connect: {
                id: Number(req.body.dress_id),
              },
            },
            dress_count: req.body.dress_count,
            main_price: req.body.main_price,
            dress_note: req.body.dress_note,
            given_price: req.body.given_price,
            left_price: req.body.left_price,
            date_left_price: req.body.date_left_price,
            sold_by_phone: Boolean(req.body.sold_by_phone),
            salonlist: {
              connect: {
                id: Number(req.body.salon_id),
              },
            },
            delivery_date: req.body.delivery_date,
            need_send: Boolean(req.body.need_send),
            date_created: String(createDate),
            users: {
              connect: {
                id: Number(req.user.id),
              },
            },
          },
        })
        .then((data) => res.json(data))
        .catch((err) => {
          console.log(err);
          res.json(err);
        });
    }
  }

  async getAllSales(req, res) {
    await prisma.sale
      .findMany({
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

  async dressById(req, res) {
    await prisma.dress
      .findUnique({
        where: {
          id: Number(req.params.id),
        },
        include: {
          sale: {
            include: {
              salonlist: true,
            },
          },
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
}

module.exports = new vendorController();
