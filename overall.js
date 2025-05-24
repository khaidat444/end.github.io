document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (!loggedInUser) {
    window.location.href = 'code.html';
    return;
  }
  document.getElementById('toggleMusicBtn')?.addEventListener('click', toggleMusic);
  updateOverallRanking();
});

function updateOverallRanking() {
  const users = getUsers();
  const rankingList = document.getElementById('overallRankingList');
  rankingList.innerHTML = '';

  const rankedUsers = users
    .map(user => {
      const tiers = [
        ...(user.overall || []),
        ...(user.ltms || []),
        ...(user.vanilla || []),
        ...(user.uhc || []),
        ...(user.crys || []),
        ...(user.ntrp || []),
        ...(user.skywars || []),
        ...(user.bedwars || []),
        ...(user.survivalgames || [])
      ];
      return { username: user.username, tiers: tiers, region: 'NA' };
    })
    .sort((a, b) => b.tiers.length - a.tiers.length);

  rankedUsers.forEach((user, index) => {
    const li = document.createElement('li');
    li.className = 'cursor-pointer';
    li.innerHTML = `
      <span class="rank ${['rank-1', 'rank-2', 'rank-3', 'rank-4'][index] || ''}">${index + 1}.</span>
      <div class="player-info">
        <img src="https://via.placeholder.com/32" alt="${user.username}">
        <span class="ml-2">${user.username} <span class="text-yellow-400">Overall Master (${user.tiers.length * 100} points)</span></span>
      </div>
      <span class="region ${user.region === 'NA' ? 'text-red-400' : 'text-green-400'}">${user.region}</span>
    `;
    li.addEventListener('click', () => showPlayerDetail(user.username, user.tiers, user.region, index));
    rankingList.appendChild(li);
  });
}

function showPlayerDetail(username, tiers, region, index) {
  const modal = document.getElementById('playerDetailModal');
  if (!modal) {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'playerDetailModal';
    modalDiv.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center hidden transition-opacity duration-500';
    modalDiv.innerHTML = `
      <div class="relative z-20 w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-2xl backdrop-blur-lg border border-gray-700 transform transition-all duration-500 scale-95 hover:scale-100">
        <h2 id="playerDetailTitle" class="text-xl font-bold text-gray-200 mb-4"></h2>
        <div id="playerDetailContent" class="text-gray-300"></div>
        <button onclick="hidePlayerDetailModal()" class="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-200 font-semibold">Close</button>
      </div>
    `;
    document.body.appendChild(modalDiv);
  }
  const title = document.getElementById('playerDetailTitle');
  const content = document.getElementById('playerDetailContent');

  title.textContent = `${username}`;
  content.innerHTML = `
    <p>Position: ${index + 1}. Overall (${tiers.length * 100} points)</p>
    <p>Region: ${region}</p>
    <p>Tiers: ${tiers.map(tier => getTierEmoji(tier)).join(' ')}</p>
  `;
  document.getElementById('playerDetailModal').classList.remove('hidden');
}

function hidePlayerDetailModal() {
  const modal = document.getElementById('playerDetailModal');
  if (modal) modal.classList.add('hidden');
}

function getTierEmoji(tier) {
  const tierEmojis = {
    'HT1': '🏆',
    'HT2': '🎖️',
    'HT3': '🔹',
    'LT1': '❇️',
    'LT2': '✨',
    'LT3': '🌟'
  };
  return tierEmojis[tier] || tier;
}

function toggleMusic() {
  const audio = document.getElementById('backgroundMusic');
  if (audio.paused) {
    audio.play();
    document.getElementById('toggleMusicBtn').textContent = 'Pause Music';
  } else {
    audio.pause();
    document.getElementById('toggleMusicBtn').textContent = 'Play Music';
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}