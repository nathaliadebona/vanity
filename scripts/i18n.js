const translations = {
    // ---- Login + Nav ---- //
    "tab-login": { pt: "Entrar", en: "Log in" },
    "tab-register": { pt: "Criar conta", en: "Sign up" },
    "email-login": { pt: "E-mail", en: "Email" },
    "password-login": { pt: "Senha", en: "Password" },
    "forgot-password": { pt: "Esqueci a senha", en: "Forgot password" },
    "login-btn": { pt: "Entrar", en: "Log in" },
    "username-register": { pt: "Nome de usuário", en: "Username" },
    "email-register": { pt: "E-mail", en: "Email" },
    "password-register": { pt: "Senha", en: "Password" },
    "password-confirm-register": { pt: "Confirmar senha", en: "Confirm password" },
    "register-btn": { pt: "Criar conta", en: "Sign up" },
    "footer-copyright": { pt: "© 2026 Vanity", en: "© 2026 Vanity" },
    "feed": { pt: "Feed", en: "Feed" },
    "catalog": { pt: "Catálogo", en: "Catalog" },
    "add-product": { pt: "Adicionar", en: "Add" },
    "explore": { pt: "Explorar", en: "Explore" },
    "profile": { pt: "Perfil", en: "Profile" },
    // ---- Perfil ---- //
    "profile-edit": { pt: "Editar perfil", en: "Edit profile" },
    "tab-products": { pt: "Produtos", en: "Products" },
    "tab-stats": { pt: "Estatísticas", en: "Statistics" },
    "counter-products": { pt: "Produtos", en: "Products" },
    "counter-followers": { pt: "Seguidores", en: "Followers" },
    "counter-following": { pt: "Seguindo", en: "Following" },
    "chart-category": { pt: "Por categoria", en: "By category" },
    "chart-status": { pt: "Por status", en: "By status" },
    // ---- Adicionar produto ---- //
    "add-product-title": { pt: "Adicionar produto", en: "Add product" },
    "label-photo": { pt: "Adicionar foto", en: "Add photo" },
    "label-name": { pt: "Nome do produto", en: "Product name" },
    "label-brand": { pt: "Marca do produto", en: "Product brand" },
    "label-category": { pt: "Categoria", en: "Category" },
    "label-subcategory": { pt: "Subcategoria", en: "Subcategory" },
    "legend-rating": { pt: "Nota", en: "Rating" },
    "label-buy-again": { pt: "Recompraria?", en: "Would repurchase?" },
    "label-status": { pt: "Status", en: "Status" },
    "label-review": { pt: "Resenha", en: "Review" },
    "submit-add-product": { pt: "Adicionar produto", en: "Add product" },
    // ---- Catálogo ---- //
    "catalog-title": { pt: "Meu catálogo", en: "My catalog" },
    "filter-makeup": { pt: "Maquiagem", en: "Makeup" },
    "filter-skincare": { pt: "Skincare", en: "Skincare" },
    "filter-perfume": { pt: "Perfume", en: "Perfume" },
    "filter-hair": { pt: "Cabelo", en: "Hair" },
    "filter-using": { pt: "Em uso", en: "In use" },
    "filter-finished": { pt: "Acabou", en: "Finished" },
    "filter-wishlist": { pt: "Wishlist", en: "Wishlist" },
    "filter-yes": { pt: "Sim", en: "Yes" },
    "filter-no": { pt: "Não", en: "No" },
    "filter-favorites": { pt: "Favoritos", en: "Favorites" },
    // ---- Explorar ---- //
    "explore-title": { pt: "Explorar", en: "Explore" },
    "follow-btn": { pt: "Seguir", en: "Follow" },
    // ---- Detalhe do produto ---- //
    "review-title": { pt: "Resenha", en: "Review" },
    "comments-title": { pt: "Comentários", en: "Comments" },
    "reply-btn": { pt: "Responder", en: "Reply" },
    "send-btn": { pt: "Enviar", en: "Send" }
};

const langToggleBtn = document.getElementById('lang-toggle');
const elementsToTranslate = document.querySelectorAll('[data-i18n]');
const savedLanguage = localStorage.getItem('language');
let currentLanguage = savedLanguage ? savedLanguage : 'pt';

function applyTranslations () {
    elementsToTranslate.forEach(element => {
        const key = element.dataset.i18n;
        const translation = translations[key];
        element.textContent = translation[currentLanguage];
    });
    langToggleBtn.textContent = (currentLanguage === 'pt' ? 'en' : 'pt').toUpperCase();
}

langToggleBtn.addEventListener('click', () => {
    if (currentLanguage === 'pt') {
        currentLanguage = 'en';
    } else {
        currentLanguage = 'pt';
    }

    localStorage.setItem('language', currentLanguage);

    applyTranslations();
});

applyTranslations();