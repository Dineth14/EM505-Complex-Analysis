/**
 * Sidebar navigation — builds nav links, handles hamburger toggle, marks active page.
 */
(function () {
    const chapters = [
        { num: 1, title: 'Complex Numbers & the Complex Plane', path: 'chapters/1-complex-numbers/index.html' },
        { num: 2, title: 'Analytic Functions', path: 'chapters/2-analytic-functions/index.html' },
        { num: 3, title: 'Complex Integration', path: 'chapters/3-complex-integration/index.html' },
        { num: 4, title: 'Series & Residues', path: 'chapters/4-series-residues/index.html' },
        { num: 5, title: 'Conformal Mappings', path: 'chapters/5-conformal-mappings/index.html' },
        { num: 6, title: 'Applications', path: 'chapters/6-applications/index.html' },
    ];

    const extras = [
        { icon: '📝', title: 'Coursework', path: 'coursework/index.html' },
        { icon: '📖', title: 'Reference', path: 'reference/index.html' },
    ];

    function getRoot() {
        const loc = window.location.pathname;
        if (loc.includes('/chapters/')) return '../../';
        if (loc.includes('/coursework/') || loc.includes('/reference/')) return '../';
        return '';
    }

    function buildNav() {
        const sidebar = document.querySelector('.sidebar-nav');
        if (!sidebar) return;
        const root = getRoot();
        const currentPath = window.location.pathname;

        /* Home link */
        const home = document.createElement('a');
        home.href = root + 'index.html';
        home.innerHTML = '<span class="chapter-num" aria-hidden="true">⌂</span> Home';
        if (currentPath.endsWith('index.html') && !currentPath.includes('/chapters/') &&
            !currentPath.includes('/coursework/') && !currentPath.includes('/reference/')) {
            home.classList.add('active');
        }
        sidebar.appendChild(home);

        /* Divider */
        const d1 = document.createElement('div');
        d1.className = 'nav-divider';
        sidebar.appendChild(d1);

        /* Chapters */
        chapters.forEach(ch => {
            const a = document.createElement('a');
            a.href = root + ch.path;
            a.innerHTML = `<span class="chapter-num" aria-hidden="true">${ch.num}</span> ${ch.title}`;
            a.setAttribute('aria-label', `Chapter ${ch.num}: ${ch.title}`);
            if (currentPath.includes(ch.path.split('/')[1])) a.classList.add('active');
            sidebar.appendChild(a);
        });

        /* Divider */
        const d2 = document.createElement('div');
        d2.className = 'nav-divider';
        sidebar.appendChild(d2);

        /* Extras */
        extras.forEach(ex => {
            const a = document.createElement('a');
            a.href = root + ex.path;
            a.innerHTML = `<span class="chapter-num" aria-hidden="true">${ex.icon}</span> ${ex.title}`;
            if (currentPath.includes(ex.path.split('/')[0])) a.classList.add('active');
            sidebar.appendChild(a);
        });
    }

    function initHamburger() {
        const btn = document.querySelector('.hamburger');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.overlay');
        if (!btn || !sidebar) return;

        btn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('active');
            btn.setAttribute('aria-expanded', sidebar.classList.contains('open'));
        });

        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            });
        }

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        buildNav();
        initHamburger();
    });
})();
