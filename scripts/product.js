import { auth } from "./firebase-config.js";
import { firestore } from "./firebase-config.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { translations, currentLanguage, translateProductField, applyTranslations, translatePage } from "./i18n.js";
import { deleteDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { query } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { where } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { addDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');
const commentForm = document.getElementById('comment-form');
const newCommentInput = document.getElementById('new-comment-input');
const replyBtn = document.querySelectorAll('.reply-btn');
const nextButton = document.querySelector('.carousel-next');
const prevButton = document.querySelector('.carousel-prev');
const carouselDots = document.querySelector('.carousel-dots');
const editBtn = document.querySelector('.edit-btn');
const trashBtn = document.querySelector('.trash-btn');
const favoriteBtn = document.querySelector('.social-actions .favorite-btn');
const carouselImagesContainer = document.querySelector('.carousel-images');
const commentsListEl = document.querySelector('.comments-list');
const shareBtn = document.querySelector('.share-btn');
let carouselImage = document.querySelectorAll('.carousel-image');
let productId;
let currentIndex = 0;
let productData;

async function updateFavoriteCount() {
    const favoritesQuery = query(collection(firestore, "favorites"), where("productId", "==", productId));
    const favoritesSnapshot = await getDocs(favoritesQuery);
    document.getElementById('favorite-count').textContent = favoritesSnapshot.size;
}

async function loadProduct() {
    const params = new URLSearchParams(window.location.search);
    productId = params.get('id');
    loadComments();
    const productDoc = await getDoc(doc(firestore, "products", productId));
    productData = productDoc.data();
    const userDoc = await getDoc(doc(firestore, "users", productData.userId));
    const userData = userDoc.data();
    const favoriteId = `${auth.currentUser.uid}_${productId}`;
    const favoriteDoc = await getDoc(doc(firestore, "favorites", favoriteId));
    const isFavorited = favoriteDoc.exists();

    await updateFavoriteCount();

    if (isFavorited) {
        document.querySelector('.social-actions .favorite-btn i').classList.remove('fa-regular');
        document.querySelector('.social-actions .favorite-btn i').classList.add('fa-solid');
    } else {
        document.querySelector('.social-actions .favorite-btn i').classList.remove('fa-solid');
        document.querySelector('.social-actions .favorite-btn i').classList.add('fa-regular');
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

async function loadComments() {
    const commentsList = document.querySelector('.comments-list');
    commentsList.innerHTML = '';

    const q = query(
        collection(firestore, "comments"),
        where("productId", "==", productId)
    )
    const querySnapshot = await getDocs(q);

    for (const commentDoc of querySnapshot.docs) {
         if (commentDoc.data().parentId !== null) {
            continue;
        }
        const authorId = commentDoc.data().userId;

        const replies = querySnapshot.docs.filter((item) => {
            return item.data().parentId === commentDoc.id;
        });

        const userSnap = await getDoc(doc(firestore, "users", authorId));
        const authorData = userSnap.data() || { username: translations['removed-user'][currentLanguage] };
        const commentDate = commentDoc.data().createdAt.toDate();
        const likedBy = commentDoc.data().likedBy;

        const comment = document.createElement('article');
        comment.classList.add('comment');
        comment.dataset.id = commentDoc.id;

        const commentHeader = document.createElement('div');
        commentHeader.classList.add('comment-header');

        const commentAvatar = document.createElement( 'img');
        commentAvatar.src = authorData.photoURL || 'https://ui-avatars.com/api/?name=' + authorData.username;

        const commentUsername = document.createElement('span');
        commentUsername.textContent = '@' + authorData.username;

        const commentTime = document.createElement('time');
        commentTime.textContent = commentDate.toLocaleDateString('pt-BR');

        const commentBody = document.createElement('p');
        commentBody.classList.add('comment-body');
        commentBody.appendChild(await createMentionedText(commentDoc.data().text));

        const commentActions = document.createElement('div');
        commentActions.classList.add('comments-actions');

        const favoriteBtn = document.createElement('button');
        favoriteBtn.classList.add('like-btn');
        favoriteBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';

        if (likedBy.includes(auth.currentUser.uid)) {
            favoriteBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        }

        const favoriteCounter = document.createElement('span');
        favoriteCounter.classList.add('like-count');
        favoriteCounter.textContent = commentDoc.data().likedBy.length;

        const trashBtn = document.createElement('button');
        trashBtn.classList.add('trash-btn');
        trashBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>'

        const replyBtn = document.createElement('button');
        replyBtn.classList.add('reply-btn');
        replyBtn.textContent = 'Responder';
        replyBtn.dataset.i18n = 'reply-btn';

        const repliesList = document.createElement('div');
        repliesList.classList.add('replies');
        
    for (const replyDoc of replies) {
        const replyAuthorId = replyDoc.data().userId;
        const replyUserSnap = await getDoc(doc(firestore, "users", replyAuthorId));
        const replyAuthorData = replyUserSnap.data() || { username: translations['removed-user'][currentLanguage] };
        const replyDate = replyDoc.data().createdAt.toDate();

        const reply = document.createElement('div');
        reply.classList.add('reply');
        reply.dataset.id = replyDoc.id;

        const replyHeader = document.createElement('div');
        replyHeader.classList.add('reply-header');

        const replyAvatar = document.createElement('img');
        replyAvatar.classList.add('reply-avatar');
        replyAvatar.src = replyAuthorData.photoURL || 'https://ui-avatars.com/api/?name=' + replyAuthorData.username;

        const replyUsername = document.createElement('span');
        replyUsername.classList.add('reply-username');
        replyUsername.textContent = '@' + replyAuthorData.username;

        const replyTime = document.createElement('time');
        replyTime.classList.add('reply-time');
        replyTime.textContent = replyDate.toLocaleDateString('pt-BR');

        const replyText = document.createElement('p');
        replyText.classList.add('reply-text');
        replyText.appendChild(await createMentionedText(replyDoc.data().text));

        const replyCommentActions = document.createElement('div');
        replyCommentActions.classList.add('comments-actions');

        const replyLikeBtn = document.createElement('button');
        replyLikeBtn.classList.add('like-btn');
        replyLikeBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';

        if (replyDoc.data().likedBy.includes(auth.currentUser.uid)) {
            replyLikeBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        }       
    
        const replyLikeCounter = document.createElement('span');
        replyLikeCounter.classList.add('like-count');
        replyLikeCounter.textContent = replyDoc.data().likedBy.length;

        const replyTrashBtn = document.createElement('button');
        replyTrashBtn.classList.add('trash-btn');
        replyTrashBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        replyHeader.appendChild(replyAvatar);
        replyHeader.appendChild(replyUsername);
        replyHeader.appendChild(replyTime);
        reply.appendChild(replyHeader);
        reply.appendChild(replyText);
        repliesList.appendChild(reply);
        reply.appendChild(replyCommentActions);
        replyCommentActions.appendChild(replyLikeBtn);
        replyCommentActions.appendChild(replyLikeCounter);
        if (replyAuthorId === auth.currentUser.uid) {
            replyCommentActions.appendChild(replyTrashBtn);
        };
    }

        commentHeader.appendChild(commentAvatar);
        commentHeader.appendChild(commentUsername);
        commentHeader.appendChild(commentTime);
        comment.appendChild(commentHeader);
        comment.appendChild(commentBody);
        commentActions.appendChild(favoriteBtn);
        commentActions.appendChild(favoriteCounter);
        commentActions.appendChild(replyBtn);
        if (authorId === auth.currentUser.uid) {
            commentActions.appendChild(trashBtn);
        }
        comment.appendChild(commentActions);
        comment.appendChild(repliesList);
        commentsList.appendChild(comment);
    }

    translatePage();
}

async function createMentionedText(text) {
    const parts = text.split(/(@\w+)/);
    const fragment = document.createDocumentFragment();

    for (const part of parts) {
        if (part.startsWith('@')) {
            const mentionQuery = query(collection(firestore, "users"), where("username", "==", part.slice(1)));
            const mentionSnapshot = await getDocs(mentionQuery);
            
            if (mentionSnapshot.empty) {
                const textNode = document.createTextNode(part);
                fragment.appendChild(textNode);
            } else {
                const mentionLink = document.createElement('a');
                mentionLink.classList.add('mention');
                mentionLink.textContent = part;
                fragment.appendChild(mentionLink);
            }
        } else {
            const textNode = document.createTextNode(part);
            fragment.appendChild(textNode);
        }
    }

    return fragment;
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
    loadComments();
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

    updateFavoriteCount();
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

commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const commentText = newCommentInput.value.trim();

    if (!commentText) {
        return;
    }

    const newComment = {
        productId: productId,
        userId: auth.currentUser.uid,
        text: commentText,
        likedBy: [],
        parentId: null,
        createdAt: serverTimestamp()
    }

    await addDoc(collection(firestore, "comments"), newComment);

    loadComments();

    newCommentInput.value = '';
});

commentsListEl.addEventListener('click', async (event) => {
    const trashBtn = event.target.closest('.trash-btn');
    if (!trashBtn) {
        return
    }

    const reply = trashBtn.closest('.reply');

    if (reply) {
        await deleteDoc(doc(firestore, "comments", reply.dataset.id));
    } else {
        const comment = trashBtn.closest('.comment');
        await deleteDoc(doc(firestore, "comments", comment.dataset.id));
    }

    loadComments();
});

commentsListEl.addEventListener('click', async (event) => {
    const likeBtn = event.target.closest('.like-btn');
    if (!likeBtn) {
        return;
    }

    const reply = likeBtn.closest('.reply');
    let commentRef;

    if (reply) {
        commentRef = doc(firestore, "comments", reply.dataset.id);
    } else {
        const comment = likeBtn.closest('.comment');
        commentRef = doc(firestore, "comments", comment.dataset.id);
    }

    const commentSnap = await getDoc(commentRef);
    const likedBy = commentSnap.data().likedBy;

    if (!likedBy.includes(auth.currentUser.uid)) {
        await updateDoc(commentRef, {
            likedBy: arrayUnion(auth.currentUser.uid)
        });
    } else {
        await updateDoc(commentRef, {
            likedBy: arrayRemove(auth.currentUser.uid)
        });
    }

    loadComments();
});

commentsListEl.addEventListener('click', (event) => {
    const replyBtn = event.target.closest('.reply-btn');
    if (!replyBtn) {
        return
    }

    const comment = replyBtn.closest('.comment');
    const commentId = comment.dataset.id;

    const existingForm = comment.querySelector('.reply-form');
        if (existingForm) {
        return;
    }

    const replyForm = document.createElement('form');
    replyForm.classList.add('reply-form');

    replyForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const replyText = replyInput.value.trim();
        if (!replyText) {
            return;
        }

        const newReply = {
            productId: productId,
            userId: auth.currentUser.uid,
            text: replyText,
            likedBy: [],
            parentId: commentId,
            createdAt: serverTimestamp()
        }

        await addDoc(collection(firestore, "comments"), newReply);
        loadComments();
    });

    const replyInput = document.createElement('input');
    replyInput.classList.add('reply-input');
    replyInput.type = 'text';

    const replySendBtn = document.createElement('button');
    replySendBtn.classList.add('reply-send-btn');
    replySendBtn.type = 'submit';
    replySendBtn.textContent = 'Enviar';
    replySendBtn.dataset.i18n = 'send-btn';

    replyForm.appendChild(replyInput);
    replyForm.appendChild(replySendBtn);
    comment.appendChild(replyForm);

    translatePage();
});

shareBtn.addEventListener('click', () => {
    const productName = document.querySelector('.key-information h3').textContent;

    if (navigator.share) {
        navigator.share({
            title: productName,
            text: 'Olha esse produto que encontrei no Vanity!',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copiado!');
    }
});

onAuthStateChanged(auth, (user) => {
    loadProduct();
});