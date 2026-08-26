// UI – kliknięcie maila
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
        };
        list.appendChild(li);
    }
}

// UI – przełączanie widoków
document.getElementById("composeBtn").onclick = () => {
    document.getElementById("composer").style.display = "block";
    document.getElementById("mailView").style.display = "none";
};

document.getElementById("loadMessages").onclick = async () => {
    const res = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20",
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const data = await res.json();
    renderMailList(data.messages || []);
    document.getElementById("composer").style.display = "none";
    document.getElementById("mailView").style.display = "block";
};
