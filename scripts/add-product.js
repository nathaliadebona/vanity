const subcategories = {
    makeup: ['Batom', 'Base', 'Corretivo', 'Blush', 'Sombra', 'Delineador', 'Máscara de cílios', 'Pó'],
    skincare: ['Hidratante', 'Protetor solar', 'Sérum', 'Limpador facial', 'Tônico', 'Esfoliante', 'Máscara facial'],
    perfume: ['Perfume', 'Body splash', 'Desodorante colônia'],
    hair: ['Shampoo', 'Condicionador', 'Máscara capilar', 'Óleo capilar', 'Leave-in', 'Finalizador']
}
const productCategory = document.getElementById('product-category');
const productSubcategory = document.getElementById('product-subcategory');
const addImageInput = document.getElementById('add-product-image');

// ---- Select de subcategoria ---- //
productCategory.addEventListener('change', () => {
    const selectedCategory = productCategory.value;
    const subcategoryOptions = subcategories[selectedCategory];
    productSubcategory.innerHTML = '';

    const selectOption = document.createElement('option');
    selectOption.textContent = 'Selecione';
    selectOption.value = '';

    productSubcategory.append(selectOption);

    subcategoryOptions.forEach(subcategory => {
        const option = document.createElement('option');
        option.textContent = subcategory;
        option.value = subcategory;

        productSubcategory.append(option);
    });
    productSubcategory.removeAttribute('disabled');
});

// ---- Preview de upload de imagem ---- //
addImageInput.addEventListener('change', () => {
    const file = addImageInput.files[0];
    const reader = new FileReader();
    const uploadLabel = document.querySelector('label[for="add-product-image"]');

    reader.addEventListener('load', () => {
        uploadLabel.innerHTML = `<img src="${reader.result}" alt="">`;
    });

    reader.readAsDataURL(file);
});