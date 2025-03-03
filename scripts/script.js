document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    
    hamburger.addEventListener('click', () => {
        const navLinks = document.getElementById('nav-links');
        navLinks.classList.toggle('active');
    });
});