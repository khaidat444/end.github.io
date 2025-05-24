document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (!loggedInUser) {
    window.location.href = 'code.html';
    return;
  }
  document.getElementById('toggleMusicBtn')?.addEventListener('click', toggleMusic);
  updateSurvivalgamesRanking();
});

function updateSurvivalgamesRanking() {
  const users = getUsers();
  const rankingList = document.getElementById('survivalgamesRankingList');
  rankingList.innerHTML = '';

  const rankedUsers = users
    .map(user => {
      const tiers = user.survivalgames || [];
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