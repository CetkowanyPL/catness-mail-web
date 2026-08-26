let tokenClient;
let accessToken = null;

// ===============================
// START – podpinanie przycisków
// ===============================
window.onload = () => {
    document.getElementById("login").onclick = login;
    document.getElementById("loadMessages").onclick = loadMessagesUI;
    document.getElementById("composeBtn").onclick = showComposer;
    document.getElementById("sendMail").onclick = sendMail;
};

// ===============================
// LOGOWANIE DO GMAILA
// ===============================
function login() {
    console.log("Klik działa!");

    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: "513016207790-4feiarm4a0q8updn6qf8vaitlr1opif4.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.send",
        callback: (response) => {
            accessToken = response.access_token;
            output("Zalogowano! Token pobrany.");
        }
    });

    tokenClient.requestAccessToken();
}

// ===============================
// POBIERANIE LISTY MAILI
// ===============================
async function loadMessages() {
    if (!accessToken) return output("Najpierw połącz z Gmailem!");

    const res = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20",
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return await res.json();
}

// ===============================
// POBIERANIE TREŚCI MAILA
// ===============================
async function loadMessage(id) {
    const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return await res.json();
}

// ===============================
// WYSYŁANIE MAILA
// ===============================
async function sendMail() {
    if (!accessToken) return output("Najpierw połącz z Gmailem!");

    const to = document.getElementById("composeTo").value;
    const subject = document.getElementById("composeSubject").value;
    const body = document.getElementById("composeBody").value;

    const message =
        `From: me\r\n` +
        `To: ${to}\r\n` +
        `Subject: ${subject}\r\n\r\n` +
        `${body}`;

    const encodedMessage = btoa(message)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const res = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ raw: encodedMessage })
        }
    );

    const data = await res.json();
    output(data);
}
document.getElementById("sendStatus").style.display = "block";
setTimeout(() => {
    document.getElementById("sendStatus").style.display = "none";
}, 3000);

// ===============================
// UI – LISTA MAILI
// ===============================
async function loadMessagesUI() {
    const data = await loadMessages();
    renderMailList(data.messages || []);

    document.getElementById("composer").style.display = "none";
    document.getElementById("mailView").style.display = "block";
}

async function renderMailList(messages) {
    const list = document.getElementById("mailList");
    list.innerHTML = "";

    for (const msg of messages) {
        const li = document.createElement("li");
        li.textContent = "Mail ID: " + msg.id;

        li.onclick = async () => {
            const mail = await loadMessage(msg.id);
            document.getElementById("mailContent").textContent =
                JSON.stringify(mail, null, 2);

            document.getElementById("composer").style.display = "none";
            document.getElementById("mailView").style.display = "block";
        };

        list.appendChild(li);
    }
}

// ===============================
// UI – PRZEŁĄCZANIE WIDOKÓW
// ===============================
function showComposer() {
    document.getElementById("composer").style.display = "block";
    document.getElementById("mailView").style.display = "none";
}

// ===============================
// HELPER – WYŚWIETLANIE JSON
// ===============================
function output(obj) {
    document.getElementById("mailContent").textContent =
        typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}
