

const mailer = require("nodemailer");

// Use Smtp Protocol to send Email

exports.mail_send = async (resgisteration_no, toEmail, subject, text, html) => {
    try {
        return new Promise((resolve, reject) => {
            var smtpTransport = mailer.createTransport({
                service: "Gmail",
                port: 568,
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: 'xovhmxscjyplcozf'
                }
            });
            var mail = {
                from: process.env.MAIL_USERNAME,
                to: toEmail,
                subject: subject,
                text: text,
                html: registrationTemplate(resgisteration_no, html)
            }
            console.log(mail.to, "email");
            smtpTransport.sendMail(mail, function (error, response) {
                if (error) {
                    console.log(error);
                    reject(error)
                } else {
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


exports.centerMailSend = async (center, email, subject, text, html) => {
    try {
        return new Promise((resolve, reject) => {
            var smtpTransport = mailer.createTransport({
                service: "Gmail",
                port: 568,
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: 'xovhmxscjyplcozf'
                }
            });
            var mail = {
                from: process.env.MAIL_USERNAME,
                to: email,
                subject: subject,
                text: text,
                html: html
            }
            console.log(mail.to, "email");
            smtpTransport.sendMail(mail, function (error, response) {
                if (error) {
                    console.log(error);
                    reject(error)
                } else {
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



exports.centerUpdateMailSend = async (center, email, subject, text, html) => {
    try {
        return new Promise((resolve, reject) => {
            var smtpTransport = mailer.createTransport({
                service: "Gmail",
                port: 568,
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: 'xovhmxscjyplcozf'
                }
            });
            var mail = {
                from: process.env.MAIL_USERNAME,
                to: email,
                subject: subject,
                text: text,
                html: updateCenterTemaplate(html)
            }
            console.log(mail.to, "email");
            smtpTransport.sendMail(mail, function (error, response) {
                if (error) {
                    console.log(error);
                    reject(error)
                } else {
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



exports.userEnquiryMail = async (name, email, subject, text, html) => {
    try {
        return new Promise((resolve, reject) => {
            var smtpTransport = mailer.createTransport({
                service: "Gmail",
                port: 568,
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: 'xovhmxscjyplcozf'
                }
            });
            var mail = {
                from: process.env.MAIL_USERNAME,
                to: email,
                subject: subject,
                text: text,
                html: html
            }
            console.log(mail.to, "email");
            console.log("send-mail>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

            smtpTransport.sendMail(mail, function (error, response) {
                if (error) {
                    console.log(error);
                    reject(error)
                } else {
                    console.log("Message sent: " + response);
                    resolve(true)
                }
                smtpTransport.close();
            });
        })
    } catch (error) {
        reject(error)
    }
}



function updateCenterTemaplate(message) {
    return `<html xmlns="http://www.w3.org/1999/xhtml">
      <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

          <style>
      /* Reset styles */ 
      body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}
      body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }
      img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      #outlook a { padding: 0; }
      .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
      
      /* Rounded corners for advanced mail clients only */ 
      @media all and (min-width: 560px) {
          .container { border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; -khtml-border-radius: 8px;}
      }
      
      a, a:hover {
          color: #127DB3;
      }
      .footer a, .footer a:hover {
          color: #999999;
      }
      
      .table-body th, td {
        border: 1px solid black;
        border-collapse: collapse;
      }
      table {
          width:100%;
      }

      .card {
        box-shadow: 0 0 29px 0 rgb(54 54 54 / 12%);
        padding: 10px;
        width: 52%;
      }
           </style>
      
      </head>
      
      
      <body >
      
      <table >
      
      <table width="100%">
      
          <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
                  padding-top: 20px;
                  padding-bottom: 20px;">

                
      
                  <a target="_blank" style="text-decoration: none;"
                      href="https://github.com/konsav/email-templates/"><img border="0" vspace="0" hspace="0"
                      src="http://3.6.57.135:8444/img/logo.png"
                      width="100" height="30"
                      alt="Logo" title="Logo" style="
                      color: #000000;
                      font-size: 10px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;" /></a>
      
              </td>
          </tr>
      
      </table>
      
      
      <table class="table-body" border="0" cellpadding="0" cellspacing="0" align="center"
          bgcolor="#FFFFFF"
          width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
          max-width: 560px;" class="container">
      
          
          <tr>
              <td valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 20px;
                  padding-top: 25px; 
                  color: #000000;
                  font-family: sans-serif;border: 2px solid #ddd;" class="paragraph">
                      <p style="line-height: 30px;">
                        ${message}
                      </p>
                      <p style="line-height: 30px;">
                      In case of any discrepancy you can contact us at:
                         </p>
                          <p style="line-height: 30px;">
                         Email:
                          </p>
                          <p style="line-height: 30px;">
      Phone Number:
        </p>
       <p style="line-height: 30px;">
      Thank you
        </p>
         <p style="line-height: 30px;">
      Team Bookcare
        </p>
              </td>
          </tr>
      
      
        
      
      
      
      </table>
      
      
                  </table>
              </td>
          </tr>
      
      
      </table>
      
      </td></tr></table>
      
      </body>
      </html>`
}


function registrationTemplate(resgisteration_no, message) {
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
        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> Bookcare </div>
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
                    <p style="margin: 0;">Dear Customer,</p>
                </td>
            </tr> 
                        <tr>
                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            ${message}
                            </td>
                        </tr>
                        <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 1px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        Registeration number: (${resgisteration_no})</td>
                        </tr>
                        <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 1px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        Thank you,</td>
                        </tr>
                        <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 22px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        Team Bookcare</td>
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
