function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function getCustomRanks() {
  return JSON.parse(localStorage.getItem('customRanks') || '[]');
}

function saveCustomRanks(ranks) {
  localStorage.setItem('customRanks', JSON.stringify(ranks));
}

function getLoggedInUser() {
  return localStorage.getItem('loggedInUser');
}

function setLoggedInUser(username) {
  localStorage.setItem('loggedInUser', username);
}

function clearLoggedInUser() {
  localStorage.removeItem('loggedInUser');
}