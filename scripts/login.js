import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { firestore } from "./firebase-config.js";
import { doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { collection }from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { query } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { where } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { translations, currentLanguage } from "./i18n.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const tabButtons = document.querySelectorAll('.tab-button');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const passwordRegister = document.getElementById('password-register');
const passwordConfirmRegister = document.getElementById('password-confirm-register');
const passwordMatchMessage = document.getElementById('password-match-message');
const forgotPasswordLink = document.getElementById('forgot-password');

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
    const username = document.getElementById('username-register').value;

    try {
        const q = query(collection(firestore, "users"), where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return alert(translations["username-taken"][currentLanguage]);
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userDocRef = doc(firestore, "users", userCredential.user.uid);

        await setDoc(userDocRef, {
            username: username,
            email: email
        });

        window.location.href = 'feed.html';
    } catch (error) {
        alert(error.message);
    }
});

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'feed.html';
    } catch (error) {
        alert(error.message);
    }
});

passwordConfirmRegister.addEventListener('input', () => {
    if (passwordConfirmRegister.value === '') {
        passwordMatchMessage.textContent = '';
        passwordMatchMessage.classList.remove('match');
        passwordMatchMessage.classList.remove('no-match');
        return
    }

    if (passwordConfirmRegister.value === passwordRegister.value) {
        passwordMatchMessage.innerHTML = `<i class="fa-solid fa-check"></i> ${translations["password-match"][currentLanguage]}`;
        passwordMatchMessage.classList.add('match');
        passwordMatchMessage.classList.remove('no-match');
    } else {
        passwordMatchMessage.innerHTML = `<i class="fa-solid fa-xmark"></i> ${translations["password-no-match"][currentLanguage]}`;
        passwordMatchMessage.classList.remove('match');
        passwordMatchMessage.classList.add('no-match');
    }
});

forgotPasswordLink.addEventListener('click', async (event) =>{
    event.preventDefault();
    const email = document.getElementById('email-login').value;

    if (email === '') {
        alert(translations["forgot-password-empty"][currentLanguage]);
        return
    } 

    try {
        await sendPasswordResetEmail(auth, email);
        alert(translations["forgot-password-sent"][currentLanguage]);
    } catch (error) {
        alert(error.message);
    }
});