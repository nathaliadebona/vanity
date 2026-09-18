# Vanity 💅

Vanity is a personal beauty-product curation app: a place to catalog makeup, skincare, hair, and fragrance products you've tried, keep your own notes and rating on each one, favorite your best finds, and follow other people to see what they're using and recommending.

Designed and built as a full-stack learning project, with a focus on fundamentals: plain HTML, CSS, and JavaScript (no frameworks), using Firebase as the backend.

## Features

### Account and profile
- Sign up and log in with email and password (Firebase Authentication)
- Unique username check on sign-up
- Password reset via email ("forgot password")
- Change password while logged in
- Edit profile: name, bio, and photo (upload to Firebase Storage)
- Profile stats: total products, favorites, "would repurchase", breakdown by category and by status
- Followers/following counters, with a modal listing who follows/is followed

### Products
- Add products with name, brand, category, status (in use, finished, wishlist), rating, and review
- Upload multiple images per product, with a carousel on the product detail page
- Edit products, including adding/removing images
- Lightbox to zoom in on images (profile photo and product images)

### Social
- Feed showing products from all users
- Follow/unfollow system
- Suggested profiles to follow
- "Explore"-style catalog with filters (category, status, favorites) and search
- Search for people by username
- Favorite products

### Other
- Bilingual interface (Portuguese/English), with persisted language switching and dynamic content translated without a reload
- Responsive layout (mobile and desktop)

## Tech stack

- HTML5, CSS3, and JavaScript (ES Modules), no frameworks
- [Firebase](https://firebase.google.com/)
  - Authentication (email/password)
  - Firestore (database)
  - Storage (images)
- [Font Awesome](https://fontawesome.com/) (icons)

## Security rules

Data access is controlled by Firestore and Storage security rules, not by the Firebase config key (which is a public project identifier, not a secret). The rules ensure, for example, that each user can only edit their own profile and their own products, and that follow/favorite relationships can only be created by the authenticated user themselves.

## Running locally

1. Clone the repository.
2. Create a project in the [Firebase Console](https://console.firebase.google.com/) and enable:
   - Authentication (email/password method)
   - Firestore Database
   - Storage
3. Copy your Firebase project credentials (Project settings → SDK setup) and replace the values in `scripts/firebase-config.js`.
4. Set up Firestore and Storage security rules (restricting read/write access based on data ownership is recommended).
5. Serve the files with a local server — the project uses ES Modules, so it won't work by opening `index.html` directly via `file://`. Some options:
   - VS Code's "Live Server" extension
   - `npx serve`
   - `python -m http.server`

## Roadmap

Planned features, not yet implemented:

- Comments on products
- Mentions (@username)
- Notifications
- Direct messages between users
- Sharing products/profiles

## Screenshots

_Coming soon._

---

Personal learning project, built by [Nathalia](mailto:nathalia.contactdc@gmail.com).
