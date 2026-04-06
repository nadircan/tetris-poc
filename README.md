# Tetris PoC - Claude Code x GitHub Integration

[![CI Pipeline](https://github.com/nadircan/tetris-poc/actions/workflows/ci.yml/badge.svg)](https://github.com/nadircan/tetris-poc/actions/workflows/ci.yml)
[![Deploy](https://github.com/nadircan/tetris-poc/actions/workflows/deploy.yml/badge.svg)](https://github.com/nadircan/tetris-poc/actions/workflows/deploy.yml)
[![Release](https://github.com/nadircan/tetris-poc/actions/workflows/release.yml/badge.svg)](https://github.com/nadircan/tetris-poc/actions/workflows/release.yml)
[![GitHub Pages](https://img.shields.io/badge/demo-live-brightgreen)](https://nadircan.github.io/tetris-poc/)
[![Issues](https://img.shields.io/github/issues/nadircan/tetris-poc)](https://github.com/nadircan/tetris-poc/issues)

**Canli Demo:** https://nadircan.github.io/tetris-poc/

Bu proje Claude Code'un GitHub entegrasyonunu demonstrate eden bir Proof of Concept'tir. HTML/CSS/JS ile gelistirilen bir Tetris oyunu uzerinden tam bir otonom gelistirme workflow'u gostermektedir.

---

## Ozellikler

### Oyun
- **Tetris mekaniği** - 7 klasik tetromino (I, O, T, S, Z, J, L)
- **Klavye kontrolleri** - Hareket, donus, soft drop, hard drop
- **Wall kick** - Duvar kenarinda donus destegi
- **Satir temizleme** - 1/2/3/4 satir icin skor carpani (100/300/500/800 x seviye)
- **Seviye sistemi** - Her 10 satirda seviye atlama, hiz artisi
- **Skor bazli hiz** - 11 kademeli esik tablosu ile giderek artan zorluk
- **Dark / Light mode** - Tema toggle, localStorage ile kalici tercih
- **Game over overlay** - Modern tasarim, tekrar oyna secenegi
- **Responsive tasarim** - Mobil uyumlu layout

### DevOps & Otomasyon
- **CI Pipeline** - Her PR ve push'ta HTML validation, JS syntax check, dosya yapi kontrolu
- **GitHub Pages** - Her merge sonrasi otomatik deploy, ucretsiz hosting
- **Auto-Release** - Tag push'ta otomatik changelog ve GitHub Release olusturma
- **Issue Bot** - Yeni issue'ya otomatik yorum (`claude` label algilama)
- **Branch Protection** - CI basarili olmadan merge yapilamaz
- **Project Board** - Todo / In Progress / Done sütunlu Kanban board

---

## Workflow

```
Issue Olustur → Branch Ac → Kod Yaz → Commit/Push → PR Ac → Self-Review → Merge
                                                                        ↓
                                                              CI Pipeline (lint)
                                                                        ↓
                                                              Auto Deploy (Pages)
                                                                        ↓
                                                              Issue Otomatik Kapanir
```

### Kontroller

| Tus | Aksiyon |
|-----|---------|
| ← → | Hareket |
| ↑ | Donus |
| ↓ | Hizli dusus (soft drop) |
| Space | Sert dusus (hard drop) |

---

## Dosya Yapisi

```
tetris-poc/
├── .github/
│   └── workflows/
│       ├── ci.yml           # CI pipeline (lint, validation)
│       ├── deploy.yml       # GitHub Pages auto-deploy
│       ├── release.yml      # Auto-release on tag push
│       └── issue-bot.yml    # Auto-comment on new issues
├── CLAUDE.md                # Workflow kurallari
├── README.md                # Bu dosya
├── index.html               # Ana oyun sayfasi
├── style.css                # Stiller (dark/light tema)
└── game.js                  # Oyun mantigi
```

---

## Kullanim

### Oyunu Oynamak
1. [Canli Demo](https://nadircan.github.io/tetris-poc/) adresini acin
2. **Baslat** butonuna tiklayin
3. Klavye ile parcalari kontrol edin

### Yeni Ozellik Eklemek
1. Yeni bir issue acin, `claude` label'i ekleyin
2. Issue bot otomatik yorum birakir
3. Claude Code issue'yu alir, branch acar, implement eder
4. PR acilir, self-review yapilir
5. CI basarili olursa merge edilir
6. Deploy otomatik tetiklenir

### Release Olusturmak
```bash
git tag v1.0.0
git push origin v1.0.0
```
Tag push ile otomatik GitHub Release ve changelog olusturulur.

---

## Teknolojiler

- **Frontend:** HTML5, CSS3 (Custom Properties, Grid, Flexbox), Vanilla JavaScript
- **Fontlar:** Inter, JetBrains Mono (Google Fonts)
- **CI/CD:** GitHub Actions
- **Hosting:** GitHub Pages (ucretsiz)
- **Proje Yonetimi:** GitHub Projects (Kanban board)
