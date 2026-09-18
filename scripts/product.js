import { auth } from "./firebase-config.js";
import { firestore } from "./firebase-config.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { translations, currentLanguage, translateProductField } from "./i18n.js";
import { deleteDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { query } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { where } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');
const replyBtn = document.querySelectorAll('.reply-btn');
const nextButton = document.querySelector('.carousel-next');
const prevButton = document.querySelector('.carousel-prev');
const carouselDots = document.querySelector('.carousel-dots');
const editBtn = document.querySelector('.edit-btn');
const trashBtn = document.querySelector('.trash-btn');
const favoriteBtn = document.querySelector('.action-buttons .favorite-btn');
const carouselImagesContainer = document.querySelector('.carousel-images');
let carouselImage = document.querySelectorAll('.carousel-image');
let productId;
let currentIndex = 0;
let productData;

async function loadProduct() {
    const params = new URLSearchParams(window.location.search);
    productId = params.get('id');
    const productDoc = await getDoc(doc(firestore, "products", productId));
    productData = productDoc.data();
    const userDoc = await getDoc(doc(firestore, "users", productData.userId));
    const userData = userDoc.data();
    const favoriteId = `${auth.currentUser.uid}_${productId}`;
    const favoriteDoc = await getDoc(doc(firestore, "favorites", favoriteId));
    const isFavorited = favoriteDoc.exists();

    const favoritesQuery = query(collection(firestore, "favorites"), where("productId", "==", productId));
    const favoritesSnapshot = await getDocs(favoritesQuery);
    document.getElementById('favorite-count').textContent = favoritesSnapshot.size;

    if (isFavorited) {
        document.querySelector('.action-buttons .favorite-btn i').classList.remove('fa-regular');
        document.querySelector('.action-buttons .favorite-btn i').classList.add('fa-solid');
    } else {
        document.querySelector('.action-buttons .favorite-btn i').classList.remove('fa-solid');
        document.querySelector('.action-buttons .favorite-btn i').classList.add('fa-regular');
    }

    document.querySelector('.post-author a').href = `profile.html?id=${productData.userId}`;
    document.querySelector('.post-author span').textContent = `@${userData.username}`;
    document.querySelector('.key-information h3').textContent = productData.name;
    document.querySelector('.key-information .product-brand').textContent = productData.brand;
    document.querySelector('.key-information .tags-row .category-tag').textContent = translateProductField(productData.category);
    document.querySelector('.key-information .tags-row .status-tag').textContent = translateProductField(productData.status);
    
    let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < productData.rating) {
                starsHTML += '<i class="fa-solid fa-star"></i>';
            } else {
                starsHTML += '<i class="fa-regular fa-star"></i>';
            }
        }

    document.querySelector('.key-information .rating').innerHTML = starsHTML;
    document.querySelector('.review p').textContent = productData.review;

    let imagesHTML = '';
        for (let i = 0; i < productData.images.length; i++) {
            const activeClass = i === 0 ? 'active' : '';
            imagesHTML += `<img src="${productData.images[i]}" alt="" class="carousel-image ${activeClass}">`;
        }

        carouselImagesContainer.innerHTML = imagesHTML;
        carouselImage = document.querySelectorAll('.carousel-image');

        carouselDots.innerHTML = '';
        carouselImage.forEach((image, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            carouselDots.append(dot);

            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });

    updateBuyAgainText();
}

function updateBuyAgainText() {
    if (productData.buyAgain === 'yes') {
        document.querySelector('.key-information strong').textContent = translations["filter-yes"][currentLanguage];
    } else {
        document.querySelector('.key-information strong').textContent = translations["filter-no"][currentLanguage];
    }
}

function updateCarousel() {
    carouselImage.forEach(image => {
        image.classList.remove('active')
    });
    const activeImage = carouselImage[currentIndex];
    activeImage.classList.add('active');

    const allDots = document.querySelectorAll('.carousel-dot');

     allDots.forEach(dot => {
        dot.classList.remove('active');
    });

    const activeDot = allDots[currentIndex];
    activeDot.classList.add('active');
}

replyBtn.forEach(button => {
    button.addEventListener('click', () => {
        const commentActions = button.closest('.comments-actions');
        const commentElement = button.closest('.comment');
        const existingReply = commentElement.querySelector('.new-comment');

        if (existingReply) {
            existingReply.remove();
        } else {
            const replyWrapper = document.createElement('div');
            replyWrapper.className = 'new-comment';

            const replyInput = document.createElement('input');
            replyInput.type = 'text';
            replyInput.className = 'reply-input';

            const replyCommentBtn = document.createElement('button');
            replyCommentBtn.className = 'reply-comment-btn';
            replyCommentBtn.textContent = 'Enviar';

            commentActions.after(replyWrapper);
            replyWrapper.append(replyInput);
            replyWrapper.append(replyCommentBtn);
        }
    });
});

nextButton.addEventListener('click', () => {
    currentIndex++;
    currentIndex = currentIndex % carouselImage.length;
    updateCarousel();
});

prevButton.addEventListener('click', () => {
    currentIndex--
    currentIndex = (currentIndex + carouselImage.length) % carouselImage.length;
    updateCarousel();
});

document.addEventListener('languageChanged', () => {
    updateBuyAgainText();
    document.querySelector('.key-information .tags-row .category-tag').textContent = translateProductField(productData.category);
    document.querySelector('.key-information .tags-row .status-tag').textContent = translateProductField(productData.status);
});

editBtn.addEventListener('click', () => {
    window.location.href = `add-product.html?id=${productId}`;
});

trashBtn.addEventListener('click', async () => {
    const confirmed = confirm('Tem certeza que deseja excluir este produto?');
    
    if (confirmed) {
        await deleteDoc(doc(firestore, "products", productId));
        window.location.href = 'profile.html';
    }
});

favoriteBtn.addEventListener('click', async () => {
    const favoriteId = `${auth.currentUser.uid}_${productId}`;
    const favoriteDocRef = doc(firestore, "favorites", favoriteId);
    const favoriteDoc = await getDoc(favoriteDocRef);
    const isFavorited = favoriteDoc.exists();
    const icon = favoriteBtn.querySelector('i');

    if (isFavorited) {
        await deleteDoc(favoriteDocRef);
        icon.classList.add('fa-regular');
        icon.classList.remove('fa-solid');
    } else {
        await setDoc(favoriteDocRef, { userId: auth.currentUser.uid, productId: productId });
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
    }
});

carouselImagesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('carousel-image')) {
        lightboxImage.src = event.target.src;
        lightboxModal.showModal();
    }
});

lightboxClose.addEventListener('click', () => {
    lightboxModal.close();
});

onAuthStateChanged(auth, (user) => {
    loadProduct();
});