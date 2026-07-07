const skills = [
    { title: "PHP", desc: "Web Development with PHP System" },
    { title: "CSS", desc: "Designing User Interface with CSS" },
    { title: "JavaScript", desc: "Interactive Web Programming" },
    { title: "HTML", desc: "Structuring Web Content" },
];


const projects = [
    {
        title: "Official University Website",
        desc: "Full-stack website for the university including dashboard, user management, and student news.",
        tags: ["PHP", "MySQL", "JavaScript", "HTML", "CSS"],
        date: "2025-11-10",       // YYYY-MM-DD 
        category: "professional", // "professional" / "mini"
        team: "team",          // "team" / "individual"
        link: "https://hmsunej.site"
    },
    {
        title: "Portfolio Website",
        desc: "Personal portfolio built with vanilla HTML, CSS, JS.",
        tags: ["HTML", "CSS", "JavaScript"],
        date: "2026-06-01",
        category: "mini",
        team: "individual",
        link: 0,
    },
    {
        title: "Discord Bot",
        desc: "Competitive Matchmaking Bot for Discord using Discord.js library.",
        tags: ["Python", "Discord.js"],
        date: "2024-06-01",
        category: "mini",
        team: "individual",
        link: "https://github.com/justin7213/Ranked-Bedwars-Discord-Bot",
    },
];

const library = [
    {
        title: "Theme Switcher",
        desc: "A simple JavaScript snippet to toggle between light and dark themes on a website.",
        language: "Javascript",
        link: "https://github.com/justin7213/theme-switcher",
    }
]


function renderMarquee() {
    const track = document.getElementById('marqueeTrack');
    
    // Bikin HTML dari data
    const cardsHTML = skills.map(skill => `
        <div class="card">
            <h3>${skill.title}</h3>
            <p>${skill.desc}</p>
        </div>
    `).join('');

    // Duplikat 2x
    track.innerHTML = cardsHTML + cardsHTML;
}

renderMarquee();

// Projects filtering and pagination
let currentFilters = {
    category: "all",
    team: "all",
    sort: "newest"
};

let currentPage = 1;
const ITEMS_PER_PAGE = 6;

function renderProjects() {
    const container = document.getElementById('projectsContainer');

    // Filter dulu
    let filtered = projects.filter(p => {
        const matchCategory = currentFilters.category === "all" || p.category === currentFilters.category;
        const matchTeam = currentFilters.team === "all" || p.team === currentFilters.team;
        return matchCategory && matchTeam;
    });

    // Sort berdasarkan tanggal
    filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return currentFilters.sort === "newest" ? dateB - dateA : dateA - dateB;
    });

    // Hitung total halaman
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    // Kalau currentPage kelebihan (misal abis ganti filter jadi lebih sedikit), reset ke 1
    if (currentPage > totalPages) currentPage = 1;

    // Potong data sesuai halaman aktif
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

    // Render "no result"
    if (filtered.length === 0) {
        container.innerHTML = `<p class="no-result">No projects found.</p>`;
        renderPagination(0);
        return;
    }

    // Render kartu
    container.innerHTML = paginated.map(p => `
        <div class="project-card" onclick="window.open('${p.link || '#'}', '_blank')">
            <div class="project-header">
                <h3>${p.title}</h3>
                <span class="badge badge-${p.category}">${p.category}</span>
            </div>
            <p class="project-desc">${p.desc}</p>
            <div class="project-tags">
                ${p.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="project-meta">
                <span>${p.team === "team" ? "👥 Team" : "🧑 Individual"}</span>
                <span>${new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
            </div>
        </div>
    `).join('');

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let buttons = '';

    // Tombol Prev
    buttons += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">&laquo;</button>`;

    // Nomor halaman
    for (let i = 1; i <= totalPages; i++) {
        buttons += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }

    // Tombol Next
    buttons += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">&raquo;</button>`;

    paginationContainer.innerHTML = buttons;
}

function goToPage(page) {
    currentPage = page;
    renderProjects();
    document.getElementById('projectsContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setFilter(type, value) {
    currentFilters[type] = value;
    currentPage = 1; // reset ke halaman 1 tiap ganti filter
    updateActiveButtons();
    renderProjects();
}

function updateActiveButtons() {
    document.querySelectorAll('.filters .filter-group button').forEach(btn => {
        const type = btn.dataset.filterType;
        const value = btn.dataset.filterValue;
        
        if (currentFilters[type] === value) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

updateActiveButtons();
renderProjects();


//--------------------------------------------------------
//--------------------------------------------------------
//--------------------------------------------------------
//--------------------------------------------------------
//--------------------------------------------------------
//--------------------------------------------------------


// Library filtering and pagination
let currentLibraryFilters = {
    language: "all",
    search: ""
};

function renderLibrary() {
    const container = document.getElementById('libraryContainer');

    // Filter berdasarkan bahasa + search
    let filtered = library.filter(p => {
        const matchLanguage = currentLibraryFilters.language === "all" || p.language === currentLibraryFilters.language;
        const matchSearch = p.title.toLowerCase().includes(currentLibraryFilters.search) ||
                             p.desc.toLowerCase().includes(currentLibraryFilters.search);
        return matchLanguage && matchSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<p class="no-result">No resources found.</p>`;
        return;
    }

    container.innerHTML = filtered.map(p => `
        <div class="library-card" onclick="window.open('${p.link || '#'}', '_blank')">
            <div class="library-header">
                <h3>${p.title}</h3>
                <span class="badge badge-${p.language}">${p.language}</span>
            </div>
            <p class="library-desc">${p.desc}</p>
        </div>
    `).join('');
}

function setLibraryFilter(type, value) {
    currentLibraryFilters[type] = value;
    updateActiveLibraryButtons();
    renderLibrary();
}
function updateActiveLibraryButtons() {
    document.querySelectorAll('.library-filters .filter-group button').forEach(btn => {
        const type = btn.dataset.filterType;
        const value = btn.dataset.filterValue;
        
        if (currentLibraryFilters[type] === value) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function handleLibrarySearch(value) {
    currentLibraryFilters.search = value.toLowerCase().trim();
    renderLibrary();
}

updateActiveLibraryButtons();
renderLibrary();