// ===============================
// LISTA MAILI
// ===============================
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

            // przełącz widok na treść maila
            document.getElementById("composer").style.display = "none";
            document.getElementById("mailView").style.display = "block";
        };

        list.appendChild(li);
    }
}

// ===============================
// PRZEŁĄCZANIE WIDOKÓW
// ===============================

// przycisk "Napisz"
document.getElementById("composeBtn").onclick = () => {
    document.getElementById("composer").style.display = "block";
    document.getElementById("mailView").style.display = "none";
};

// przycisk "Odebrane"
document.getElementById("loadMessages").onclick = async () => {
    if (!accessToken) {
        output("Najpierw połącz z Gmailem!");
        return;
    }

    const res = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20",
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const data = await res.json();

    renderMailList(data.messages || []);

    // przełącz widok na listę maili
    document.getElementById("composer").style.display = "none";
    document.getElementById("mailView").style.display = "block";
};
