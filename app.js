// // Ambil URL dan anon key dari Supabase dashboard
// const SUPABASE_URL = 'https://mkyzafuxxudpmhtzco.supabase.co';  // Ganti kalau beda
// const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1reXphZnV4eHVkcG1odHpjbyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzI5NjU2MjAwLCJleHAiOjIwNDUyMzQyMDB9.-wL5ZfZ0ZfZ0ZfZ0ZfZ0ZfZ0ZfZ0ZfZ0ZfZ0';  // Anon key-mu

// // Inisialisasi BENAR: Destructure createClient dari supabase global
// const { createClient } = supabase;
// const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// // Ganti 'supabase' di seluruh kode jadi 'supabaseClient' biar gak konflik
// // (Atau rename ke supabase kalau mau, tapi hati-hati)

// // Login
// document.getElementById('login').addEventListener('click', async () => {
//   const email = document.getElementById('email').value;
//   const password = document.getElementById('password').value;

//   const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
//   if (error) {
//     alert('Login gagal: ' + error.message);
//   } else {
//     localStorage.setItem('sb-jwt', data.session.access_token);  // Simpan token
//     window.location.href = 'dashboard.html';
//   }
// });

// // Register
// document.getElementById('register').addEventListener('click', async () => {
//   const email = document.getElementById('email').value;
//   const password = document.getElementById('password').value;

//   const { error } = await supabaseClient.auth.signUp({ email, password });
//   if (error) {
//     alert('Registrasi gagal: ' + error.message);
//   } else {
//     alert('Registrasi berhasil! Cek email konfirmasi Anda.');
//   }
// });