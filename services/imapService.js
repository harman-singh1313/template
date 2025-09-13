const Imap = require("imap");
const { simpleParser } = require("mailparser");
const { randomBytes } = require("crypto");

function ticketNo() {
  return "TIK" + randomBytes(4).toString("hex").toUpperCase();
}

function connectIMAP() {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: "harmansingh16852@gmail.com",
      password: "hvfllssgjtoqzphr", // Gmail App Password
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }, // dev only
    });

    imap.once("ready", () => resolve(imap));
    imap.once("error", (err) => reject(err));
    imap.connect();
  });
}

function openInbox(imap) {
  return new Promise((resolve, reject) => {
    imap.openBox("INBOX", false, (err, box) => {
      if (err) reject(err);
      else resolve(box);
    });
  });
}

function fetchEmails(imap, criteria = ["ALL"]) {
  return new Promise((resolve, reject) => {
    imap.search(criteria, (err, results) => {
      if (err) return reject(err);
      if (!results || !results.length) return resolve([]);

      const emails = [];
      const f = imap.fetch(results, { bodies: "", markSeen: true });

      f.on("message", (msg) => {
        msg.on("body", async (stream) => {
          try {
            const parsed = await simpleParser(stream);
            emails.push({
              ticketNo: ticketNo(),
              from: parsed.from?.text || "",
              subject: parsed.subject,
              date: parsed.date,
            });
          } catch (e) {
            console.error("Parse error:", e);
          }
        });
      });

      f.once("error", (err) => reject(err));
      f.once("end", () => resolve(emails));
    });
  });
}

async function readeEmail() {
  try {
    const imap = await connectIMAP();
    await openInbox(imap);
    const emails = await fetchEmails(imap, ["ALL"]); // 👈 pehle ALL rakho test layi
    imap.end();
    return emails;
  } catch (err) {
    console.error("Error in readeEmail:", err?.message || err);
    return [];
  }
}

module.exports = { readeEmail };
