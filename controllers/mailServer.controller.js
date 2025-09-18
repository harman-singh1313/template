const Imap = require('imap');   // Imap library
const { simpleParser } = require('mailparser'); // Import simpleParser from mailparser
const nodemailer = require('nodemailer');

let emails_data = [];

// ===============================
// GET ALL MAILS
// ===============================
exports.readmails = (req, res) => {
    const imap = new Imap({
        user: process.env.MAIL_ID,
        password: process.env.MAIL_PASSWORD,
        host: "imap.gmail.com",
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    });

    function inbox(cb) {
        imap.openBox('INBOX', false, cb);
    }

    imap.once("ready", () => {
        inbox((err, box) => {
            if (err) {
                console.error('Open inbox error:', err);
                return res.status(500).send('Unable to open inbox');
            }

            imap.search(["ALL"], (err, results) => {
                if (err) {
                    console.error("❌ IMAP Search Error:", err);
                    imap.end();
                    return res.status(500).send("Unable to fetch emails");
                }

                if (!results || results.length === 0) {
                    console.warn("⚠️ No emails found in mailbox");
                    imap.end();
                    return res.render("pages/email", { emails: [] });
                }

                const ml = 50;
                const last_ml = results.slice(-ml);
                const fetchOpts = { bodies: '', markSeen: false };
                const fe = imap.fetch(last_ml, fetchOpts);

                let emails = [];
                let parsePromises = []; // ✅ CHANGE: collect promises for async parsing

                fe.on("message", (msg) => {
                    let attributes = null;

                    msg.on('attributes', (attr) => {
                        attributes = attr;
                    });

                    msg.on("body", (stream) => {
                        // ✅ CHANGE: wrap simpleParser in Promise
                        const p = new Promise((resolve) => {
                            simpleParser(stream, (err, parsed) => {
                                if (err) {
                                    console.error("Parser error:", err);
                                    return resolve();
                                }
                                const email = {
                                    uid: attributes ? attributes.uid : null,
                                    subject: parsed.subject,
                                    from: parsed.from?.text || "", // ✅ CHANGE: safe optional chaining
                                    text: parsed.text,
                                    date: parsed.date,
                                    messageId: parsed.messageId || null,
                                    inReplyTo: parsed.inReplyTo || null,
                                    references: parsed.references || []
                                };
                                emails.push(email);
                                // console.log("emails",emails)
                                resolve();
                            });
                        });
                        parsePromises.push(p);
                    });
                });

                fe.once("end", async () => {
                    try {
                        await Promise.all(parsePromises); // ✅ CHANGE: wait for parsing to finish
                        emails_data.push(emails);
                        console.log(emails);
                        res.render("pages/email",{ emails });
                    } catch (e) {
                        console.error("❌ Error parsing emails:", e);
                        res.status(500).send("Error parsing emails");
                    } finally {
                        imap.end(); // ✅ CHANGE: always close connection
                    }
                });
            });
        });
    });

    imap.once("error", (err) => { // ✅ CHANGE: handle ECONNRESET and other errors
        console.error("❌ IMAP Error:", err);
        if (!res.headersSent) {
            res.status(500).send("Mail server connection error: " + err.message);
        }
        imap.end();
    });

    imap.connect();

};


// ===============================
// GET SINGLE MAIL FOR READ
// ===============================
exports.read_single_mail = (req, res) => {
    const mailid = req.params.id;

    const imap = new Imap({
        user: process.env.MAIL_ID,
        password: process.env.MAIL_PASSWORD,
        host: "imap.gmail.com",
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
    });

    function inbox(cb) {
        imap.openBox("INBOX", true, cb);
    }

    imap.once("ready", () => {
        inbox((err) => {
            if (err) return res.status(500).send("Inbox error");

            const fd = imap.fetch(mailid, { bodies: "" });

            fd.on("message", (msg) => {
                // ✅ CHANGE: use async/await Promise for simpleParser
                     msg.on('attributes', (attr) => {
                        attributes = attr;
                    });
                msg.on("body", async (stream) => {
                    try {
                        const parsed = await new Promise((resolve, reject) => {
                            simpleParser(stream, (err, parsed) => {
                                if (err) return reject(err);
                                resolve(parsed);
                            });
                        });

                        const mail = {
                            subject: parsed.subject,
                            uid: attributes ? attributes.uid : null,
                            from: parsed.from?.text || "", // ✅ CHANGE: safe optional chaining
                            date: parsed.date,
                            text: parsed.text,
                            html: parsed.html,
                            messageId: parsed.messageId || null,
                            inReplyTo: parsed.inReplyTo || null,
                            references: parsed.references || []
                        };

                        // console.log("single email",mail)
                        res.render("pages/read", {data:mail});
                    } catch (err) {
                        console.error("Parser error:", err);
                        res.status(500).send("Error reading mail");
                    }
                });
            });

            fd.once("end", () => {
                imap.end();
            });
        });
    });

    imap.once("error", (err) => { // ✅ CHANGE: same error handler
        console.error("❌ IMAP Error:", err);
        if (!res.headersSent) {
            res.status(500).send("Mail server connection error: " + err.message);
        }
        imap.end();
    });

    imap.connect();
};

exports.get_reply = async (req, res) => {
  try {
    const paramId = String(req.params.id).replace(/^:/, "");
    // flatten nested array

    const flatMails = emails_data.flat();

    const mail = flatMails.find(
      (x) => String(x.uid) === paramId
    );

    if (!mail) {

      return res.status(404).send("Mail not found");
    }
    res.render('pages/reply',{data:mail})

  } catch (error) {
    console.error("Reply error:", error);
    res.status(500).send("Error in reply");
  }
};



// ===============================
// SEND REPLY
// ===============================
exports.send_reply = async (req, res) => {

    const { to, subject, message } = req.body;

    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,  // ✅ CHANGE: 'password' → 'pass'
            },
              tls: {
    rejectUnauthorized: false, // 👈 self-signed error ignore (dev only)
  },
        });

        let mailoption = {
            from: process.env.SMTP_USER,
            to,
            subject,
            text: message,
        };

        await transporter.sendMail(mailoption);
        res.send("mail send successfully");

    } catch (err) {
        console.error("Send reply error:", err);
        res.status(500).send("Error sending reply");
    }
};
