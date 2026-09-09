const favoriteBtn = document.querySelectorAll('.favorite-btn');

favoriteBtn.forEach(button => {
    button.addEventListener('click', () => {
        const favoriteIcon = button.querySelector('i');
        favoriteIcon.classList.toggle('fa-regular');
        favoriteIcon.classList.toggle('fa-solid');
    });
});