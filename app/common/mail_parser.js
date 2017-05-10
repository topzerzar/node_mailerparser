'use strict';

const util = require('util');
const fs = require('fs');
const MailParser = require('../lib/mail-parser.js');
const nodemailer = require('nodemailer');


let parser = new MailParser();
let input = fs.createReadStream(__dirname + '/file/...');

let attachments = [];

let bodyMail = {
  text: 'default text',
  html: 'default html',
};

input.pipe(parser);

parser.on('headers', headers => {
    console.log('header : ------> ' , headers);
    console.log(util.inspect(headers, false, 22));
});

parser.on('data', data => {
    if (data.type === 'text') {
        Object.keys(data).forEach(key => {
            console.log(key);
            bodyMail.key = data[key];
            console.log('----');
            console.log(data[key]);
            if(key === 'textAsHtml') {
              bodyMail.html = data[key];
            } else if (key === 'text') {
              bodyMail.text = data[key];
            }
        });
    }

    if (data.type === 'attachment') {
        attachments.push(data);
        data.chunks = [];
        data.chunklen = 0;
        let size = 0;
        Object.keys(data).forEach(key => {
            if (typeof data[key] !== 'object' && typeof data[key] !== 'function') {
                console.log('%s: %s', key, JSON.stringify(data[key]));
            }
        });
        data.content.on('readable', () => {
            let chunk;
            while ((chunk = data.content.read()) !== null) {
                size += chunk.length;
                data.chunks.push(chunk);
                data.chunklen += chunk.length;
            }
        });

        data.content.on('end', () => {
            data.buf = Buffer.concat(data.chunks, data.chunklen);
            console.log('%s: %s B', 'size', size);
            // attachment needs to be released before next chunk of
            // message data can be processed
            data.release();
        });
    }
});

parser.on('end', () => {
    console.log('READY');

    parser.updateImageLinks((attachment, done) => done(false, 'data:' + attachment.contentType + ';base64,' + attachment.buf.toString('base64')), (err, html) => {
        if (err) {
            console.log(err);
        }
        if (html) {
            console.log(html);
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '..',
                    pass: '..'
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Fred Foo 👻" <top.collection.it@gmail.com>', // sender address
                to: 'panacholn@gmail.com,top.collection.it@gmail.com', // list of receivers
                subject: 'Hello ✔', // Subject line
                html: html // html body
            };

            // let message = {
            //     envelope: {
            //         from: '"Portfolio.tech" <top.collection.it@gmail.com>',
            //         to: ['top.collection.it@gmail.com']
            //     },
            //     raw: {
            //         path: './file/1489499647.Vfd00I804f0M734963.jobthai-mail01',
            //     }
            // };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        }
    });
});
