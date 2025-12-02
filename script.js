document.addEventListener('DOMContentLoaded', () => {
    // Greeting Logic
    const greetingElement = document.getElementById('greeting');
    const hour = new Date().getHours();
    let greetingText = 'Good Morning';

    if (hour >= 12 && hour < 17) greetingText = 'Good Afternoon';
    else if (hour >= 17) greetingText = 'Good Evening';

    if (greetingElement) {
        greetingElement.textContent = `${greetingText}, Alex`;
    }

    // Sidebar Toggle (Mobile)
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // View Switching Logic
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    const views = {
        'dashboard': document.getElementById('dashboard-view'),
        'users': document.getElementById('users-view')
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetView = item.dataset.view;

            // Update Nav State
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Update View State
            Object.values(views).forEach(view => {
                if (view) view.style.display = 'none';
            });
            if (views[targetView]) {
                views[targetView].style.display = 'block';

                // Load data if needed
                if (targetView === 'users') {
                    loadUsers();
                }
            }
        });
    });

    // Load Users
    async function loadUsers() {
        const grid = document.getElementById('users-grid');
        if (!grid) return;

        grid.innerHTML = '<div style="color: var(--text-muted);">Loading users...</div>';

        try {
            const response = await fetch('/api/users');
            const users = await response.json();

            grid.innerHTML = '';
            users.forEach((user, index) => {
                const card = document.createElement('div');
                card.className = 'stat-card animate-in';
                card.style.animationDelay = `${index * 0.1}s`;

                card.innerHTML = `
                    <div class="stat-header" style="margin-bottom: 1rem;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="width: 48px; height: 48px; border-radius: 50%; background: ${user.avatar_color}; display: grid; place-items: center; color: white; font-weight: 600; font-size: 1.2rem;">
                                ${user.name.charAt(0)}
                            </div>
                            <div>
                                <div style="font-weight: 600; color: var(--text-main); font-size: 1.1rem;">${user.name}</div>
                                <div style="font-size: 0.85rem; color: var(--text-muted);">${user.email}</div>
                            </div>
                        </div>
                        <div class="stat-icon" style="color: ${user.status === 'Active' ? 'var(--success)' : 'var(--text-muted)'};">
                            <span class="material-symbols-rounded">circle</span>
                        </div>
                    </div>
                    <div style="margin-top: auto;">
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; color: var(--text-muted); padding-top: 1rem; border-top: 1px solid var(--glass-border);">
                            <span>${user.department}</span>
                            <span style="color: var(--primary);">${user.role}</span>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading users:', error);
            grid.innerHTML = '<div style="color: var(--danger);">Error loading users.</div>';
        }
    }

    // Load Current User
    async function loadCurrentUser() {
        try {
            const response = await fetch('/api/current_user');
            const user = await response.json();

            // Update Greeting
            const greetingElement = document.getElementById('greeting');
            if (greetingElement) {
                const hour = new Date().getHours();
                let greetingText = 'Good Morning';
                if (hour >= 12 && hour < 17) greetingText = 'Good Afternoon';
                else if (hour >= 17) greetingText = 'Good Evening';
                greetingElement.textContent = `${greetingText}, ${user.name.split(' ')[0]}`;
            }

            // Update Profile Widget
            const nameEl = document.getElementById('profile-name');
            const emailEl = document.getElementById('profile-email');
            const deptEl = document.getElementById('profile-dept');
            const supervisorEl = document.getElementById('profile-supervisor');

            if (nameEl) nameEl.textContent = user.name;
            if (emailEl) emailEl.textContent = user.email;
            if (deptEl) deptEl.textContent = `Department: ${user.department}`;
            // Assuming supervisor info might not be in the simple mock user object, but let's leave it static or update if available.
            // For now, let's just update what we have.

        } catch (error) {
            console.error('Error loading current user:', error);
        }
    }

    // Initial Load
    loadCurrentUser();

    // Add staggered animation delay to table rows
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        row.style.animationDelay = `${index * 0.05}s`;
        row.classList.add('animate-in');
    });
});
