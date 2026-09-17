export const translations = {
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
    "following-btn": { pt: "Seguindo", en: "Following" },
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
    "select-placeholder": { pt: "Selecione", en: "Select" },
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
    "label-buy-again-result": { pt: "Recompraria?", en: "Would repurchase?" },
    "comments-title": { pt: "Comentários", en: "Comments" },
    "reply-btn": { pt: "Responder", en: "Reply" },
    "send-btn": { pt: "Enviar", en: "Send" },
    // ---- Inputs de busca ---- //
    "search-product": { pt: "Buscar produto...", en: "Search product..." },
    "search-username": { pt: "Buscar por username...", en: "Search by username..." },
    // ---- Sugestões para seguir ---- //
    "follow-suggestions": { pt: "Sugestões para seguir", en: "Suggestions to follow" },
    // ---- Mensagem de erro de username em uso ---- //
    "username-taken": { pt: "Esse nome de usuário já está em uso", en: "This username is already in use." },
    // ---- Mensagens de confirmação de senha ---- //
    "password-match": { pt: "Senhas coincidem", en: "Passwords match" },
    "password-no-match": { pt: "Senhas não coincidem", en: "Passwords do not match" },
    // ---- Edição de dados do perfil ----//
    "edit-profile-title": { pt: "Editar perfil", en: "Edit profile" },
    "edit-name-label": { pt: "Nome", en: "Name" },
    "edit-bio-label": { pt: "Bio", en: "Bio" },
    "edit-password-title": { pt: "Alterar senha", en: "Change password" },
    "edit-new-password-label": { pt: "Nova senha", en: "New password" },
    "edit-confirm-password-label": { pt: "Confirmar nova senha", en: "Confirm new password" },
    "save-profile-btn": { pt: "Salvar", en: "Save" }
};

const langToggleBtn = document.getElementById('lang-toggle');
const elementsToTranslate = document.querySelectorAll('[data-i18n]');
const elementsToTranslatePlaceholder = document.querySelectorAll('[data-i18n-placeholder]');
const savedLanguage = localStorage.getItem('language');
export let currentLanguage = savedLanguage ? savedLanguage : 'pt';

function applyTranslations () {
    elementsToTranslate.forEach(element => {
        const key = element.dataset.i18n;
        const translation = translations[key];
        element.textContent = translation[currentLanguage];
    });

    elementsToTranslatePlaceholder.forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        const translation = translations[key];
        el.placeholder = translation[currentLanguage];
    });

    langToggleBtn.textContent = (currentLanguage === 'pt' ? 'en' : 'pt').toUpperCase();
    document.dispatchEvent(new CustomEvent('languageChanged'));
}

export function translateProductField(value) {
    const key = `filter-${value}`;
    return translations[key][currentLanguage];
}

langToggleBtn.addEventListener('click', () => {
    if (currentLanguage === 'pt') {
        currentLanguage = 'en';
    } else {
        currentLanguage = 'pt';
    }

    localStorage.setItem('language', currentLanguage);

    applyTranslations();

    if (typeof productCategory !== 'undefined' && productCategory.value) {
        updateSubcategoryOptions();
    }
});

applyTranslations();