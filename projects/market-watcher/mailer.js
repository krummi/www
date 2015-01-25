var path = require('path');
var emailTemplates = require('email-templates');
var nodemailer = require('nodemailer');

// Configuration
var templatesDir = path.resolve(__dirname, 'templates');
  
/**
 * What `locals` needs to contain:
 *
 *   email: the email of the recipient.
 *   subject: the subject of the email.
 *
 * Plus data for the template!
 */
exports.send = function (locals, callback) {
  if (!callback) {
    throw new Error('No callback defined');
  }

  emailTemplates(templatesDir, function (err, template) {
    if (err) {
      return callback(false, err);
    }

    // For a single email send.
    template('ink', locals, function (err, html, text) {
      if (err) {
        return callback(false, err);
      }

      // Configure the SMTP transport.
      var transport = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
          user: "verdvaktin1@gmail.com",
          pass: "hanikrummi"
        }
      });

      // Send the email.
      transport.sendMail({
        from: 'Verðvaktin <verdvaktin1@gmail.com>',
        to: locals.email,
        subject: locals.subject,
        html: html,
        // generateTextFromHTML: true,
        text: text
      }, function (err, responseStatus) {
        // Closes the transport and returns.
        transport.close();
        
        if (err) {
          return callback(false, err);
        }
        return callback(true, null);
      });
    });
  });
};