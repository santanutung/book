var smtpTransport = require('nodemailer-smtp-transport');
// const mailer = require("nodemailer");

// var transport = mailer.createTransport(smtpTransport({
//     pool: true,
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true, // use TLS
//     auth: {
//         user: 'easyeasytolearn70@gmail.com', // my mail
//         pass: 'Viraj@5424'
//     },
//     tls: {
//         // do not fail on invalid certs
//         rejectUnauthorized: false,
//       },
// }));


// transport.sendMail('arr014@arramton.com','testing','ljhhdj','<p>kjhgfdfghj</p>'));

// MAIL_USERNAME=easyeasytolearn70@gmail.com
// MAIL_USERNAMETest=arr014@gmail.com
// MAIL_PASSWORD=Viraj@5424
const mailer = require("nodemailer");
require('dotenv').config()
// Use Smtp Protocol to send Email
let mail_send = async (toEmail,subject,text,html) =>{
  try {
      return new Promise((resolve,reject)=>{
        var smtpTransport = mailer.createTransport({
            service: "Gmail",
            port:465,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: 'xovhmxscjyplcozf'
            }
        });
        var mail = {
            from: process.env.MAIL_USERNAME,
            to:toEmail,
            subject: subject,
            text: text,
            html: html
        }
        console.log(mail.to,"email");
        smtpTransport.sendMail(mail, function(error, response){
            if(error){
                console.log(error);
                reject(error)
            }else{
                console.log("Message sent: " + response.message);
                resolve(true)
            }
            smtpTransport.close();
        });
      })
  } catch (error) {
      reject(error)
  }
}

function registrationTemplate(name, message)
{
    return `<html>

    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        
        <style type="text/css">
            @media screen {
                @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 400;
                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                }
    
                @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 700;
                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                }
    
                @font-face {
                    font-family: 'Lato';
                    font-style: italic;
                    font-weight: 400;
                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                }
    
                @font-face {
                    font-family: 'Lato';
                    font-style: italic;
                    font-weight: 700;
                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                }
            }
    
            /* CLIENT-SPECIFIC STYLES */
            body,
            table,
            td,
            a {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
    
            table,
            td {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
    
            img {
                -ms-interpolation-mode: bicubic;
            }
    
            /* RESET STYLES */
            img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
            }
    
            table {
                border-collapse: collapse !important;
            }
    
            body {
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
            }
    
            /* iOS BLUE LINKS */
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
    
            /* MOBILE STYLES */
            @media screen and (max-width:600px) {
                h1 {
                    font-size: 32px !important;
                    line-height: 32px !important;
                }
            }
    
            /* ANDROID CENTER FIX */
            div[style*="margin: 16px 0;"] {
                margin: 0 !important;
            }
        </style>
    </head>
    
    <body style="background-color: #fffff; margin: 0 !important; padding: 0 !important;">
        <!-- HIDDEN PREHEADER TEXT -->
        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> Bookacre</div>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <!-- LOGO -->
            <tr>
                <td bgcolor="#457b9d" align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td align="center" valign="top" style="padding: 40px 10px 20px 10px;"> 
                                <h1 style="font-size: 48px; font-weight: 400; margin: 2;"><img src=" http://18.209.150.0:8444/img/logo.png" width="200" height="195" style="display: block; border: 0px;" />

                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td bgcolor="#457b9d" align="center" style="padding: 0px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                    <p style="margin: 0;">Dear Customer</p>
                </td>
            </tr> <!-- COPY -->
                        <tr>
                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            ${message}
                            </td>
                        </tr>
                        <tr>
                        <td> Registeration number: (1324)</td>
                        </tr>
                        <tr>
                        <td>  Thank you,</td>
                        </tr>
                        <tr>
                        <td> Team Bookcare</td>
                        </tr>

                  
                   
                       
                       
                    </table>
                </td>
            </tr>
            <tr>
                <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
        </table>
    </body>
    
    </html>`
}

mail_send('arr014@arramton.com','testing','ljhhdj',registrationTemplate('rachna', 'Thank your for register with us.')).then(data=>{
    console.log(data,"data");
}).catch(err=>{
    console.log(err,"err");
})