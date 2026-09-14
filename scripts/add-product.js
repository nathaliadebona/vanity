import { translations, currentLanguage } from "./i18n.js";
import { auth } from "./firebase-config.js";
import { firestore } from "./firebase-config.js";
import { collection } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { addDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { updateDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const subcategories = {
    makeup: [
        { pt: 'Batom', en: 'Lipstick' },
        { pt: 'Base', en: 'Foundation' },
        { pt: 'Corretivo', en: 'Concealer' },
        { pt: 'Blush', en: 'Blush' },
        { pt: 'Sombra', en: 'Eyeshadow' },
        { pt: 'Delineador', en: 'Eyeliner' },
        { pt: 'Máscara de cílios', en: 'Mascara' },
        { pt: 'Pó', en: 'Powder' }
    ],
    skincare: [
        { pt: 'Hidratante', en: 'Moisturizer' },
        { pt: 'Protetor solar', en: 'Sunscreen' },
        { pt: 'Sérum', en: 'Serum' },
        { pt: 'Limpador facial', en: 'Facial cleanser' },
        { pt: 'Tônico', en: 'Toner' },
        { pt: 'Esfoliante', en: 'Exfoliant' },
        { pt: 'Máscara facial', en: 'Face mask' }
    ],
    perfume: [
        { pt: 'Perfume', en: 'Perfume' },
        { pt: 'Body splash', en: 'Body splash' },
        { pt: 'Desodorante colônia', en: 'Cologne' }
    ],
    hair: [
        { pt: 'Shampoo', en: 'Shampoo' },
        { pt: 'Condicionador', en: 'Conditioner' },
        { pt: 'Máscara capilar', en: 'Hair mask' },
        { pt: 'Óleo capilar', en: 'Hair oil' },
        { pt: 'Leave-in', en: 'Leave-in' },
        { pt: 'Finalizador', en: 'Finishing product' }
    ]
};
const productCategory = document.getElementById('product-category');
const productSubcategory = document.getElementById('product-subcategory');
const addImageInput = document.getElementById('add-product-image');
const addProductForm = document.getElementById('add-product-form');
const uploadLabel = document.querySelector('label[for="add-product-image"]');
const photoPreviews = document.querySelector('.photo-previews');
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
let selectedFiles = [];

if (productId) {
    loadProductForEdit();
}

async function loadProductForEdit() {
    const productDoc = await getDoc(doc(firestore, "products", productId));
    const productData = productDoc.data();

    document.getElementById('product-name').value = productData.name;
    document.getElementById('product-brand').value = productData.brand;
    document.getElementById('review-area').value = productData.review;
    document.getElementById('product-category').value = productData.category;
    updateSubcategoryOptions();
    document.getElementById('product-subcategory').value = productData.subcategory;
    document.getElementById('buy-again').value = productData.buyAgain;
    document.getElementById('status').value = productData.status;

    const ratingId = 'rating-' + productData.rating;
    document.getElementById(ratingId).checked = true;
}

function updateSubcategoryOptions() {
    const selectedCategory = productCategory.value;
    const subcategoryOptions = subcategories[selectedCategory];
    productSubcategory.innerHTML = '';

    const selectOption = document.createElement('option');
    selectOption.textContent = translations['select-placeholder'][currentLanguage];
    selectOption.value = '';
    productSubcategory.append(selectOption);

    subcategoryOptions.forEach(subcategory => {
        const option = document.createElement('option');
        option.textContent = subcategory[currentLanguage];
        option.value = subcategory.en;
        productSubcategory.append(option);
    });

    productSubcategory.removeAttribute('disabled');
}

productCategory.addEventListener('change', () => {
  updateSubcategoryOptions();
});

// ---- Preview de upload de imagem ---- //
function showImagePreviews(files) {
    selectedFiles.push(...files);
    renderPreviews();
}

function renderPreviews() {
    photoPreviews.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            const photoPreviewItem = document.createElement('div');
            photoPreviewItem.className = 'photo-preview-item';

            const img = document.createElement('img');
            img.src = reader.result;

            const removePhotoBtn = document.createElement('button');
            removePhotoBtn.className = 'remove-photo-btn';
            removePhotoBtn.addEventListener('click', () => {
                selectedFiles.splice(index, 1);
                renderPreviews();
            });

            const removeIcon = document.createElement('i');
            removeIcon.className = 'fa-solid fa-trash-can';
            removePhotoBtn.append(removeIcon);

            photoPreviewItem.append(img);
            photoPreviewItem.append(removePhotoBtn);
            photoPreviews.append(photoPreviewItem);
        });

        reader.readAsDataURL(file);
    });
}

addImageInput.addEventListener('change', () => {
    showImagePreviews(addImageInput.files);
});

// ---- Drag and drop ---- //
uploadLabel.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadLabel.classList.add('drag-over');
});

uploadLabel.addEventListener('dragleave', () => {
    uploadLabel.classList.remove('drag-over');
});

uploadLabel.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadLabel.classList.remove('drag-over');

    const files = event.dataTransfer.files;
    showImagePreviews(files);
});

addProductForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        const productName = document.getElementById('product-name').value;
        const productBrand = document.getElementById('product-brand').value;
        const productCategory = document.getElementById('product-category').value;
        const productSubcategory = document.getElementById('product-subcategory').value;
        const buyAgain = document.getElementById('buy-again').value;
        const status = document.getElementById('status').value;
        const reviewArea = document.getElementById('review-area').value;
        const ratingInput = document.querySelector('input[name="rating"]:checked');
        const rating = ratingInput.id.split('-')[1];
        const productData = {
            name: productName,
            brand: productBrand,
            category: productCategory,
            subcategory: productSubcategory,
            buyAgain: buyAgain,
            status: status,
            review: reviewArea,
            rating: rating,
            userId: auth.currentUser.uid
        }

        if (productId) {
            await updateDoc(doc(firestore, "products", productId), productData);
        } else {
            await addDoc(collection(firestore, "products"), productData);
        }

        window.location.href = 'profile.html';
    } catch (error) {
        alert(error.message)
    }
});