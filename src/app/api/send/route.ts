const nodemailer = require("nodemailer");

const questions = [
  "What type of property are you selling?",
  "How much do you think it is worth?",
  "How soon are you looking to sell?",
  "How many bedrooms are in the home?",
  "How many bathrooms are in the home?",
  "Would you link to receive a no-obligation offer for your home?",
];

export async function POST(req: Request) {
  if (req.method === "POST") {
    const { data } = await req.json();
    const name = data.contact.firstname + " " + data.contact.lastname;
    const { phone, email, description } = data.contact;
    const value = data.value;

    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "nick.tisdale.it@gmail.com", // replace with your email
          pass: "talf idyk pzjq lubu", // replace with your password
        },
      });

      let from = `"${name}" <${email}>`;
      let html = `<div>
        <div>You have a new contact form submission</div><br/><br/>
        <div>Name: ${name}</div>
        <div>Phone: ${phone}</div>
        <div>Email: ${email}</div>
        <div>Description: ${description}</div>
        <div>${questions[0]}: ${value[0]}</div>
        <div>${questions[1]}: ${value[1]}</div>
        <div>${questions[2]}: ${value[2]}</div>
        <div>${questions[3]}: ${value[3]}</div>
        <div>${questions[4]}: ${value[4]}</div>
        <div>${questions[5]}: ${value[5]}</div>
      </div>`;

      let info = await transporter.sendMail({
        from: from,
        to: "admin@tisdalefamilyinvestments.com",
        subject: "Tisdale Family Investments",
        text: "New Customer Arrived",
        html: html,
      });

      console.log(info);
      console.log("Message sent: %s", info.messageId);
      return new Response(JSON.stringify("success"), {
        status: 200,
      });
    } catch (err: any) {
      console.log(err);
      return new Response(JSON.stringify(err), { status: 500 });
    }
  } else {
    return new Response("Method Not Allowed", {
      headers: { Allow: "POST" },
      status: 405,
    });
  }
}
