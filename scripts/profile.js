import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const logoutBtn = document.getElementById('logout-btn');
const tabButtons = document.querySelectorAll('.profile-tabs button');
const productsTab = document.querySelector('.products-tab');
const statsTab = document.querySelector('.stats-tab');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
    button.classList.add('active');

    if (button.dataset.tab === 'products') {
        productsTab.style.display = 'block';
        statsTab.style.display = 'none';
    } else {
        productsTab.style.display = 'none';
        statsTab.style.display = 'block';
    }
    });
});

logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'index.html';
});