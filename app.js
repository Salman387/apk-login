
// Konfigurasi Supabase
const SUPABASE_URL = 'https://mckyzafuxuutdpmhztco.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ja3l6YWZ1eHV1dGRwbWh6dGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDY1MjcsImV4cCI6MjA3NjYyMjUyN30.OCWAs2qqKkH3Sc-ZXI_SMHnbwKU5zp3M3h-bSFhKMRM';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

let currentMode = 'login';

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.tab;
    document.getElementById('btnText').textContent = currentMode === 'login' ? 'Login' : 'Daftar';
    hideAlert();
  });
});

// Form submission
document.getElementById('authForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');

  if (password.length < 6) {
    showAlert('Password minimal 6 karakter', 'error');
    return;
  }

  submitBtn.disabled = true;
  btnText.innerHTML = '<span class="loading"></span>Memproses...';

  try {
    if (currentMode === 'login') {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) throw error;

      showAlert('Login berhasil! Mengalihkan...', 'success');
      localStorage.setItem('sb-user', JSON.stringify(data.user));
      
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);

    } else {
      const { data, error } = await supabaseClient.auth.signUp({ 
        email, 
        password 
      });

      if (error) {
        console.error('Signup Error Details:', error);
        throw error;
      }

      showAlert('Registrasi berhasil! Cek email untuk konfirmasi.', 'success');
      document.getElementById('authForm').reset();
      
      setTimeout(() => {
        document.querySelectorAll('.tab-btn')[0].click();
      }, 2000);
    }
  } catch (error) {
    showAlert(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = currentMode === 'login' ? 'Login' : 'Daftar';
  }
});

function showAlert(message, type) {
  const alertBox = document.getElementById('alertBox');
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type} show`;
}

function hideAlert() {
  document.getElementById('alertBox').className = 'alert';
}

// Auto-hide alerts
setInterval(() => {
  const alertBox = document.getElementById('alertBox');
  if (alertBox.classList.contains('show')) {
    setTimeout(() => hideAlert(), 5000);
  }
}, 100);