document.addEventListener('DOMContentLoaded', () => {
    ItemsManager.load();

    document.getElementById('search').addEventListener('input', (e) => {
        ItemsManager.applySearch(e.target.value);
    });

    document.getElementById('perpage').addEventListener('change', () => {
        ItemsManager.page = 0;
        ItemsManager.render();
    });

    document.getElementById('closeBtn').addEventListener('click', () => {
        document.getElementById('overlay').style.display = 'none';
    });

    document.getElementById('overlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('overlay')) {
            document.getElementById('overlay').style.display = 'none';
        }
    });

    document.getElementById('logoLink').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('search').value = '';
        ItemsManager.page = 0;
        ItemsManager.filtered = [...ItemsManager.items];
        ItemsManager.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('overlay').style.display = 'none';
        }
    });
});