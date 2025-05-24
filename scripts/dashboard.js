document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (!loggedInUser) {
    window.location.href = 'code.html';
    return;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  const homeBtn = document.getElementById('homeBtn');
  const rankingsBtn = document.getElementById('rankingsBtn');
  const discordsBtn = document.getElementById('discordsBtn');
  const searchBtn = document.getElementById('searchBtn');
  const toggleThemeBtn = document.getElementById('toggleThemeBtn');
  const toggleMusicBtn = document.getElementById('toggleMusicBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('loggedInUser');
      window.location.href = 'code.html';
    });
  }

  if (homeBtn) {
    homeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.reload();
    });
  }

  if (rankingsBtn) {
    rankingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateOverallRanking();
      document.getElementById('overallSection').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (discordsBtn) {
    discordsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = discordsBtn.getAttribute('href');
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const searchInput = document.getElementById('searchInput').value.toLowerCase();
      const users = getUsers();
      const filteredUsers = users.filter(user => user.username.toLowerCase().includes(searchInput));
      updateOverallRanking(filteredUsers);
    });
  }

  if (toggleThemeBtn) {
    toggleThemeBtn.addEventListener('click', toggleTheme);
  }

  if (toggleMusicBtn) {
    toggleMusicBtn.addEventListener('click', toggleMusic);
  }

  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  updateOverallRanking();
  updateCustomRanks();
  updateTopPlayer();
  loadSections();
});

function updateOverallRanking(filteredUsers = null) {
  const users = filteredUsers || getUsers();
  const rankingList = document.getElementById('overallRankingList');
  rankingList.innerHTML = '';

  const rankedUsers = users
    .map(user => {
      const allTiers = [
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
      const points = calculatePoints(allTiers);
      return {
        username: user.username,
        tiers: allTiers,
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

function updateTopPlayer() {
  const users = getUsers();
  const rankedUsers = users
    .map(user => {
      const allTiers = [
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
      const points = calculatePoints(allTiers);
      return {
        username: user.username,
        points: points,
        image: user.image || 'https://via.placeholder.com/32',
        characterName: user.characterName || user.username
      };
    })
    .sort((a, b) => b.points - a.points);

  const topPlayer = rankedUsers[0];
  const topPlayerContent = document.getElementById('topPlayerContent');
  if (topPlayer) {
    topPlayerContent.innerHTML = `
      <div class="flex items-center space-x-3">
        <img src="${topPlayer.image}" alt="${topPlayer.characterName}" class="w-12 h-12 rounded-full border-2 border-yellow-400">
        <div>
          <p class="text-lg font-semibold">${topPlayer.characterName} (${topPlayer.username})</p>
          <p class="text-yellow-400">${topPlayer.points} points</p>
        </div>
      </div>
    `;
  } else {
    topPlayerContent.innerHTML = '<p>No players yet.</p>';
  }
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

function updateCustomRanks() {
  const customRanks = JSON.parse(localStorage.getItem('customRanks') || '[]');
  const customRanksList = document.getElementById('customRanksList');
  customRanksList.innerHTML = '';
  customRanks.forEach(rank => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="flex items-center space-x-2">
        <img src="${rank.image}" alt="${rank.characterName}" class="w-6 h-6 rounded-full">
        <span>${rank.characterName} - ${rank.category}: ${rank.tier} (${getTierEmoji(rank.tier)}) - ${calculatePoints([rank.tier])} points</span>
      </div>
    `;
    customRanksList.appendChild(li);
  });
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

function showAddModal(section) {
  const modal = document.getElementById('addModal');
  const modalTitle = document.getElementById('modalTitle');
  modalTitle.textContent = `Add ${section.charAt(0).toUpperCase() + section.slice(1)}`;
  document.getElementById('addModal').classList.remove('hidden');
}

function hideAddModal() {
  document.getElementById('addModal').classList.add('hidden');
}

function handleAddItem() {
  const section = document.getElementById('modalTitle').textContent.replace('Add ', '').toLowerCase();
  const input = document.getElementById('addInput').value;
  const list = document.getElementById(`${section}List`);
  const li = document.createElement('li');
  li.textContent = input;
  list.appendChild(li);
  hideAddModal();
}

function showAddRankModal() {
  document.getElementById('addRankModal').classList.remove('hidden');
}

function hideAddRankModal() {
  document.getElementById('addRankModal').classList.add('hidden');
}

function handleAddRank() {
  const tier = document.getElementById('rankTier').value;
  const category = document.getElementById('rankCategory').value;
  const image = document.getElementById('rankImage').value;
  const characterName = document.getElementById('characterName').value;
  const user = getUsers().find(u => u.username === localStorage.getItem('loggedInUser'));

  if (user) {
    user[category] = user[category] || [];
    if (!user[category].includes(tier)) {
      user[category].push(tier);
      user.image = image;
      user.characterName = characterName;
      localStorage.setItem('users', JSON.stringify(getUsers()));
    }
  }

  const customRanks = JSON.parse(localStorage.getItem('customRanks') || '[]');
  customRanks.push({ category, tier, image, characterName });
  localStorage.setItem('customRanks', JSON.stringify(customRanks));
  updateCustomRanks();
  hideAddRankModal();
  updateOverallRanking();
  updateTopPlayer();
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

function toggleTheme() {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    document.body.style.background = 'linear-gradient(to bottom right, #1a1a1a, #0d0d0d)';
    document.body.style.color = '#e0e0e0';
  } else {
    document.body.style.background = 'linear-gradient(to bottom right, #f0f0f0, #d0d0d0)';
    document.body.style.color = '#333';
  }
}

function toggleMusic() {
  const iframe = document.querySelector('iframe');
  if (iframe.style.opacity === '0') {
    iframe.style.opacity = '1';
    iframe.src += '&mute=0';
    toggleMusicBtn.textContent = 'Pause Music';
  } else {
    iframe.style.opacity = '0';
    iframe.src += '&mute=1';
    toggleMusicBtn.textContent = 'Play Music';
  }
}

function loadSections() {
  const sections = document.querySelectorAll('[data-section]');
  sections.forEach(section => {
    const sectionId = section.getAttribute('data-section');
    if (sectionId === 'overall') updateOverallRanking();
    else if (sectionId === 'add-rank') updateCustomRanks();
  });
}

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}