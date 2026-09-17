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
import { ref } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js";
import { uploadBytes } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js";
import { getDownloadURL } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js";
import { updatePassword } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { storage } from "./firebase-config.js";
import { updateDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const followModal = document.getElementById('follow-modal');
const followModalTitle = document.getElementById('follow-modal-title');
const followModalList = document.getElementById('follow-modal-list');
const followModalClose = document.getElementById('follow-modal-close');
const followersCountEl = document.getElementById('followers-count');
const followingCountEl = document.getElementById('following-count');
const logoutBtn = document.getElementById('logout-btn');
const profileEditBtn = document.getElementById('profile-edit-btn');
const followBtn = document.getElementById('follow-btn');
const editProfileModal = document.getElementById('edit-profile-modal');
const editProfileModalClose = document.getElementById('edit-profile-modal-close');
const editProfileForm = document.querySelector('#edit-profile-modal form');
const editNameInput = document.getElementById('edit-name');
const editBioInput = document.getElementById('edit-bio');
const editPhotoInput = document.getElementById('edit-photo');
const avatarPreview = document.getElementById('avatar-preview');
const editNewPassword = document.getElementById('edit-new-password');
const editConfirmPassword = document.getElementById('edit-confirm-password');
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

async function openFollowModal(type) {
    let fieldToQuery;
    let title;

    if (type === 'followers') {
        fieldToQuery = 'followingId';
        title = translations['counter-followers'][currentLanguage];
    } else {
        fieldToQuery = 'followerId';
        title = translations['counter-following'][currentLanguage];
    }

    const followsQuery = query(collection(firestore, "follows"), where(fieldToQuery, "==", profileUserId));
    const followsSnapshot = await getDocs(followsQuery);
    followModalList.innerHTML = '';

    followsSnapshot.forEach( async (docSnapshot) => {
        const followData = docSnapshot.data();
        const personId = fieldToQuery === 'followingId' ? followData.followerId : followData.followingId;
        const personDoc = await getDoc(doc(firestore, "users", personId));
        const personData = personDoc.data();

        const checkFollowId = `${auth.currentUser.uid}_${personId}`;
        const checkFollowDoc = await getDoc(doc(firestore, "follows", checkFollowId));
        const checkIsFollowing = checkFollowDoc.exists();

        const cardHTML = `
            <article class="person-card">
                <a href="profile.html?id=${personId}" class="person-link">
                    <img src="https://ui-avatars.com/api/?name=Camila" alt="">
                    <div class="person-info">
                        <p class="person-username">@${personData.username}</p>
                    </div>
                </a>
                <button type="button" class="follow-btn" data-id="${personId}">
                    ${checkIsFollowing ? translations["following-btn"][currentLanguage] : translations["follow-btn"][currentLanguage]}
                </button>
            </article>
        `;

        followModalList.innerHTML += cardHTML;
    });

    followModalTitle.textContent = title;
    followModal.showModal();
}

async function loadUserInfo(profileUserId) { 
    const userDoc = await getDoc(doc(firestore, "users", profileUserId));
    const userData = userDoc.data();

    document.querySelector('.profile-name').textContent = userData.name || '';
    document.querySelector('.profile-username').textContent = '@' + userData.username;
    document.querySelector('.profile-bio').textContent = userData.bio || '';
    document.querySelector('.profile-top img').src = userData.photoURL || 'https://ui-avatars.com/api/?name=' + userData.username;
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
    if (!card) {
        return;
    }
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

followersCountEl.addEventListener('click', () => {
    openFollowModal('followers');
});

followingCountEl.addEventListener('click', () => {
    openFollowModal('following');
});

followModalClose.addEventListener('click', () => {
    followModal.close();
});

followModalList.addEventListener('click', async (event) => {
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

profileEditBtn.addEventListener('click', async () => {
    const userDoc = await getDoc(doc(firestore, "users", auth.currentUser.uid));
    const userData = userDoc.data();

    editNameInput.value = userData.name || '';
    editBioInput.value = userData.bio || '';
    avatarPreview.src = userData.photoURL || 'https://ui-avatars.com/api/?name=' + userData.username;
    
    editProfileModal.showModal();
});

editPhotoInput.addEventListener('change', () => {
    const file = editPhotoInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', () => {
        avatarPreview.src = reader.result;
    });

    reader.readAsDataURL(file);
});

editProfileForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = editNameInput.value;
    const bio = editBioInput.value;

    try {
        const userDoc = await getDoc(doc(firestore, "users", auth.currentUser.uid));
        const userData = userDoc.data();
        let photoURL = userData.photoURL || '';
    
        if (editPhotoInput.files.length > 0) {
            const file = editPhotoInput.files[0];
            const storageRef = ref(storage, `profile-photos/${auth.currentUser.uid}`);
            await uploadBytes(storageRef, file);
            photoURL = await getDownloadURL(storageRef);
        }

        await updateDoc(doc(firestore, "users", auth.currentUser.uid), {
            name: name,
            bio: bio,
            photoURL: photoURL
        });

        loadUserInfo(profileUserId);
        editProfileModal.close();
    } catch (error) {
        alert(error.message);
    }

    loadUserInfo(profileUserId)
});

editProfileModalClose.addEventListener('click', () => {
    editProfileModal.close();
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
    loadUserInfo(profileUserId);
});