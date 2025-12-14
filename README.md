# lmarena.ai-chat-downloader
Tampermonkey userscript to download LMSYS Arena chat conversations as Markdown


# LMSYS Chat Downloader

A Tampermonkey userscript to download chat conversations from [LM Arena](https://lmarena.ai/) as Markdown files.

![Version](https://img.shields.io/badge/version-12.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **🚀 Auto Download** - Automatically scrolls through the entire chat and exports all messages
- **👆 Manual Select** - Manually select messages in order (User → Assistant → User → ...)
- **📝 Markdown Export** - Clean, readable Markdown format with timestamps
- **🎨 Beautiful UI** - Floating buttons with modern design

## 📥 Installation

### Prerequisites
- [Tampermonkey](https://www.tampermonkey.net/) browser extension (Chrome, Firefox, Edge, Safari)

### Install Script

**Option 1: Direct Install**
1. Click here: [Install Script](../../raw/main/lmsys-chat-downloader.user.js)
2. Tampermonkey will open automatically
3. Click "Install"

**Option 2: Manual Install**
1. Open Tampermonkey Dashboard
2. Click "Create a new script"
3. Copy & paste the contents of `lmsys-chat-downloader.user.js`
4. Save (Ctrl+S)

## 🚀 Usage

1. Go to [lmarena.ai](https://lmarena.ai/)
2. Start or open a chat conversation
3. You'll see two buttons in the bottom-right corner:

| Button | Description |
|--------|-------------|
| **🚀 Auto Download** | Scrolls through the entire chat and downloads all messages automatically |
| **👆 Manual Select** | Click on messages to select them manually. First click = User, second = Assistant, etc. |

4. The chat will be downloaded as a `.md` (Markdown) file

## 📄 Export Format

```markdown
# LMSYS Chat Export

**Datum:** 14.12.2025, 14:30:00

**Nachrichten:** 10

---

## 👤 User

Your message here...

---

## 🤖 Assistant

AI response here...

---
