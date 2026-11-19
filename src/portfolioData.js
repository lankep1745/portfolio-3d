/**
 * =========================================================================
 * CENTRALIZED PORTFOLIO DATA CONFIGURATION
 * Maulana Ahmad Khairunnas (Lana) - Full-Stack Developer & Local AI Architect
 * =========================================================================
 */

export const PORTFOLIO_DATA = {
  // Personal Info
  personal: {
    name: "MAULANA AHMAD KHAIRUNNAS",
    nickname: "LANA",
    role: "Full-Stack Developer & Local AI Architect",
    location: "Bogor, ID // Politeknik IDN",
    availability: "Tersedia untuk Kolaborasi & Proyek Full-Stack / AI",
    bio: "Mahasiswa Teknologi Rekayasa Perangkat Lunak di Politeknik IDN Bogor sekaligus Full-Stack Developer spesialis Laravel dan Tailwind CSS. Aktif sebagai IT Pemateri dan Peer Educator, dengan fokus membangun sistem web modern serta integrasi Local AI menggunakan Ollama di macOS tanpa ketergantungan biaya API cloud.",
    quote: "Membangun aplikasi web full-stack berpresisi tinggi (Laravel, React, Tailwind CSS) serta arsitektur Local AI (Ollama di macOS) yang cepat, privat, dan siap produksi.",
    heroBadge: "00 // EVENT HORIZON // BOGOR, INDONESIA",
    hudBrand: "LANA // PORTFOLIO",
    hudSub: "BOGOR, ID // POLITEKNIK IDN",
    cvUrl: "/CV_Maulana_Ahmad_Khairunnas.pdf",
    email: "cyberjazary@gmail.com",
    stats: [
      { label: "FEATURED FULL-STACK & AI", value: "4+" },
      { label: "LARAVEL, REACT & LOCAL AI", value: "Full-Stack" },
      { label: "IT PEMATERI @ IDN BOGOR", value: "Peer Educator" },
    ],
  },

  // 6 Cinematic Stations Configuration
  stations: [
    { id: "00", name: "ORIGIN", label: "Event Horizon", path: "Origin" },
    { id: "01", name: "IDENTITY", label: "Core Profile", path: "Identity" },
    { id: "02", name: "WORKS I", label: "Flagship Systems", path: "Works I" },
    { id: "03", name: "WORKS II", label: "Specialized Labs", path: "Works II" },
    { id: "04", name: "ARSENAL", label: "Tech & Shell", path: "Arsenal" },
    { id: "05", name: "SIGNAL", label: "Establish Comms", path: "Signal" },
  ],

  // 4 Featured Projects
  projects: [
    {
      id: "project-mspace",
      title: "M-Space",
      category: "AI Business Calculator & Financial Planner",
      year: "2026",
      badge: "FEATURED AI",
      summary: "Aplikasi web kalkulator bisnis dan simulasi perencanaan keuangan cerdas yang menghubungkan backend Laravel dengan model Local AI Ollama di macOS.",
      tags: ["Laravel", "Ollama (Local AI)", "Tailwind CSS", "MySQL", "macOS"],
      stats: {
        architecture: "Local AI Engine",
        privacy: "100% Offline",
        apiCost: "Rp 0 (No Cloud API)",
      },
      problem: "Pelaku usaha sering kesulitan melakukan simulasi finansial cerdas tanpa biaya langganan cloud AI yang mahal dan risiko privasi data.",
      solution: "Membangun aplikasi web kalkulator bisnis dan perencanaan keuangan yang menghubungkan backend Laravel dengan model Local AI Ollama di macOS.",
      impact: [
        "Analisis finansial berjalan 100% lokal, privat, latensi rendah, dan bebas biaya API berulang.",
        "Pemrosesan cerdas prompt bisnis tanpa transmisi data sensitif ke server luar.",
        "Integrasi mulus antara ekosistem Laravel dan inferensi Ollama lokal.",
      ],
      demoUrl: "#",
      githubUrl: "https://github.com/lankep1745",
      imageTheme: "linear-gradient(135deg, rgba(245,176,65,0.2) 0%, rgba(3,4,8,0.9) 100%)",
    },
    {
      id: "project-community-admin",
      title: "Community Admin Portal",
      category: "Role-Based Management & QRIS System",
      year: "2026",
      badge: "PRODUCTION",
      summary: "Portal administrasi komunitas modern dengan kontrol akses berbasis peran (RBAC), tema dinamis dark/light, dan integrasi pembayaran digital QRIS.",
      tags: ["Laravel", "Tailwind CSS", "MySQL", "QRIS", "Role-Based Auth"],
      stats: {
        security: "RBAC Shield",
        payment: "Digital QRIS",
        uiTheme: "Dark / Light Mode",
      },
      problem: "Pengelolaan administrasi dan pencatatan iuran komunitas secara manual rawan kesalahan dan lambat diverifikasi.",
      solution: "Merancang portal administrasi komunitas dengan role-based access control, dukungan dark/light mode, dan integrasi pembayaran digital QRIS.",
      impact: [
        "Mempermudah transparansi kas dan mempercepat proses administrasi harian komunitas.",
        "Verifikasi iuran otomatis melalui antarmuka pencatatan QRIS yang terstruktur.",
        "Pengalaman pengguna mulus dengan antarmuka adaptif berbasis Tailwind CSS.",
      ],
      demoUrl: "#",
      githubUrl: "https://github.com/lankep1745",
      imageTheme: "linear-gradient(135deg, rgba(255,210,125,0.2) 0%, rgba(3,4,8,0.9) 100%)",
    },
    {
      id: "project-edugame-hub",
      title: "20-in-1 Children's EduGame Hub",
      category: "Interactive Educational Web Platform",
      year: "2026",
      badge: "WEB PLATFORM",
      summary: "Platform web edukasi interaktif komprehensif berisi 20 mini-game anak dengan performa cepat, responsif, dan siap akses lintas perangkat via Netlify.",
      tags: ["React", "Tailwind CSS", "Laravel", "MySQL", "Netlify"],
      stats: {
        modules: "20 Mini-Games",
        deployment: "Netlify Global",
        platform: "Cross-Device Web",
      },
      problem: "Anak-anak membutuhkan media belajar digital yang menyenangkan, interaktif, dan mudah diakses langsung dari browser tanpa instalasi rumit.",
      solution: "Mengembangkan platform web edukasi berisi 20 mini-game interaktif dengan antarmuka ramah anak yang cepat dan responsif, di-deploy ke Netlify.",
      impact: [
        "Menyediakan 20 modul belajar interaktif dalam satu platform ringan yang siap diakses lintas perangkat.",
        "Waktu muat instan dan transisi game lancar berbasis React dan Tailwind CSS.",
        "Mempermudah guru dan orang tua dalam memberikan konten edukasi interaktif berkualitas.",
      ],
      demoUrl: "#",
      githubUrl: "https://github.com/lankep1745",
      imageTheme: "linear-gradient(135deg, rgba(245,176,65,0.25) 0%, rgba(10,12,20,0.95) 100%)",
    },
    {
      id: "project-voice-assistant",
      title: "macOS Desktop Voice Assistant",
      category: "Local Voice Automation Tool",
      year: "2026",
      badge: "AUTOMATION TOOL",
      summary: "Asisten suara desktop pintar berbasis Python di macOS dengan sintesis Text-to-Speech lokal dan integrasi AppleScript untuk kontrol Spotify & sistem.",
      tags: ["Python", "Local TTS", "AppleScript", "macOS", "Spotify API"],
      stats: {
        connectivity: "100% Offline",
        osTarget: "macOS Native",
        integration: "Spotify & System",
      },
      problem: "Asisten suara berbasis cloud membutuhkan koneksi internet stabil dan sering memiliki jeda respons untuk kontrol aplikasi lokal.",
      solution: "Membuat asisten suara desktop kustom di macOS menggunakan Python dengan pemrosesan Text-to-Speech lokal dan integrasi AppleScript untuk kontrol Spotify.",
      impact: [
        "Kontrol media dan perintah desktop instan secara offline dengan latensi minimal di macOS.",
        "Otomatisasi pemutaran musik dan navigasi sistem hands-free tanpa koneksi internet.",
        "Arsitektur modular Python yang mudah diperluas dengan subroutine lokal baru.",
      ],
      demoUrl: "#",
      githubUrl: "https://github.com/lankep1745",
      imageTheme: "linear-gradient(135deg, rgba(245,176,65,0.18) 0%, rgba(3,4,8,0.92) 100%)",
    },
  ],

  // Tech Arsenal (Grouped by domain)
  arsenal: {
    frontend: [
      { name: "React", level: "Advanced", desc: "Component architecture, hooks, state management, SPA" },
      { name: "Tailwind CSS", level: "Expert", desc: "Responsive UI, modern layouts, micro-interactions, dark mode" },
      { name: "JavaScript (ES6+)", level: "Advanced", desc: "Asynchronous programming, DOM manipulation, APIs" },
      { name: "HTML5 / CSS3", level: "Master", desc: "Semantic structure, responsive web design, modern standards" },
    ],
    backend: [
      { name: "Laravel", level: "Expert", desc: "Eloquent ORM, authentication, RESTful APIs, Blade, routing" },
      { name: "PHP", level: "Advanced", desc: "Modern object-oriented PHP, MVC patterns, secure backends" },
      { name: "MySQL", level: "Advanced", desc: "Relational database schema design, indexing, query optimization" },
      { name: "Python", level: "Proficient", desc: "Local automation, AppleScript hooks, scripting & TTS" },
    ],
    toolsAndCloud: [
      { name: "Ollama (Local AI)", level: "Specialist", desc: "Local LLM orchestration on macOS (M1 Pro), private AI inference" },
      { name: "Laravel Herd", level: "Master", desc: "Ultra-fast local PHP & Laravel development environment on macOS" },
      { name: "Git & GitHub", level: "Advanced", desc: "Version control, feature branching, collaborative workflow" },
      { name: "Netlify & VS Code", level: "Advanced", desc: "Continuous deployment, modern extensions, developer productivity" },
    ],
  },

  // Interactive Terminal Defaults & Scripting
  terminal: {
    prompt: "lana@m1pro ~ %",
    motd: [
      "LANA WORKSTATION [Apple Silicon M1 Pro - macOS]",
      "Status: Online // Bogor, ID // Politeknik IDN",
      "Type 'help' to review available terminal subroutines.",
    ],
    commands: {
      help: "Commands: 'help', 'about', 'projects', 'arsenal', 'contact', 'stats', 'clear'",
      about: "Maulana Ahmad Khairunnas (Lana): Mahasiswa TRPL di Politeknik IDN Bogor & Full-Stack Developer (Laravel, React, Tailwind CSS) serta arsitek Local AI (Ollama di macOS).",
      projects: "1. M-Space (Laravel + Ollama Local AI) | 2. Community Admin Portal (QRIS + RBAC) | 3. 20-in-1 EduGame Hub (React + Netlify) | 4. macOS Voice Assistant (Python + AppleScript)",
      arsenal: "Core: Laravel, React, Tailwind CSS, PHP, MySQL, Python, Ollama (Local AI), Laravel Herd, Git, Netlify.",
      stats: "Featured Projects: 4+ | Focus: Full-Stack & Local AI | Role: IT Pemateri & Peer Educator @ Politeknik IDN",
      contact: "Email: cyberjazary@gmail.com | GitHub: github.com/lankep1745 | LinkedIn: linkedin.com/in/maulana-khairunnas",
    },
  },

  // Social Links
  socials: [
    { label: "GITHUB", url: "https://github.com/lankep1745", icon: "Github" },
    { label: "LINKEDIN", url: "https://linkedin.com/in/maulana-khairunnas", icon: "Linkedin" },
    { label: "YOUTUBE", url: "https://youtube.com/@Cyberman-L19", icon: "Youtube" },
    { label: "INSTAGRAM", url: "https://instagram.com/san_trinaum17", icon: "Instagram" },
  ],
};
