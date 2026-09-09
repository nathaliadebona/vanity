const filterBtn = document.getElementById('filter-btn');
const catalogFilter = document.querySelector('.catalog-filter');
const filterOptionsBtns = document.querySelectorAll('.category-buttons button, .status-buttons button, .buy-again-buttons button, .favorite-filter');

filterOptionsBtns.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
    });
});

filterBtn.addEventListener('click', () => {
    catalogFilter.classList.toggle('hidden');
});

