import { auth } from "./firebase-config.js";
import { firestore } from "./firebase-config.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

async function loadFeed() {
    const querySnapshot = await getDocs(collection(firestore, "products"));

    const feedPostList = document.querySelector('.feed-post-list');
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
            <article class="product-card">
                <div class="post-author">
                    <a href="">
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

onAuthStateChanged(auth, (user) => {
    loadFeed();
});