const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    })
    
    let info = await transporter.sendMail({
      from: `"Learn o Graph | by Shubham " <${process.env.MAIL_USER}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // html body
    })
    console.log("got it")
    
    console.log("info . response :",info.response)
    return info
  } catch (error) {
    console.log("Error while sending OTP: ",error.message)
    return error.message
  }
}

module.exports = mailSender
