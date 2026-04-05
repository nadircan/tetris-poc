# Tetris PoC - Claude Code x GitHub Integration

Bu proje Claude Code'un GitHub Issues, Project Board ve PR'lerle otonom çalışabilmesini demonstrate eden bir Proof of Concept'tir.

HTML/CSS/JS ile basit bir Tetris oyunu geliştirilmektedir.

## Workflow

1. GitHub Issues ile tasklar olusturulur (`claude` label)
2. Claude Code issue'lari alir, branch acar, implement eder
3. PR acilir ve self-review yapilir
4. Kullanici PR'lari merge eder, issue'lar otomatik kapanir

## Dosya Yapisi

- `index.html` - Ana oyun sayfasi
- `style.css` - Stiller
- `game.js` - Oyun mantigi
