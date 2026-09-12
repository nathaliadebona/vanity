import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const tabButtons = document.querySelectorAll('.tab-button');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
    button.classList.add('active');

    if (button.dataset.tab === 'login') {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    }
    });
});

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email-register').value;
    const password = document.getElementById('password-register').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        window.location.href = 'feed.html';
    } catch (error) {
        alert(error.message);
    }
});