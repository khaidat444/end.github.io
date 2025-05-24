document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const confirmRegisterBtn = document.getElementById('confirmRegisterBtn');
  const errorMessage = document.getElementById('errorMessage');
  const toggleMusicBtn = document.getElementById('toggleMusicBtn');

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem('loggedInUser', username);
        window.location.href = 'dashboard.html';
      } else {
        errorMessage.textContent = 'Invalid username or password';
        errorMessage.classList.remove('hidden');
      }
    });
  }

  if (confirmRegisterBtn) {
    confirmRegisterBtn.addEventListener('click', () => {
      const username = document.getElementById('newUsername').value;
      const password = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.classList.remove('hidden');
        return;
      }

      if (!users.find(u => u.username === username)) {
        users.push({ username, password, overall: [], ltms: [], vanilla: [], uhc: [], crys: [], ntrp: [], skywars: [], bedwars: [], survivalgames: [] });
        localStorage.setItem('users', JSON.stringify(users));
        // Hiển thị thông báo thành công
        alert('Đăng ký thành công! Hãy quay về trang login để đăng nhập.');
        // Không chuyển hướng tự động, yêu cầu người dùng quay lại trang đăng nhập
      } else {
        errorMessage.textContent = 'Username already exists';
        errorMessage.classList.remove('hidden');
      }
    });
  }

  if (toggleMusicBtn) {
    toggleMusicBtn.addEventListener('click', toggleMusic);
  }
});

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