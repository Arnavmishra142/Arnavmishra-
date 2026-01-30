document.addEventListener('DOMContentLoaded', () => {
    
    // Elements Select Karo
    const launcher = document.getElementById('ai-launcher');
    const modal = document.getElementById('ai-modal');
    const closeBtn = document.getElementById('ai-close-btn');
    
    // 1. Open Modal (Click on Reactor)
    launcher.addEventListener('click', () => {
        modal.classList.add('active');
    });

    // 2. Close Modal (Function)
    const closeModal = () => {
        modal.classList.remove('active');
    };

    // Close on X Button
    closeBtn.addEventListener('click', closeModal);

    // Close on Background Click (Overlay)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close when clicking internal links (Smooth scroll)
    document.querySelectorAll('.ai-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    console.log("AI System: Online & Interactive 🟢");
});
