var mailer = require('./mailer');

mailer.send({
  email: 'hrafne@gmail.com',
  subject: 'Ný fasteign á mbl.is: Huldubraut 10, 200 Kópavogi',
  estate: {
    url: 'http://www.dv.is',
    title: 'Huldubraut 10, 200 Kópavogi',
    Verð: '29.000.000 kr.'
  }
}, function (success, err) {
  if (!success) {
    console.log('> ERROR: could not send email because of: ' + err);
  } else {
    console.log('> email successfully sent.');
  }
});