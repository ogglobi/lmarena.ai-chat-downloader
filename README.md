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

## 🔧 Compatibility
✅ Chrome + Tampermonkey
✅ Firefox + Tampermonkey
✅ Edge + Tampermonkey
✅ Safari + Tampermonkey
✅ lmarena.ai
✅ chat.lmsys.org

## 🐛 Troubleshooting
Buttons don't appear?

Wait a few seconds after page load
Refresh the page
Check if Tampermonkey is enabled
No messages found?

Make sure you have an active chat open
Try scrolling through the chat manually first
Use "Manual Select" as fallback
Wrong message order?

Use "Manual Select" to pick messages in the correct order

## 📜 License
MIT License - see LICENSE file

## 🙏 Credits
Original concept inspired by akira0245's script
Completely rewritten for the new LM Arena interface

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

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


