document.querySelectorAll('.faq-item h2').forEach(item => {
    item.addEventListener('click', () => {
        const faqItem = item.parentNode;
        faqItem.classList.toggle('active');
    });
});