const express = require("express");
const app = express();

const Homepages = require("./models").homepage;
const Stories = require("./models").story;
const Users = require("./models").user;

/**
 * Middlewares
 *
 * It is advisable to configure your middleware before configuring the routes
 * If you configure routes before the middleware, these routes will not use them
 *
 */

/**
 * morgan:
 *
 * simple logging middleware so you can see
 * what happened to your request
 *
 * example:
 *
 * METHOD   PATH        STATUS  RESPONSE_TIME   - Content-Length
 *
 * GET      /           200     1.807 ms        - 15
 * POST     /echo       200     10.251 ms       - 26
 * POST     /puppies    404     1.027 ms        - 147
 *
 * github: https://github.com/expressjs/morgan
 *
 */

const loggerMiddleWare = require("morgan");
app.use(loggerMiddleWare("dev"));

/**
 *
 * express.json():
 * be able to read request bodies of JSON requests
 * a.k.a. body-parser
 * Needed to be able to POST / PUT / PATCH
 *
 * docs: https://expressjs.com/en/api.html#express.json
 *
 */

const bodyParserMiddleWare = express.json();
app.use(bodyParserMiddleWare);

/**
 *
 * cors middleware:
 *
 * Since our api is hosted on a different domain than our client
 * we are are doing "Cross Origin Resource Sharing" (cors)
 * Cross origin resource sharing is disabled by express by default
 * for safety reasons (should everybody be able to use your api, I don't think so!)
 *
 * We are configuring cors to accept all incoming requests
 * If you want to limit this, you can look into "white listing" only certain domains
 *
 * docs: https://expressjs.com/en/resources/middleware/cors.html
 *
 */

const corsMiddleWare = require("cors");
app.use(corsMiddleWare());

/**
 *
 * delay middleware
 *
 * Since our api and client run on the same machine in development mode
 * the request come in within milliseconds
 * To simulate normal network traffic this simple middleware delays
 * the incoming requests by 1500 second
 * This allows you to practice with showing loading spinners in the client
 *
 * - it's only used when you use npm run dev to start your app
 * - the delay time can be configured in the package.json
 */

if (process.env.DELAY) {
  app.use((req, res, next) => {
    setTimeout(() => next(), parseInt(process.env.DELAY));
  });
}

/**
 *
 * authMiddleware:
 *
 * When a token is provided:
 * decrypts a jsonwebtoken to find a userId
 * queries the database to find the user with that add id
 * adds it to the request object
 * user can be accessed as req.user when handling a request
 * req.user is a sequelize User model instance
 *
 * When no or an invalid token is provided:
 * returns a 4xx reponse with an error message
 *
 * check: auth/middleware.js
 *
 * For fine grained control, import this middleware in your routers
 * and use it for specific routes
 *
 * for a demo check the following endpoints
 *
 * POST /authorized_post_request
 * GET /me
 *
 */

const authMiddleWare = require("./auth/middleware");

/**
 * Routes
 *
 * Define your routes here (now that middlewares are configured)
 */
app.get("/", async (req, res) => {
  try {
    const pages = await Homepages.findAll();
    res.send(pages);
  } catch (error) {
    // console.log("OH NO AN ERROR", error.message);
    // console.log("WHAT HAPPENED?", error.response.data);
    res.send(error);
  }
});

app.get("/homepages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Homepages.findByPk(id, {
      include: Stories,
    });
    res.send(page);
  } catch (error) {
    // console.log("OH NO AN ERROR", error.message);
    // console.log("WHAT HAPPENED?", error.response.data);
    res.send(error);
  }
});

app.patch("/homepages/:id", authMiddleWare, async (req, res) => {
  try {
    const homepage = await Homepages.findByPk(req.params.id);
    if (homepage.userId !== req.user.id) {
      res
        .status(403)
        .send({ message: "You are not authorized to update this homepage" });
    }
    const { title, description, backgroundColor, color } = req.body;
    await homepage.update({ title, description, backgroundColor, color });
    // console.log(44444 , "response", res);
    return res.status(200).send({ homepage });
  } catch (error) {
    // console.log("OH NO AN ERROR", error.message);
    // console.log("WHAT HAPPENED?", error.response.data);
    res.send(error);
  }
});

app.post("/homepages/:id", authMiddleWare, async (req, res) => {
  try {
    // console.log(1111111111, "response.user", req.user);
    // accessing user that was added to req by the auth middleware
    const user = req.user;
    // don't send back the password hash
    delete user.dataValues["password"];
    const homepage = await Homepages.findByPk(req.params.id);
    const homepageId = homepage.id;
    if (homepage.userId !== user.id) {
      res
        .status(403)
        .send({ message: "You are not authorized to post on this homepage" });
    }
    // console.log(2222222, " req.body at postAStory", req.body);
    const newStory = await Stories.create({
      ...req.body,
      homepageId,
    });
    // console.log(333333, "newStory", newStory.dataValues);
    res.status(200).send({
      ...newStory.dataValues,
    });
  } catch (error) {
    // console.log("OH NO AN ERROR", error.message);
    // console.log("WHAT HAPPENED?", error.response.data);
    res.send(error);
  }
});

// POST endpoint for testing purposes, can be removed
app.post("/echo", (req, res) => {
  res.status(200).send({
    youPosted: {
      ...req.body,
    },
  });
});

// POST endpoint which requires a token for testing purposes, can be removed
app.post("/authorized_post_request", authMiddleWare, (req, res) => {
  // accessing user that was added to req by the auth middleware
  const user = req.user;
  // don't send back the password hash
  delete user.dataValues["password"];

  res.json({
    youPosted: {
      ...req.body,
    },
    userFoundWithToken: {
      ...user.dataValues,
    },
  });
});

const authRouter = require("./routers/auth");
app.use("/", authRouter);

// Listen for connections on specified port (default is port 4000)
const { PORT } = require("./config/constants");

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
