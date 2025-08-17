const statusEl = document.getElementById("status");
const timeEl = document.getElementById("timestamp");

async function checkServer() {
  statusEl.className = "status checking";
  statusEl.textContent = "Checking...";

  try {
    const res = await fetch("https://api.mcsrvstat.us/2/162.19.28.88:3724");
    const data = await res.json();

    if (data.online || data.debug?.ping) {
      statusEl.className = "status online";
      statusEl.textContent = "✅ Server ONLINE";
    } else {
      throw new Error();
    }
  } catch {
    statusEl.className = "status offline";
    statusEl.textContent = "❌ Server OFFLINE";
  }

  timeEl.textContent = new Date().toLocaleTimeString();
}

setInterval(checkServer, 10000);
checkServer();
