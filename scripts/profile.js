import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { firestore } from "./firebase-config.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { query } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { where } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { translations, currentLanguage, translateProductField } from "./i18n.js";
import { deleteDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const logoutBtn = document.getElementById('logout-btn');
const profileEditBtn = document.getElementById('profile-edit-btn');
const followBtn = document.getElementById('follow-btn');
const tabButtons = document.querySelectorAll('.profile-tabs button');
const productsTab = document.querySelector('.products-tab');
const statsTab = document.querySelector('.stats-tab');
const catalogGrid = document.querySelector('.catalog-grid');
const params = new URLSearchParams(window.location.search);
const viewedUserId = params.get('id');
let profileUserId;
let isFollowing;

async function loadProfileProducts(profileUserId) {
    catalogGrid.innerHTML = '';
    const q = query(collection(firestore, "products"), where("userId", "==", profileUserId));
    const querySnapshot = await getDocs(q);

    document.getElementById('products-count').textContent = querySnapshot.size;

    querySnapshot.forEach( async (docSnapshot) => {
        const product = docSnapshot.data();

        const favoriteId = `${auth.currentUser.uid}_${docSnapshot.id}`;
        const favoriteDoc = await getDoc(doc(firestore, "favorites", favoriteId));
        const isFavorited = favoriteDoc.exists();

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
        
        catalogGrid.innerHTML += cardHTML;
    });
}

async function loadFollowCounts(profileUserId) {
    const followersQuery = query(collection(firestore, "follows"), where("followingId", "==", profileUserId));
    const followersSnapshot = await getDocs(followersQuery);
    document.getElementById('followers-count').textContent = followersSnapshot.size;

    const followingQuery = query(collection(firestore, "follows"), where("followerId", "==", profileUserId));
    const followingSnapshot = await getDocs(followingQuery);
    document.getElementById('following-count').textContent = followingSnapshot.size;
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

catalogGrid.addEventListener('click', async (event) => {
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

followBtn.addEventListener('click', async () => {
    const followId = `${auth.currentUser.uid}_${profileUserId}`;
    const followDocRef = doc(firestore, "follows", followId);

    if (isFollowing) {
        await deleteDoc(followDocRef);
        isFollowing = false;
        followBtn.textContent = translations["follow-btn"][currentLanguage];
    } else {
        await setDoc(followDocRef, {
            followerId: auth.currentUser.uid,
            followingId: profileUserId
        });
        isFollowing = true;
        followBtn.textContent = translations["following-btn"][currentLanguage];
    }
});

document.addEventListener('languageChanged', () => {
    loadProfileProducts(profileUserId);
});

onAuthStateChanged(auth, async (user) => {
    profileUserId = viewedUserId ? viewedUserId : user.uid;
    const isOwnProfile = profileUserId === user.uid;

    if (isOwnProfile) {
        logoutBtn.style.display = 'flex';
        profileEditBtn.style.display = 'block'
        followBtn.style.display = 'none'
    } else {
        logoutBtn.style.display = 'none';
        profileEditBtn.style.display = 'none';

        const followDoc = await getDoc(doc(firestore, "follows", `${user.uid}_${profileUserId}`));
        isFollowing = followDoc.exists();

        followBtn.style.display = 'flex';

        if (isFollowing) {
            followBtn.textContent = translations["following-btn"][currentLanguage];
        } else {
            followBtn.textContent = translations["follow-btn"][currentLanguage];
        }
    }

    loadProfileProducts(profileUserId);
    loadFollowCounts(profileUserId);
});