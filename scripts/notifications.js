import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { firestore } from "./firebase-config.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { query } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { where } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

async function loadNotifications() {
    const notificationsQuery = query(collection(firestore, "notifications"), where("userId", "==", auth.currentUser.uid));
    const notificationsSnapshot = await getDocs(notificationsQuery);

    const notificationsList = document.querySelector('.notifications-list');
    notificationsList.innerHTML = '';

    for (const notificationDoc of notificationsSnapshot.docs) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = 'Alguém comentou no seu produto';

        notificationsList.appendChild(notification);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadNotifications();
    }
});