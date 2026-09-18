import { auth } from "./firebase-config.js";
import { firestore } from "./firebase-config.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { translations, currentLanguage, translateProductField } from "./i18n.js";
import { setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { deleteDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { query } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { where } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const feedPostList = document.querySelector('.feed-post-list');
const suggestionsList = document.querySelector('.suggestions-list');

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
                        <img src="${userData.photoURL || 'https://ui-avatars.com/api/?name=' + userData.username}" alt="">
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

async function loadFollowSuggestions() {
    const usersSnapshot = await getDocs(collection(firestore, "users"));
    const followingQuery = query(collection(firestore, "follows"), where("followerId", "==", auth.currentUser.uid));
    const followingSnapshot = await getDocs(followingQuery);
    const followingIds = followingSnapshot.docs.map(docSnapshot => docSnapshot.data().followingId);
    const filteredUsers = usersSnapshot.docs.filter(docSnapshot => {
        const isSelf = docSnapshot.id === auth.currentUser.uid;
        const isFollowed = followingIds.includes(docSnapshot.id);
        return !isSelf && !isFollowed;
    });

    filteredUsers.sort(() => Math.random() - 0.5);
    const suggestedUsers = filteredUsers.slice(0, 3);

    suggestionsList.innerHTML = '';

    suggestedUsers.forEach(docSnapshot => {
        const person = docSnapshot.data();

        const cardHTML = `
            <article class="person-card">
                <a href="profile.html?id=${docSnapshot.id}" class="person-link">
                    <img src="https://ui-avatars.com/api/?name=Camila" alt="">
                    <div class="person-info">
                        <p class="person-username">@${person.username}</p>
                    </div>
                </a>
                <button type="button" class="follow-btn" data-id="${docSnapshot.id}">${translations["follow-btn"][currentLanguage]}</button>
            </article>
        `;

        suggestionsList.innerHTML += cardHTML;
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

suggestionsList.addEventListener('click', async (event) => {
    const followBtn = event.target.closest('.follow-btn');

    if (!followBtn) {
        return;
    }

    const personId = followBtn.dataset.id;
    const followId = `${auth.currentUser.uid}_${personId}`;
    const followDocRef = doc(firestore, "follows", followId);
    const followDoc = await getDoc(followDocRef);
    const isFollowing = followDoc.exists();

    if (isFollowing) {
        await deleteDoc(followDocRef);
        followBtn.textContent = translations["follow-btn"][currentLanguage];
    } else {
        await setDoc(followDocRef, {
            followerId: auth.currentUser.uid,
            followingId: personId
        });

        followBtn.textContent = translations["following-btn"][currentLanguage];
    }
});

onAuthStateChanged(auth, (user) => {
    loadFeed();
    loadFollowSuggestions();
});