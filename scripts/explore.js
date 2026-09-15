import { auth } from "./firebase-config.js";
import { firestore } from "./firebase-config.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { deleteDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { translations, currentLanguage } from "./i18n.js";

const searchPeopleInput = document.getElementById('search-people-input');
const peopleList = document.querySelector('.people-list');

async function loadPeople() {
    const querySnapshot = await getDocs(collection(firestore, "users"));

    peopleList.innerHTML = '';

    querySnapshot.forEach( async (docSnapshot) => {
        const person = docSnapshot.data();

        const followId = `${auth.currentUser.uid}_${docSnapshot.id}`;
        const followDoc = await getDoc(doc(firestore, "follows", followId));
        const isFollowing = followDoc.exists();

        let cardHTML = `
            <article class="person-card" data-id="${docSnapshot.id}">
                <a href="profile.html?id=${docSnapshot.id}" class="person-link">
                    <img src="https://ui-avatars.com/api/?name=Camila" alt="">
                    <div class="person-info">
                        <p class="person-username">@${person.username}</p>
                    </div>
                </a>

                <button type="button" class="follow-btn">
                    ${isFollowing ? translations["following-btn"][currentLanguage] : translations["follow-btn"][currentLanguage]}
                </button>
            </article>
        `;

        peopleList.innerHTML += cardHTML;
    });
}

function applyPeopleFilter() {
    const searchValue = searchPeopleInput.value.toLowerCase();

    const peopleCards = document.querySelectorAll('.person-card');

    peopleCards.forEach(card => {
        const personUsername = card.querySelector('.person-username').textContent.toLowerCase();

        if (searchValue === '' || personUsername.includes(searchValue)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

searchPeopleInput.addEventListener('input', () => {
    applyPeopleFilter();
});

peopleList.addEventListener('click', async (event) => {
    if (!event.target.closest('.follow-btn')) {
        return;
    }

    const card = event.target.closest('.person-card');
    const personId = card.dataset.id;

    const followId = `${auth.currentUser.uid}_${personId}`;
    const followDocRef = doc(firestore, "follows", followId);
    const followDoc = await getDoc(followDocRef);
    const isFollowing = followDoc.exists();
    const followBtn = event.target.closest('.follow-btn');

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
    loadPeople();
});