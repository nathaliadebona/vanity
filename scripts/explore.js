import { auth } from "./firebase-config.js";
import { firestore } from "./firebase-config.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const searchPeopleInput = document.getElementById('search-people-input');
const peopleList = document.querySelector('.people-list');

async function loadPeople() {
    const querySnapshot = await getDocs(collection(firestore, "users"));

    peopleList.innerHTML = '';

    querySnapshot.forEach( (docSnapshot) => {
        const person = docSnapshot.data();

        let cardHTML = `
            <article class="person-card" data-id="${docSnapshot.id}">
                <a href="profile.html?id=${docSnapshot.id}" class="person-link">
                    <img src="https://ui-avatars.com/api/?name=Camila" alt="">
                    <div class="person-info">
                        <p class="person-username">@${person.username}</p>
                    </div>
                </a>

                <button type="button" class="follow-btn">Seguir</button>
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

onAuthStateChanged(auth, (user) => {
    loadPeople();
});