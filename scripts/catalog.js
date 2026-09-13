import { auth } from "./firebase-config.js";
import { firestore } from "./firebase-config.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { query } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import{ where } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const filterBtn = document.getElementById('filter-btn');
const catalogFilter = document.querySelector('.catalog-filter');
const filterOptionsBtns = document.querySelectorAll('.category-buttons button, .status-buttons button, .buy-again-buttons button, .favorite-filter');
const productCards = document.querySelectorAll('.catalog-grid .product-card');

function applyFilters() {
    const activeCategoryButtons = document.querySelectorAll('.category-buttons button.active');
    const activeCategories = Array.from(activeCategoryButtons).map(button => button.dataset.value);

    const activeStatusButtons = document.querySelectorAll('.status-buttons button.active');
    const activeStatus = Array.from(activeStatusButtons).map(button => button.dataset.value);

    const activeBuyAgainButtons = document.querySelectorAll('.buy-again-buttons button.active');
    const activeBuyAgain = Array.from(activeBuyAgainButtons).map(button => button.dataset.value);

    const isFavoriteFilterActive = document.querySelector('.favorite-filter').classList.contains('active');

    productCards.forEach(card => {
        const cardCategory = card.dataset.category;
        const cardStatus = card.dataset.status;
        const cardBuyAgain = card.dataset.buyAgain;
        const matchesCategory = activeCategories.length === 0 || activeCategories.includes(cardCategory);
        const matchesStatus = activeStatus.length === 0 || activeStatus.includes(cardStatus);
        const matchesBuyAgain = activeBuyAgain.length === 0 || activeBuyAgain.includes(cardBuyAgain);
        const isFavorited = card.querySelector('.favorite-btn i').classList.contains('fa-solid');
        const matchesFavorite = !isFavoriteFilterActive || isFavorited;
    
        if (matchesCategory && matchesStatus && matchesBuyAgain && matchesFavorite) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

async function loadProducts() {
    const catalogGrid = document.querySelector('.catalog-grid');
    catalogGrid.innerHTML = '';
    const q = query(collection(firestore, "products"), where("userId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const product = doc.data();
        console.log(product);
        const cardHTML = `
            <article class="product-card">
                <div class="card-content">
                    <div class="tags-row">
                        <span class="category-tag">${product.category}</span>
                        <span class="status-tag">${product.status}</span>
                    </div>

                    <h3>${product.name}</h3>
                    <p class="product-brand">${product.brand}</p>
                </div>
            </article>
        `;
        
        catalogGrid.innerHTML += cardHTML;
    });
}

filterOptionsBtns.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');

        applyFilters();
    });
});

filterBtn.addEventListener('click', () => {
    catalogFilter.classList.toggle('hidden');
});

onAuthStateChanged(auth, (user) => {
    loadProducts();
});