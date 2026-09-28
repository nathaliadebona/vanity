import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { firestore } from "./firebase-config.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { query } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { where } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { orderBy } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { translations, currentLanguage, translateProductField, applyTranslations, translatePage } from "./i18n.js";

async function loadNotifications() {
    const notificationsQuery = query(collection(firestore, "notifications"), where("userId", "==", auth.currentUser.uid), orderBy("createdAt", "desc"));
    const notificationsSnapshot = await getDocs(notificationsQuery);

    const notificationsList = document.querySelector('.notifications-list');
    notificationsList.innerHTML = '';

    for (const notificationDoc of notificationsSnapshot.docs) {
        const actorId = notificationDoc.data().actorId;
        const actorSnap = await getDoc(doc(firestore, "users", actorId));
        const actorData = actorSnap.data();
        
        const notification = document.createElement('div');
        notification.classList.add('notification');
       
        const notificationActor = document.createElement('span');
        notificationActor.textContent = `@${actorData.username}`;

        const notificationText = document.createElement('span');
        notificationText.dataset.i18n = 'notification-comment'
        notificationText.textContent = ' comentou no seu produto';
 
        notificationsList.appendChild(notification);
        notification.appendChild(notificationActor);
        notification.appendChild(notificationText);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadNotifications();
    }
});