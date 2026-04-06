# Tetris PoC - Claude Code x GitHub Integration

[![CI Pipeline](https://github.com/nadircan/tetris-poc/actions/workflows/ci.yml/badge.svg)](https://github.com/nadircan/tetris-poc/actions/workflows/ci.yml)
[![Deploy](https://github.com/nadircan/tetris-poc/actions/workflows/deploy.yml/badge.svg)](https://github.com/nadircan/tetris-poc/actions/workflows/deploy.yml)
[![Release](https://github.com/nadircan/tetris-poc/actions/workflows/release.yml/badge.svg)](https://github.com/nadircan/tetris-poc/actions/workflows/release.yml)
[![GitHub Pages](https://img.shields.io/badge/demo-live-brightgreen)](https://nadircan.github.io/tetris-poc/)
[![Issues](https://img.shields.io/github/issues/nadircan/tetris-poc)](https://github.com/nadircan/tetris-poc/issues)

**Live Demo:** https://nadircan.github.io/tetris-poc/

This is a Proof of Concept demonstrating Claude Code's autonomous GitHub integration. A Tetris game (HTML/CSS/JS) is used to showcase a full development loop: issue creation, branching, coding, CI/CD, PR, self-review, auto-deploy, and release.

---

## Features

### Game
- **Tetris mechanics** - 7 classic tetrominos (I, O, T, S, Z, J, L)
- **Keyboard controls** - Move, rotate, soft drop, hard drop
- **Wall kick** - Rotation support near walls
- **Line clearing** - Score multiplier for 1/2/3/4 lines (100/300/500/800 x level)
- **Level system** - Level up every 10 lines, increasing speed
- **Score-based speed** - 11-tier threshold table for progressive difficulty
- **Dark / Light mode** - Theme toggle with localStorage persistence
- **Game over overlay** - Modern design with replay option
- **Responsive layout** - Mobile-friendly

### DevOps & Automation
- **CI Pipeline** - HTML validation, JS syntax check, file structure validation on every PR/push
- **GitHub Pages** - Auto-deploy on every merge to main (free hosting)
- **Auto-Release** - Tag push generates categorized changelog and GitHub Release
- **Issue Bot** - Auto-comments on new issues (detects `claude` label)
- **Branch Protection** - Merge blocked until CI passes
- **Project Board** - Kanban board with Todo / In Progress / Done columns

---

## Workflow

```
Create Issue → Branch → Code → Commit/Push → PR → Self-Review → Merge
                                                                ↓
                                                      CI Pipeline (lint)
                                                                ↓
                                                      Auto Deploy (Pages)
                                                                ↓
                                                      Issue Auto-Closes
```

### Controls

| Key | Action |
|-----|--------|
| ← → | Move |
| ↑ | Rotate |
| ↓ | Soft drop |
| Space | Hard drop |

---

## File Structure

```
tetris-poc/
├── .github/
│   └── workflows/
│       ├── ci.yml           # CI pipeline (lint, validation)
│       ├── deploy.yml       # GitHub Pages auto-deploy
│       ├── release.yml      # Auto-release on tag push
│       └── issue-bot.yml    # Auto-comment on new issues
├── CLAUDE.md                # Workflow rules for Claude Code
├── README.md                # This file
├── index.html               # Main game page
├── style.css                # Styles (dark/light theme)
└── game.js                  # Game logic
```

---

## Usage

### Play the Game
1. Open the [Live Demo](https://nadircan.github.io/tetris-poc/)
2. Click **Baslat** (Start)
3. Control pieces with keyboard

### Add a New Feature
1. Create a new issue with the `claude` label
2. Issue bot auto-comments
3. Claude Code picks it up, creates a branch, implements it
4. PR opened with self-review
5. Merge after CI passes
6. Deploy triggers automatically

### Create a Release
```bash
git tag v1.0.0
git push origin v1.0.0
```
Auto-generates a categorized GitHub Release with changelog.

---

## Technologies

- **Frontend:** HTML5, CSS3 (Custom Properties, Grid, Flexbox), Vanilla JavaScript
- **Fonts:** Inter, JetBrains Mono (Google Fonts)
- **CI/CD:** GitHub Actions
- **Hosting:** GitHub Pages (free)
- **Project Management:** GitHub Projects (Kanban board)

---

## Replicate This Workflow in Your Own Project

This guide lets you copy the entire Claude Code + GitHub automation setup into any project. Follow each step in order.

### Prerequisites

```bash
# 1. Install GitHub CLI
brew install gh

# 2. Authenticate (approve all scopes: repo, project)
gh auth login

# 3. Configure git
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# 4. Verify
gh auth status
gh api user --jq '.login'
```

### Step 1: Create Repository

```bash
mkdir my-project && cd my-project
git init

# Create basic project files (adapt to your project)
touch index.html style.css app.js

# Create GitHub repo and push
gh repo create my-project --public --source=. --push
```

### Step 2: Create Labels

```bash
gh label create "claude" --color "1D76DB" --description "Tasks for Claude Code to work on"
gh label create "feature" --color "0E8A16" --description "New feature"
gh label create "bug" --color "D73A4A" --description "Bug fix"
gh label create "enhancement" --color "A2EEEF" --description "Enhancement"
```

### Step 3: Create Project Board

```bash
gh project create --title "My Project Board" --owner @me
```

The board comes with default columns: **Todo**, **In Progress**, **Done**.

> **Note:** Save the project number from the output (e.g. `1`). You'll need it later.

### Step 4: Create CLAUDE.md

Create `CLAUDE.md` in your project root. This file tells Claude Code the workflow rules:

```markdown
# My Project - Claude Code Workflow

## Project Summary
Brief description of your project.

## Workflow Rules
1. Only pick up open issues with the `claude` label
2. Create a new branch for each issue: feature/issue-{N}-{short-desc} or fix/issue-{N}-{short-desc}
3. Never push directly to main
4. Use conventional commits: feat:, fix:, chore:, docs:, etc.
5. Open a PR with "Closes #N" to link the issue
6. Add a self-review comment on the PR (changes, decisions, concerns)
7. Update the issue with a comment

## Git Conventions
- Branch: feature/issue-{N}-{desc} or fix/issue-{N}-{desc}
- Commit: feat: description or fix: description
- PR Title: [Issue #{N}] Short description

## File Structure
- List your project files here

## Project Board
- Project Number: X
- Owner: @me
- Status: Todo → In Progress → Done
```

### Step 5: Create GitHub Actions Workflows

Create `.github/workflows/` directory and add these files:

#### `.github/workflows/ci.yml` — CI Pipeline

Runs on every PR and push to main. Adapt the validation steps to your project.

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    name: Lint & Validate
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Check file structure
        run: |
          echo "::group::File Structure Check"
          missing=0
          for f in index.html style.css app.js; do  # <-- adapt file list
            if [ -f "$f" ]; then
              echo "  [OK] $f"
            else
              echo "  [FAIL] $f missing!"
              missing=1
            fi
          done
          if [ $missing -eq 1 ]; then
            echo "::error::Required files are missing!"
            exit 1
          fi
          echo "::endgroup::"

      - name: HTML Validate
        run: npx --yes html-validate index.html  # <-- adapt

      - name: JS Syntax Check
        run: node --check app.js  # <-- adapt

      - name: File sizes
        run: |
          echo "::group::File Sizes"
          for f in index.html style.css app.js; do
            echo "  $f: $(wc -c < $f) bytes"
          done
          echo "  Total: $(cat index.html style.css app.js | wc -c) bytes"
          echo "::endgroup::"
```

#### `.github/workflows/deploy.yml` — GitHub Pages Auto-Deploy

Deploys to GitHub Pages on every merge to main.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

> **Important:** After merging this workflow, you must enable GitHub Pages:
> 1. Go to repo **Settings → Pages**
> 2. Under **Source**, select **GitHub Actions**
>
> Or via CLI:
> ```bash
> gh api repos/{owner}/{repo}/pages --method POST -f source.branch=main -f source.path=/ -f build_type=workflow
> ```

#### `.github/workflows/release.yml` — Auto-Release on Tag

Creates a categorized GitHub Release when you push a tag.

```yaml
name: Auto Release

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: write

jobs:
  release:
    name: Create Release
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get previous tag
        id: prev-tag
        run: |
          PREV=$(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo "")
          echo "prev=$PREV" >> $GITHUB_OUTPUT

      - name: Generate changelog
        id: changelog
        run: |
          if [ -n "${{ steps.prev-tag.outputs.prev }}" ]; then
            LOG=$(git log ${{ steps.prev-tag.outputs.prev }}..HEAD --pretty=format:"- %s (%h)" --no-merges)
          else
            LOG=$(git log --pretty=format:"- %s (%h)" --no-merges -20)
          fi

          FEAT=$(echo "$LOG" | grep -i "^- feat" || true)
          FIX=$(echo "$LOG" | grep -i "^- fix" || true)
          CHORE=$(echo "$LOG" | grep -i "^- chore\|^- ci\|^- docs\|^- style\|^- refactor" || true)
          OTHER=$(echo "$LOG" | grep -v -i "^- feat\|^- fix\|^- chore\|^- ci\|^- docs\|^- style\|^- refactor" || true)

          {
            echo "body<<EOF"
            echo "## What Changed?"
            echo ""
            if [ -n "$FEAT" ]; then echo "### New Features"; echo "$FEAT"; echo ""; fi
            if [ -n "$FIX" ]; then echo "### Bug Fixes"; echo "$FIX"; echo ""; fi
            if [ -n "$CHORE" ]; then echo "### Maintenance"; echo "$CHORE"; echo ""; fi
            if [ -n "$OTHER" ]; then echo "### Other"; echo "$OTHER"; echo ""; fi
            echo "---"
            echo ""
            echo "**Full diff**: https://github.com/{owner}/{repo}/compare/${{ steps.prev-tag.outputs.prev }}...${{ github.ref_name }}"
            echo "EOF"
          } >> $GITHUB_OUTPUT

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          name: ${{ github.ref_name }}
          body: ${{ steps.changelog.outputs.body }}
          draft: false
          prerelease: ${{ contains(github.ref_name, '-rc') || contains(github.ref_name, '-beta') }}
```

> **Replace** `{owner}/{repo}` in the diff URL with your actual GitHub owner and repo name.

#### `.github/workflows/issue-bot.yml` — Issue Auto-Comment

Posts a comment on every new issue. Detects the `claude` label for workflow-aware messages.

```yaml
name: Issue Bot

on:
  issues:
    types: [opened]

jobs:
  comment:
    name: Auto Comment
    runs-on: ubuntu-latest
    permissions:
      issues: write

    steps:
      - name: Add comment
        uses: actions/github-script@v7
        with:
          script: |
            const label = context.payload.issue.labels?.map(l => l.name) || [];
            const hasClaude = label.includes('claude');

            let body;
            if (hasClaude) {
              body = `Thanks! This issue is labeled \`claude\` and will be processed automatically.\n\n` +
                `Claude Code will:\n` +
                `1. Analyze the requirements\n` +
                `2. Create a feature/fix branch\n` +
                `3. Implement the solution\n` +
                `4. Open a PR with self-review\n` +
                `5. CI + Deploy will trigger\n\n` +
                `Please wait, starting soon!`;
            } else {
              body = `Thanks for the issue! The team will review it shortly.\n\n` +
                `> _This comment was auto-generated._`;
            }

            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: body
            });
```

### Step 6: Initial Commit

```bash
git add .
git commit -m "chore: initial project setup with CLAUDE.md and workflows"
git push origin main
```

### Step 7: Enable Branch Protection

Require CI to pass before merging into main:

```bash
gh api repos/{owner}/{repo}/branches/main/protection --method PUT --input - <<'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Lint & Validate"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null
}
EOF
```

> **Replace** `{owner}/{repo}` with your actual values.
> The context name `"Lint & Validate"` must match your CI job name exactly.

### Step 8: Enable GitHub Pages

```bash
gh api repos/{owner}/{repo}/pages --method POST \
  -f source.branch=main \
  -f source.path=/ \
  -f build_type=workflow
```

### Step 9: Create Issues and Start Working

Create issues with the `claude` label and add them to your board:

```bash
# Create an issue
gh issue create \
  --title "[feature] Add user authentication" \
  --body "## Task\nImplement login/logout.\n\n## Labels\nfeature, claude" \
  --label "claude,feature"

# Add to project board (use your project number)
gh project item-add 1 --owner @me --url "https://github.com/{owner}/{repo}/issues/{number}"
```

### Step 10: Prompt Claude Code to Process Issues

Tell Claude Code:

```
List all open issues with the "claude" label. For each issue, in order:
1. Move it to "In Progress" on the project board
2. Create a branch: feature/issue-{N}-{desc} or fix/issue-{N}-{desc}
3. Implement the solution
4. Commit with conventional commit format
5. Push and open a PR with "Closes #N"
6. Add a self-review comment on the PR
7. Merge the PR
8. Move the issue to "Done" on the board
9. Proceed to the next issue
```

### Step 11: Create a Release

When ready to release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

This triggers the auto-release workflow which generates a categorized changelog and creates a GitHub Release.

---

## Checklist: Is Everything Working?

- [ ] `gh auth status` shows authenticated
- [ ] `claude`, `feature`, `bug`, `enhancement` labels exist
- [ ] Project board exists with Todo / In Progress / Done columns
- [ ] `CLAUDE.md` is in the repo root
- [ ] All 4 workflow files exist under `.github/workflows/`
- [ ] GitHub Pages is enabled (Source: GitHub Actions)
- [ ] Branch protection requires CI to pass
- [ ] Creating an issue with `claude` label triggers the bot comment
- [ ] Opening a PR triggers the CI pipeline
- [ ] Merging a PR triggers the deploy pipeline
- [ ] Pushing a tag triggers the release pipeline
- [ ] Live site at `https://{owner}.github.io/{repo}/` is accessible
