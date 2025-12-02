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

    // Add staggered animation delay to table rows
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        row.style.animationDelay = `${index * 0.05}s`;
        row.classList.add('animate-in');
    });
});
