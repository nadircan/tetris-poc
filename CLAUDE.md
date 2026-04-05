# Tetris PoC - Claude Code Workflow

## Proje Ozeti
Bu proje Claude Code'un GitHub entegrasyonunu demonstrate eden bir PoC'dir.
HTML/CSS/JS ile basit bir Tetris oyunu gelistirilmektedir.

## Workflow Kurallari
1. Sadece `claude` label'li open issue'lari al
2. Her issue icin yeni branch ac: feature/issue-{N}-kısa-aciklama veya fix/issue-{N}-kısa-aciklama
3. main'e asla direkt push yapma
4. Her commit conventional commits formatinda olsun
5. PR ac, "Closes #N" ile issue'yu bagla
6. PR'a self-review yorumu birak (yapilanlar, tasarim kararlari, potansiyel sorunlar)
7. Issue'yu comment ile guncelle

## Git Conventions
- Branch: feature/issue-{N}-{desc} veya fix/issue-{N}-{desc}
- Commit: feat: description veya fix: description
- PR Title: [Issue #{N}] Kisa aciklama

## Dosya Yapisi
- index.html - Ana oyun sayfasi
- style.css - Tum stiller
- game.js - Oyun mantigi (tum oyun kodu burada)

## Proje Board
- Project Number: 1
- Owner: @me
- Status: Todo → In Progress → Done
