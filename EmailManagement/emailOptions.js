const getMailOptions = (emailSender, emailReceiver, subject, template ) =>{
    const mailOptions = {
        from: emailSender,
        to: emailReceiver,
        subject: subject,
        html: template,
    }
    return mailOptions;
}

module.exports = getMailOptions;