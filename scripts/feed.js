import { auth } from "./firebase-config.js";
import { firestore } from "./firebase-config.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { translations, currentLanguage, translateProductField } from "./i18n.js";
import { setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { deleteDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const feedPostList = document.querySelector('.feed-post-list');

async function loadFeed() {
    const querySnapshot = await getDocs(collection(firestore, "products"));

    feedPostList.innerHTML = '';

    querySnapshot.forEach(async (docSnapshot) => {
        const product = docSnapshot.data();

        const favoriteId = `${auth.currentUser.uid}_${docSnapshot.id}`;
        const favoriteDoc = await getDoc(doc(firestore, "favorites", favoriteId));
        const isFavorited = favoriteDoc.exists();

        const userDoc = await getDoc(doc(firestore, "users", product.userId));
        const userData = userDoc.data();
        

        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < product.rating) {
                starsHTML += '<i class="fa-solid fa-star"></i>';
            } else {
                starsHTML += '<i class="fa-regular fa-star"></i>';
            }
        }

        let cardHTML = `
            <article class="product-card" data-id="${docSnapshot.id}">
                <div class="post-author">
                    <a href="profile.html?id=${product.userId}">
                        <img src="" alt="">
                        <span>@${userData.username}</span>
                    </a>
                </div>

                <div class="card-image">
                    <img src="${product.images && product.images.length > 0 ? product.images[0] : ''}" alt="">
                    <button type="button" class="favorite-btn">
                        <i class="${isFavorited ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                </div>

                <div class="card-content">
                    <div class="tags-row">
                        <span class="category-tag">${translateProductField(product.category)}</span>
                        <span class="status-tag">${translateProductField(product.status)}</span>
                    </div>
                    <h3>${product.name}</h3>
                    <p class="product-brand">${product.brand}</p>

                    <div class="rating">
                        ${starsHTML}
                    </div>
                </div>
            </article>
        `;

        feedPostList.innerHTML += cardHTML;
    });
}

feedPostList.addEventListener('click', async (event) => {
    const favoriteBtn = event.target.closest('.favorite-btn');

    if (favoriteBtn) {
        const card = event.target.closest('.product-card');
        const favoriteId = `${auth.currentUser.uid}_${card.dataset.id}`;
        const favoriteDocRef = doc(firestore, "favorites", favoriteId);
        const favoriteDoc = await getDoc(favoriteDocRef);
        const isFavorited = favoriteDoc.exists();
        const icon = favoriteBtn.querySelector('i');

        if (isFavorited) {
            await deleteDoc(favoriteDocRef);
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
        } else {
            await setDoc(favoriteDocRef, { userId: auth.currentUser.uid, productId: card.dataset.id });
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
        }

        return;
    }

    const card = event.target.closest('.product-card');
    window.location.href = `product.html?id=${card.dataset.id}`;
});

document.addEventListener('languageChanged', () => {
    loadFeed();
});

onAuthStateChanged(auth, (user) => {
    loadFeed();
});