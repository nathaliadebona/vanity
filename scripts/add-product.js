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
const uploadLabel = document.querySelector('label[for="add-product-image"]');
const photoPreviews = document.querySelector('.photo-previews');

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
    Array.from(files).forEach(file => {
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            const img = document.createElement('img');
            img.src = reader.result;
            photoPreviews.append(img);
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