document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (!loggedInUser) {
    window.location.href = 'code.html';
    return;
  }
  document.getElementById('toggleMusicBtn')?.addEventListener('click', toggleMusic);
  updateUHCRanking();
});

function updateUHCRanking() {
  const users = getUsers();
  const rankingList = document.getElementById('uhcRankingList');
  rankingList.innerHTML = '';

  const rankedUsers = users
    .filter(user => user.uhc && user.uhc.length > 0)
    .map(user => {
      return { username: user.username, tiers: user.uhc, region: 'NA' };
    })
    .sort((a, b) => b.tiers.length - a.tiers.length);

  rankedUsers.forEach((user, index) => {
    const li = document.createElement('li');
    li.className = 'cursor-pointer';
    li.innerHTML = `
      <span class="rank ${['rank-1', 'rank-2', 'rank-3', 'rank-4'][index] || ''}">${index + 1}.</span>
      <div class="player-info">
        <img src="https://via.placeholder.com/32" alt="${user.username}">
        <span class="ml-2">${user.username} <span class="text-yellow-400">Combat Master (${user.tiers.length * 100} points)</span></span>
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
    modalDiv.className