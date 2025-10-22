
const SUPABASE_URL = 'https://mckyzafuxuutdpmhztco.supabase.co';
 const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ja3l6YWZ1eHV1dGRwbWh6dGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDY1MjcsImV4cCI6MjA3NjYyMjUyN30.OCWAs2qqKkH3Sc-ZXI_SMHnbwKU5zp3M3h-bSFhKMRM';

 const { createClient } = supabase;
 const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

 let currentUser = null;
 let tasks = [];

 // Check authentication
 async function checkAuth() {
   const { data: { user } } = await supabaseClient.auth.getUser();
   
   if (!user) {
     window.location.href = 'index.html';
     return;
   }

   currentUser = user;
   document.getElementById('userEmail').textContent = user.email;
   document.getElementById('userAvatar').textContent = user.email[0].toUpperCase();
   
   loadTasks();
 }

 // Load tasks from database
 async function loadTasks() {
   const { data, error } = await supabaseClient
     .from('tasks')
     .select('*')
     .eq('user_id', currentUser.id)
     .order('created_at', { ascending: false });

   if (error) {
     console.error('Error loading tasks:', error);
     return;
   }

   tasks = data || [];
   renderTasks();
   updateStats();
 }

 // Render tasks
 function renderTasks() {
   const taskList = document.getElementById('taskList');
   
   if (tasks.length === 0) {
     taskList.innerHTML = `
       <div class="empty-state">
         <div class="empty-state-icon">📝</div>
         <p>Belum ada tugas. Tambahkan tugas pertama Anda!</p>
       </div>
     `;
     return;
   }

   taskList.innerHTML = tasks.map(task => `
     <li class="task-item">
       <input type="checkbox" class="task-checkbox" 
         ${task.completed ? 'checked' : ''} 
         onchange="toggleTask(${task.id}, this.checked)">
       <span class="task-text ${task.completed ? 'completed' : ''}">${task.title}</span>
       <span class="task-date">${new Date(task.created_at).toLocaleDateString('id-ID')}</span>
       <button class="btn-delete" onclick="deleteTask(${task.id})">Hapus</button>
     </li>
   `).join('');
 }

 // Update statistics
 function updateStats() {
   document.getElementById('totalTasks').textContent = tasks.length;
   document.getElementById('completedTasks').textContent = tasks.filter(t => t.completed).length;
   document.getElementById('pendingTasks').textContent = tasks.filter(t => !t.completed).length;
 }

 // Add task
 document.getElementById('addTaskBtn').addEventListener('click', async () => {
   const input = document.getElementById('taskInput');
   const title = input.value.trim();

   if (!title) return;

   const { data, error } = await supabaseClient
     .from('tasks')
     .insert([
       { 
         title, 
         user_id: currentUser.id,
         completed: false
       }
     ])
     .select();

   if (error) {
     alert('Gagal menambah tugas: ' + error.message);
     return;
   }

   input.value = '';
   loadTasks();
 });

 // Toggle task completion
 window.toggleTask = async function(taskId, completed) {
   const { error } = await supabaseClient
     .from('tasks')
     .update({ completed })
     .eq('id', taskId);

   if (error) {
     alert('Gagal mengupdate tugas');
     return;
   }

   loadTasks();
 };

 // Delete task
 window.deleteTask = async function(taskId) {
   if (!confirm('Hapus tugas ini?')) return;

   const { error } = await supabaseClient
     .from('tasks')
     .delete()
     .eq('id', taskId);

   if (error) {
     alert('Gagal menghapus tugas');
     return;
   }

   loadTasks();
 };

 // Logout
 document.getElementById('logoutBtn').addEventListener('click', async () => {
   await supabaseClient.auth.signOut();
   localStorage.removeItem('sb-user');
   window.location.href = 'index.html';
 });

 // Enter key to add task
 document.getElementById('taskInput').addEventListener('keypress', (e) => {
   if (e.key === 'Enter') {
     document.getElementById('addTaskBtn').click();
   }
 });

 // Initialize
 checkAuth();