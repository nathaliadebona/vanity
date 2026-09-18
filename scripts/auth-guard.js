import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { firestore } from "./firebase-config.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


onAuthStateChanged(auth, async (user) => {
    if (user === null) {
        window.location.href = 'index.html';
        return
    }

    const userDoc = await getDoc(doc(firestore, "users", user.uid));
    const userData = userDoc.data();

    const headerAvatar = document.querySelector('header a img');
    headerAvatar.src = userData.photoURL || 'https://ui-avatars.com/api/?name=' + userData.username;
});