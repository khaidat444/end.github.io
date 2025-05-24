document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (!loggedInUser) {
    window.location.href = 'code.html';
    return;
  }
  document.getElementById('toggleMusicBtn')?.addEventListener('click', toggleMusic);
  updateNtrpRanking();
});

function updateNtrpRanking() {
  const users = getUsers();
  const rankingList = document.getElementById('ntrpRankingList');
  rankingList.innerHTML = '';

  const rankedUsers = users
    .map(user => {
      const tiers = user.ntrp || [];
      const points = calculatePoints(tiers);
      return {
        username: user.username,
        tiers: tiers,
        points: points,
        region: 'NA',
        image: user.image || 'https://via.placeholder.com/32',
        characterName: user.characterName || user.username
      };
    })
    .sort((a, b) => b.points - a.points);

  rankedUsers.forEach((user, index) => {
    const li = document.createElement('li');
    li.className = `cursor-pointer flex items-center space-x-2 ${index === 0 ? 'border-2 border-yellow-400 p-2 rounded-lg bg-gray-700' : ''}`;
    li.innerHTML = `
      <span class="rank ${['rank-1', 'rank-2', 'rank-3', 'rank-4'][index] || ''}">${index + 1}.</span>
      <div class="player-info flex items-center">
        <img src="${user.image}" alt="${user.characterName}" class="w-8 h-8 rounded-full">
        <span class="ml-2">${user.characterName} (${user.username}) <span class="text-yellow-400">${user.points} points</span></span>
      </div>
      <span class="region ${user.region === 'NA' ? 'text-red-400' : 'text-green-400'}">${user.region}</span>
    `;
    li.addEventListener('click', () => showPlayerDetail(user.username, user.tiers, user.region, user.points, user.image, user.characterName, index));
    rankingList.appendChild(li);
  });
}

function calculatePoints(tiers) {
  const pointValues = {
    'HT1': 1000,
    'HT2': 800,
    'HT3': 600,
    'LT1': 400,
    'LT2': 200,
    'LT3': 100
  };
  return tiers.reduce((total, tier) => total + (pointValues[tier] || 0), 0);
}

function showPlayerDetail(username, tiers, region, points, image, characterName, index) {
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

  title.textContent = `${characterName} (${username})`;
  content.innerHTML = `
    <div class="flex items-center space-x-3 mb-4">
      <img src="${image}" alt="${characterName}" class="w-12 h-12 rounded-full">
      <div>
        <p>Position: ${index + 1}</p>
        <p>Total Points: ${points}</p>
        <p>Region: ${region}</p>
      </div>
    </div>
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
  const iframe = document.querySelector('iframe');
  if (iframe.style.opacity === '0') {
    iframe.style.opacity = '1';
    iframe.src += '&mute=0';
    document.getElementById('toggleMusicBtn')?.textContent = 'Pause Music';
  } else {
    iframe.style.opacity = '0';
    iframe.src += '&mute=1';
    document.getElementById('toggleMusicBtn')?.textContent = 'Play Music';
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}