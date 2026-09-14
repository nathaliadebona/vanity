import { auth } from "./firebase-config.js";
import { firestore } from "./firebase-config.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const feedPostList = document.querySelector('.feed-post-list');

async function loadFeed() {
    const querySnapshot = await getDocs(collection(firestore, "products"));

    feedPostList.innerHTML = '';

    querySnapshot.forEach(async (docSnapshot) => {
        const product = docSnapshot.data();
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

        feedPostList.innerHTML += cardHTML;
    });
}

feedPostList.addEventListener('click', (event) => {
    if (event.target.closest('.favorite-btn')) {
        return;
    }

    const card = event.target.closest('.product-card');
    window.location.href = `product.html?id=${card.dataset.id}`;
});

onAuthStateChanged(auth, (user) => {
    loadFeed();
});