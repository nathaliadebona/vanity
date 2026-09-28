import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { firestore } from "./firebase-config.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { query } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { where } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
    if (user === null) {
        window.location.href = 'index.html';
        return
    }

    const userDoc = await getDoc(doc(firestore, "users", user.uid));
    const userData = userDoc.data();

    const headerAvatar = document.querySelector('header a img');
    headerAvatar.src = userData.photoURL || 'https://ui-avatars.com/api/?name=' + userData.username;

    const unreadQuery = query(
        collection(firestore, "notifications"),
        where("userId", "==", user.uid),
        where("read", "==", false)
    );

    const unreadSnapshot = await getDocs(unreadQuery);

    const bellLink = document.querySelector('.notifications-link');

    if (unreadSnapshot.size > 0) {
        const notificationBadge = document.createElement('span');
        notificationBadge.classList.add('notification-badge');
        notificationBadge.textContent = unreadSnapshot.size;

        bellLink.appendChild(notificationBadge);
    }
});