// storage.js
function saveUser(username, password) {
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  if (!users.find(u => u.username === username)) {
    users.push({ username, password, overall: [], ltms: [], vanilla: [], uhc: [], crys: [], ntrp: [], skywars: [], bedwars: [], survivalgames: [] });
    localStorage.setItem('users', JSON.stringify(users));
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}