const ItemsManager = {
    ICON_URL: 'assets/images/item-placeholder.jpg',

    items: [],
    filtered: [],
    page: 0,
    perPage: 100,

    load() {
        try {
            console.log('Загружаю данные...');
            this.items = itemsData;
            console.log('Успешно загружено:', this.items.length, 'предметов');
        } catch (e) {
            console.error('Ошибка загрузки:', e);
            this.items = [];
        }
        this.filtered = [...this.items];
        this.render();
    },

    getItemImage(item) {
        if (item.img) {
            return `assets/images/items/${item.img}.png`;
        }
        return this.ICON_URL;
    },

    render() {
        document.getElementById('total').textContent = this.filtered.length;
        this.perPage = Number(document.getElementById('perpage').value);
        const grid = document.getElementById('grid');

        if (this.filtered.length === 0) {
            this.showEmptyState();
            document.getElementById('pager').innerHTML = '';
            return;
        }

        grid.innerHTML = '';
        const start = this.page * this.perPage;
        const pageItems = this.filtered.slice(start, start + this.perPage);

        pageItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${this.getItemImage(item)}" alt="${item.name}" 
                     onerror="this.src='${this.ICON_URL}'" />
                <h3>${item.name}</h3>
                <div class="meta"><strong>UID:</strong> ${item.UID}</div>
                <div class="meta"><strong>Model:</strong> ${item.model}</div>
            `;
            card.addEventListener('click', () => this.openModal(item));
            grid.appendChild(card);
        });

        this.renderPager();
    },

    showEmptyState(message = 'Ничего не найдено') {
        const grid = document.getElementById('grid');
        grid.innerHTML = `
            <div class="empty-state">
                <h3>${message}</h3>
                <p>Попробуйте изменить поисковый запрос</p>
            </div>
        `;
    },

    renderPager() {
        const pager = document.getElementById('pager');
        pager.innerHTML = '';
        const pagesCount = Math.max(1, Math.ceil(this.filtered.length / this.perPage));

        if (pagesCount <= 1) return;

        for (let i = 0; i < pagesCount; i++) {
            const btn = document.createElement('button');
            btn.textContent = i + 1;
            if (i === this.page) btn.classList.add('active');
            btn.addEventListener('click', () => {
                this.page = i;
                this.render();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pager.appendChild(btn);
        }
    },

    applySearch(query) {
        if (!query) {
            this.filtered = [...this.items];
        } else {
            const lowQuery = query.toLowerCase();
            this.filtered = this.items.filter(item =>
                item.name.toLowerCase().includes(lowQuery) ||
                item.UID.toLowerCase().includes(lowQuery) ||
                item.model.toString().toLowerCase().includes(lowQuery) ||
                (item.img && item.img.toString().toLowerCase().includes(lowQuery))
            );
        }
        this.page = 0;
        this.render();
    },

    openModal(item) {
        document.getElementById('modalTitle').textContent = item.name;
        document.getElementById('modal-uid').textContent = item.UID;
        document.getElementById('modal-model').textContent = item.model;
        
        const descElement = document.getElementById('modal-desc');
        if (item.description && item.description.trim() !== '') {
            descElement.textContent = item.description;
            descElement.style.fontStyle = 'normal';
        } else {
            descElement.textContent = 'Описание отсутствует';
            descElement.style.fontStyle = 'italic';
        }
        
        const modalImg = document.getElementById('modal-img');
        modalImg.src = this.getItemImage(item);
        modalImg.onerror = function() {
            this.src = ItemsManager.ICON_URL;
        };
        
        document.getElementById('overlay').style.display = 'flex';
    }
};