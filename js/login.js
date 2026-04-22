document.addEventListener('DOMContentLoaded', () => {
  const errorMsg = document.getElementById('login-error');

  document.querySelector('.login-btn-submit').addEventListener('click', async () => {
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    errorMsg.textContent = '';

    try {
      const result = await api.login(username, password);

      if (result.success) {
        sessionStorage.setItem('admin', JSON.stringify(result.admin));
        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'admin.html';
      } else {
        errorMsg.textContent = result.message || 'Invalid credentials';
      }

    } catch (err) {
      errorMsg.textContent = 'Connection error';
      console.error(err);
    }
  });
});