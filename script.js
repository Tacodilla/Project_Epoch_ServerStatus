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

// Poll Logic With Results
function setupPoll(pollId, storageKey, options) {
  const poll = document.getElementById(pollId);
  const voted = localStorage.getItem(storageKey);

  // Load existing vote counts from localStorage
  let votes = JSON.parse(localStorage.getItem(`${storageKey}-votes`)) || {};
  options.forEach(opt => votes[opt] = votes[opt] || 0);

  const renderResults = () => {
    poll.innerHTML = '';
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0) || 1;

    options.forEach(opt => {
      const percent = Math.round((votes[opt] / totalVotes) * 100);
      poll.innerHTML += `
        <div>
          <strong>${opt} (${votes[opt]} votes - ${percent}%)</strong>
          <div class="result-bar">
            <div class="result-fill" style="width:${percent}%">${percent}%</div>
          </div>
        </div>
      `;
    });
  };

  if (voted) {
    renderResults();
    return;
  }

  poll.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      votes[opt]++;
      localStorage.setItem(storageKey, opt);
      localStorage.setItem(`${storageKey}-votes`, JSON.stringify(votes));
      renderResults();
    });
    poll.appendChild(btn);
  });
}

// Setup both polls
setupPoll("class-poll", "poll-class", ["Warrior", "Mage", "Rogue", "Priest"]);
setupPoll("role-poll", "poll-role", ["Tank", "Healer", "DPS"]);
