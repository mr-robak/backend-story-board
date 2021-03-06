const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const User = require("../models/").user;
const Homepage = require("../models/").homepage;
const Story = require("../models/").story;

const { SALT_ROUNDS } = require("../config/constants");

const router = new Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({
      where: { email },
      include: {
        model: Homepage,
        include: [Story],
        order: [[Story, "createdAt", "DESC"]],
      },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: "User with that email not found or password incorrect",
      });
    }
    console.log("user recieved at login", user.get({ plain: true }));
    delete user.dataValues["password"]; // don't send back the password hash
    const token = toJWT({ userId: user.id });
    return res.status(200).send({ token, ...user.dataValues });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).send("Please provide an email, password and a name");
  }

  try {
    const newUser = await User.create({
      email,
      password: bcrypt.hashSync(password, SALT_ROUNDS),
      name,
    });
    const newHomepage = await Homepage.create({
      title: ` ${newUser.name}'s homepage`,
      description: null,
      // backgroundColor: "#ffffff",
      // color: "#000000",
      userId: newUser.id,
    });
    const token = toJWT({ userId: newUser.id });
    // const userHomepage = User.findByPk(newUser.id, { include: Homepage });
    const userHomepage = await User.findByPk(newUser.id, { include: Homepage });

    delete userHomepage.dataValues["password"]; // don't send back the password hash
    // console.log(111111111, userHomepage.dataValues);

    res.status(201).json({ token, ...userHomepage.dataValues });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .send({ message: "There is an existing account with this email" });
    }

    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

// The /me endpoint can be used to:
// - get the users email & name using only their token
// - checking if a token is (still) valid
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findOne({
    include: {
      model: Homepage,
      include: [Story],
      order: [[Story, "createdAt", "DESC"]],
    },
  });

  // console.log(444444, "user, witth homepage and stories", user.dataValues);
  // don't send back the password hash
  delete user.dataValues["password"];
  res.status(200).send({ ...user.dataValues });
});

module.exports = router;
