require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const twilio = require("twilio");

// const client = new twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_PHONE_NUMBER
// );
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// This is a single page application and it's all rendered in public/index.html
app.use(express.static("public"));
// Parse the body of requests automatically
app.use(express.json());

app.get("/api/compliments", async (req, res) => {
  try {
    const sentMessages = await client.messages.list({
      from: twilioPhoneNumber,
    });
    const compliments = sentMessages.map((message) => message.body);
    res.json(compliments);
    console.log(compliments);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/compliments", async (req, res) => {
  const to = req.body.to;
  const from = process.env.TWILIO_PHONE_NUMBER;
  const body = `${req.body.sender} says: ${req.body.receiver} is ${req.body.compliment}. See more compliments at ${req.headers.referer}`;
  // TODO: Send a message
  await client.messages
    .create({ body, to, from })
    .then(
      res
        .json({ success: true })
        .catch((error) => res.json({ success: false, error }))
    );
});

app.listen(port, () => console.log(`Prototype is listening on port ${port}!`));
