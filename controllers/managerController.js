const prisma = require("../lib/prisma");

const date = new Date();
let todayDate = date.getDate();
let thisMonth;

if (todayDate > 10) {
  return null;
} else {
  todayDate = "0" + todayDate;
  console.warn(todayDate);
}

if (date.getMonth() + 1 > 10) {
  thisMonth = date.getMonth() + 1;
} else {
  thisMonth = "0" + (date.getMonth() + 1);
}

const todayFullDate = date.getFullYear() + "-" + thisMonth + "-" + todayDate;

class managerController {
  async getBalance(req, res) {
    await prisma.balance
      .findFirst({
        select: {
          balance: true,
          left_balance: true,
        },
      })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  }

  async createCosts(req, res) {
    try {
      if (
        req.body.name &&
        req.body.number &&
        req.body.amount &&
        req.body.price &&
        req.body.note
      ) {
        if (
          req.body.keyWord == "serio" &&
          Number(req.body.price) &&
          Number(req.body.left_balance)
        ) {
          await prisma.costs
            .create({
              data: {
                name: req.body.name,
                number: req.body.number,
                amount: req.body.amount,
                price: req.body.price,
                note: req.body.note,
                date_created: String(todayFullDate),
              },
            })
            .then(async () => {
              await prisma.balance
                .update({
                  where: { id: 1 },
                  data: {
                    left_balance: String(
                      Number(req.body.left_balance) - Number(req.body.price)
                    ),
                    date_created_updated: String(todayFullDate),
                  },
                  select: {
                    balance: true,
                    left_balance: true,
                  },
                })
                .then((updatedBalance) => {
                  res.json({ ...updatedBalance, ishlatildi: req.body.price });
                })
                .catch((err) => {
                  res.json({ message: "yangilashda error" });
                  console.log(err);
                });
            })
            .catch((err) => {
              res.json({ message: "create costs error" });
              console.log(err);
            });
        } else if (req.body.keyWord == "prochi") {
          // res.json({ mesage: "prochi" });
          // console.log("prochi");
          await prisma.costs
            .create({
              data: {
                name: req.body.name,
                number: req.body.number,
                amount: req.body.amount,
                price: req.body.price,
                note: req.body.note,
                date_created: String(todayFullDate),
                is_serio: false,
              },
            })
            .then(async () => {
              await prisma.balance
                .update({
                  where: { id: 1 },
                  data: {
                    left_balance: String(
                      Number(req.body.left_balance) - Number(req.body.price)
                    ),
                    date_created_updated: String(todayFullDate),
                  },
                  select: {
                    balance: true,
                    left_balance: true,
                  },
                })
                .then((updatedBalance) => {
                  res.json({ ...updatedBalance, ishlatildi: req.body.price });
                })
                .catch((err) => {
                  res.json({ message: "yangilashda error" });
                  console.log(err);
                });
            })
            .catch((err) => {
              res.json({ message: "create costs error" });
              console.log(err);
            });
        } else {
          res.json({ mesage: "mazzeni qochiraman…" });
        }
      } else {
        return res.status(419).json({ message: "To'liq yozilmagan…" });
      }
    } catch (error) {
      res.status(400).json({ message: "Xarajat yaratishda xatolik" });
      console.log(error);
    }
  }

  async createUpdateBalance(req, res) {
    try {
      // balance note
      // if (!req.body.balance || !req.body.note) {
      //   return res.status(419).json({ message: "To'liq yozilmagan…" });
      // }
      // birinchi balans yaratadi agar bolmasa . agar bolsa uni abnavit qiladi.
      if (Number(req.body.balance) && req.body.note) {
        await prisma.balance
          .count()
          .then(async (isBalance) => {
            if (Number(isBalance) === 0) {
              // res.status(200).json(data);
              // console.log(req.body.balance, " balans.", isBalance);
              await prisma.balance
                .create({
                  data: {
                    balance: req.body.balance,
                    left_balance: req.body.balance,
                    date_created_updated: String(todayFullDate),
                  },
                  // select: false
                })
                .then(async (createdBalancedata) => {
                  // console.log(createdBalancedata, " balans");
                  // res.status(200).json(data);
                  if (req.body.balance && req.body.note) {
                    // console.log(req.body.balance , req.body.note, " bu ifan otdi");
                    await prisma.balance_history
                      .create({
                        data: {
                          add_balance: req.body.balance,
                          note: req.body.note,
                          date_created: String(todayFullDate),
                        },
                        select: {
                          date_created: true,
                        },
                      })
                      .then(() => {
                        res.json(createdBalancedata);
                      })
                      .catch((err) => {
                        res.json({ message: "Istoriyada hato" });
                        console.log(err);
                      });
                  } else {
                    res.json({ message: "T`oliq yozilmagan…" });
                  }
                })
                .catch((err) => {
                  res.status(400).json({ message: err });
                  console.log(err);
                });
            } else {
              // Update
              // balansni ozgartir. qoldiqni ozgartir. history yoz.
              // await prisma.balance.findFirst();
              // res.json(getBalance.balance);
              const getOldBalance = await prisma.balance.findFirst({
                select: {
                  balance: true,
                  left_balance: true,
                },
              });
              await prisma.balance_history
                .create({
                  data: {
                    add_balance: req.body.balance,
                    note: req.body.note,
                    date_created: String(todayFullDate),
                  },
                  select: false,
                })
                .then(async () => {
                  // res.json(createdBalanceHistoryData);
                  console.log(
                    String(
                      Number(getOldBalance.balance) + Number(req.body.balance)
                    )
                  );
                  // console.log(createdBalanceHistoryData);
                  await prisma.balance
                    .update({
                      where: { id: 1 },
                      data: {
                        balance: String(
                          Number(getOldBalance.balance) +
                            Number(req.body.balance)
                        ),
                        left_balance: String(
                          Number(getOldBalance.left_balance) +
                            Number(req.body.balance)
                        ),
                        date_created_updated: String(todayFullDate),
                      },
                      select: {
                        balance: true,
                        left_balance: true,
                      },
                    })
                    .then((updatedBalance) => {
                      res.json({
                        ...updatedBalance,
                        "qo'shildi": req.body.balance,
                      });
                    })
                    .catch((err) => {
                      res.json({
                        message: "update can not balance and history =>" + err,
                      });
                      console.log(err);
                    });
                })
                .catch((err) => {
                  res.json({ message: "istoriya hatosi ikki" });
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            res.status(400).json({ message: "chota balans create hatolik" });
            console.log(err);
          });
      } else {
        res.json({ message: "O'ynashma" });
      }
    } catch (error) {
      res.status(400).json({ message: "Balans yaratishda xatolik…" });
      console.log(err);
    }
  }

  async reportBalance(req, res) {
    // res.json({ message: "Salom" });
    if (req.body.note) {
      await prisma.balance_history
        .create({
          data: {
            note: req.body.note,
            date_created: String(todayFullDate),
          },
        })
        .then(async () => {
          await prisma.balance
            .update({
              where: { id: 1 },
              data: {
                balance: "0",
                left_balance: "0",
                date_created_updated: String(todayFullDate),
              },
              select: {
                balance: true,
                left_balance: true,
              },
            })
            .then((dataUpdatedBalance) => {
              res.json(dataUpdatedBalance);
            })
            .catch((err) => {
              res.json({ message: "update balance error" });
              console.log(err);
            });
        })
        .catch((err) => {
          res.json({ message: "history error…" });
          console.log(err);
        });
    } else {
      res.json({ message: "Nima qivossan bratish" });
      console.log(err);
    }
  }

  async getCosts(req, res) {
    await prisma.costs
      .findMany({
        where: {
          is_serio: true,
        },
        orderBy: {
          id: "desc",
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

  async getCostsProchi(req, res) {
    await prisma.costs
      .findMany({
        where: {
          is_serio: false,
        },
        orderBy: {
          id: "desc",
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

  async getCostsStatisticsByDate(req, res) {
    console.log("startdate   =>", req.body.startDate);
    await prisma.costs
      .findMany({
        where: {
          date_created: {
            gte: req.body.startDate,
            lte: req.body.endDate,
          },
        },
      })
      .then((data) => {
        // res.json({price: });
        let lastValue = 0;
        // const numbers1 = [45, 4, 9, 16, 25];
        const totalValue = data.map(myFunction);

        function myFunction(value, index, array) {
          lastValue = Number(value.price) + lastValue;
          console.log("lastValue ==>", lastValue);
        }
        console.log("filtered data  =>", data);
        res.json({ price: lastValue });
      })
      .catch((err) => {
        res.json(err);
        console.log("error filtered data =>", err);
      });
  }

  async getRoles(req, res) {
    await prisma.roles
      .findMany()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
        console.log(err);
      });
  }
}

module.exports = new managerController();
