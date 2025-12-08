const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendWelcomeEmail(email, firstName) {
  try {
    const msg = {
      to: email,
      from: "farmchaininfo@gmail.com",
      templateId: process.env.WELCOME_TEMPLATE_ID,
      dynamic_template_data: {
        first_name: firstName,
        email: email
      },
    };

    await sgMail.send(msg);
    console.log("Welcome email sent!");
  } catch (error) {
    console.error("Error sending welcome email:", error);

    if (error.response?.body) {
      console.error(error.response.body);
    }
  }
}

module.exports = {sendWelcomeEmail};
