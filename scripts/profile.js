import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { firestore } from "./firebase-config.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { query } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { where } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const logoutBtn = document.getElementById('logout-btn');
const tabButtons = document.querySelectorAll('.profile-tabs button');
const productsTab = document.querySelector('.products-tab');
const statsTab = document.querySelector('.stats-tab');
const catalogGrid = document.querySelector('.catalog-grid');
const params = new URLSearchParams(window.location.search);
const viewedUserId = params.get('id');

async function loadProfileProducts(profileUserId) {
    catalogGrid.innerHTML = '';
    const q = query(collection(firestore, "products"), where("userId", "==", profileUserId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((docSnapshot) => {
        const product = docSnapshot.data();

        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < product.rating) {
                starsHTML += '<i class="fa-solid fa-star"></i>';
            } else {
                starsHTML += '<i class="fa-regular fa-star"></i>';
            }
        }

        const cardHTML = `
            <article class="product-card" data-id="${docSnapshot.id}">
                <div class="card-image">
                    <img src="" alt="">
                    <button type="button" class="favorite-btn">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>

                <div class="card-content">
                    <div class="tags-row">
                        <span class="category-tag">${product.category}</span>
                        <span class="status-tag">${product.status}</span>
                    </div>

                    <h3>${product.name}</h3>
                    <p class="product-brand">${product.brand}</p>

                    <div class="rating">
                        ${starsHTML}
                    </div>
                </div>
            </article>
        `;
        
        catalogGrid.innerHTML += cardHTML;
    });
}

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

catalogGrid.addEventListener('click', (event) => {
    if (event.target.closest('.favorite-btn')) {
        return;
    }

    const card = event.target.closest('.product-card');
    window.location.href = `product.html?id=${card.dataset.id}`;
});

onAuthStateChanged(auth, (user) => {
    const profileUserId = viewedUserId ? viewedUserId : user.uid;
    loadProfileProducts(profileUserId);
});