# Git Commands Cheat Sheet

Quick reference for the most common Git commands you'll need.

---

## ✅ Git is Already Installed on Your System!

Your current Git version: **2.50.1 (Apple Git-155)**

---

## 🎯 Common Git Commands

### 1. Check Your Status
```bash
git status
```
Shows what files have changed and their status.

### 2. Add Files to Git
```bash
# Add a specific file
git add filename.html

# Add all files
git add .

# Add all HTML files
git add *.html
```

### 3. Commit Changes
```bash
# Commit with a message
git commit -m "Your descriptive message here"

# Examples:
git commit -m "Updated quiz styles"
git commit -m "Fixed mobile layout"
git commit -m "Added new questions"
```

### 4. View History
```bash
# See all commits
git log

# See brief history
git log --oneline

# See recent commits
git log -5
```

### 5. View Differences
```bash
# See what changed
git diff

# See specific file changes
git diff styles.css
```

---

## 🌐 Working with GitHub

### Create a New Repository on GitHub

1. Go to https://github.com
2. Click the **"+"** icon → **"New repository"**
3. Name it (e.g., `german-vocab-quiz`)
4. **Don't** initialize with README (you already have files)
5. Click **"Create repository"**

### Connect Your Local Project to GitHub

After creating the repository on GitHub, run these commands:

```bash
# Make sure you're in your project folder
cd german-vocab-quiz

# Add GitHub as remote origin
git remote add origin https://github.com/YOUR-USERNAME/german-vocab-quiz.git

# Push your code to GitHub
git push -u origin main
```

**Replace `YOUR-USERNAME` with your actual GitHub username!**

### Push Future Changes

```bash
# Add changed files
git add .

# Commit the changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

---

## 🔄 Daily Workflow

Here's the workflow you'll use most often:

```bash
# 1. Check what changed
git status

# 2. Add your changes
git add .

# 3. Commit with a message
git commit -m "Brief description of what you changed"

# 4. Push to GitHub
git push
```

---

## 🆘 Oops! Made a Mistake?

### Undo Last Commit (but keep changes)
```bash
git reset --soft HEAD~1
```

### Discard All Changes
```bash
# Be careful! This permanently deletes your changes
git reset --hard HEAD
```

### Undo Changes to Specific File
```bash
git checkout -- filename.css
```

---

## 🌿 Branches (Advanced)

Create a separate workspace for experiments:

```bash
# Create a new branch
git branch experiment

# Switch to that branch
git checkout experiment

# Or create and switch in one command
git checkout -b experiment

# Switch back to main
git checkout main

# Delete a branch
git branch -d experiment
```

---

## 📥 Pulling Changes from GitHub

If you make changes on another computer:

```bash
# Download latest changes
git pull
```

---

## 🔍 Useful Tips

### See What Branch You're On
```bash
git branch
```

### See Remote Repositories
```bash
git remote -v
```

### Create a .gitignore File

To exclude files from Git (like temporary files):

```bash
# Create .gitignore file
touch .gitignore

# Add these contents:
*.log
.DS_Store
.vscode/
node_modules/
```

---

## 🎓 Your Project Status

Your German Vocabulary Quiz is already set up with Git! ✅

Current status:
- ✅ Git initialized
- ✅ All files added
- ✅ Initial commit made
- 📋 Ready to push to GitHub

---

## 🚀 Next Steps

1. **Create a GitHub account** (if needed): https://github.com
2. **Create a new repository** on GitHub
3. **Connect your local project** using the commands above
4. **Push your code** with `git push -u origin main`
5. **Visit your site**: You can enable GitHub Pages to host it live!

---

## 📚 Need More Help?

- **Official Git Docs**: https://git-scm.com/doc
- **GitHub Help**: https://help.github.com
- **Interactive Tutorial**: https://learngitbranching.js.org

---

**You're all set! Happy coding! 🎉**

