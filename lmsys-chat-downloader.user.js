// ==UserScript==
// @name         LMArena Chat Downloader
// @namespace    https://github.com/ogglobi/lmarena.ai-chat-downloader
// @version      1.0
// @description  Download LMSYS Arena chat conversations as Markdown files
// @author       ogglobi
// @match        *://lmarena.ai/*
// @match        *://chat.lmsys.org/*
// @icon         https://lmarena.ai/favicon.ico
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/ogglobi/lmarena.ai-chat-downloader
// @supportURL   https://github.com/ogglobi/lmarena.ai-chat-downloader/issues
// @downloadURL  https://raw.githubusercontent.com/ogglobi/lmarena.ai-chat-downloader/main/lmsys-chat-downloader.user.js
// @updateURL    https://raw.githubusercontent.com/ogglobi/lmarena.ai-chat-downloader/main/lmsys-chat-downloader.user.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[LMSYS Chat Downloader] Gestartet');

    function findMessages() {
        var messages = [];
        
        // User-Nachrichten: "group" + "self-end"
        var userMessages = document.querySelectorAll('div.group.self-end');
        userMessages.forEach(function(el) {
            var text = el.innerText ? el.innerText.trim() : '';
            if (text.length > 10) {
                messages.push({
                    text: text,
                    isUser: true,
                    element: el
                });
            }
        });
        
        // Assistant-Nachrichten: "bg-surface-primary" + "min-w-0" + "flex-1"
        var assistantContainers = document.querySelectorAll('div[class*="bg-surface-primary"][class*="flex-col"]');
        assistantContainers.forEach(function(el) {
            var className = el.className || '';
            if (className.indexOf('min-w-0') === -1) return;
            if (className.indexOf('flex-1') === -1) return;
            
            var prose = el.querySelector('.prose, .markdown, [class*="prose"]');
            var textEl = prose || el;
            var text = textEl.innerText ? textEl.innerText.trim() : '';
            
            if (text.length > 10) {
                var isDup = messages.some(function(m) { return m.text === text; });
                if (!isDup) {
                    messages.push({
                        text: text,
                        isUser: false,
                        element: el
                    });
                }
            }
        });
        
        // Sortiere nach DOM-Position
        messages.sort(function(a, b) {
            if (!a.element || !b.element) return 0;
            var pos = a.element.compareDocumentPosition(b.element);
            if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
            if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
            return 0;
        });
        
        // Kehre Reihenfolge um (älteste zuerst)
        messages.reverse();
        
        // Entferne Duplikate
        var seen = {};
        messages = messages.filter(function(msg) {
            var key = msg.text.slice(0, 100);
            if (seen[key]) return false;
            seen[key] = true;
            return true;
        });
        
        return messages;
    }

    function download(content, filename) {
        var blob = new Blob([content], { type: 'text/markdown; charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportMessages(messages) {
        if (messages.length === 0) {
            alert('Keine Nachrichten gefunden!\n\nScrolle erst durch den Chat.');
            return;
        }
        
        var content = '# LMSYS Chat Export\n\n';
        content += '**Datum:** ' + new Date().toLocaleString() + '\n\n';
        content += '**Nachrichten:** ' + messages.length + '\n\n';
        content += '---\n\n';
        
        messages.forEach(function(msg) {
            var role = msg.isUser ? '👤 User' : '🤖 Assistant';
            content += '## ' + role + '\n\n';
            content += msg.text + '\n\n';
            content += '---\n\n';
        });
        
        var timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
        download(content, 'lmsys_chat_' + timestamp + '.md');
        
        alert('✅ Export erfolgreich!\n\n' + messages.length + ' Nachrichten gespeichert.');
    }

    function findScrollContainer() {
        var candidates = document.querySelectorAll('div[class*="overflow"]');
        var best = null;
        var bestScore = 0;
        
        candidates.forEach(function(el) {
            var rect = el.getBoundingClientRect();
            var isScrollable = el.scrollHeight > el.clientHeight + 50;
            var className = el.className || '';
            
            if (rect.left < 100) return;
            if (rect.width < 300) return;
            if (rect.height < 200) return;
            
            var score = el.scrollHeight;
            if (className.indexOf('overscroll') !== -1) score += 10000;
            if (isScrollable) score += 5000;
            
            if (score > bestScore) {
                bestScore = score;
                best = el;
            }
        });
        
        return best;
    }

    function autoScrollAndDownload() {
        var container = findScrollContainer();
        
        if (!container) {
            alert('Scroll-Container nicht gefunden.\n\nNutze Manual Select.');
            return;
        }
        
        var btn = document.getElementById('lmsys-auto-btn');
        if (btn) {
            btn.textContent = '⏳ Scrolle...';
            btn.disabled = true;
        }
        
        container.scrollTop = 0;
        
        var count = 0;
        var maxCount = 150;
        
        function scrollDown() {
            var prev = container.scrollTop;
            container.scrollTop += 300;
            count++;
            
            var done = Math.abs(container.scrollTop - prev) < 5 || count >= maxCount;
            
            if (done) {
                if (btn) {
                    btn.textContent = '🚀 Auto Download';
                    btn.disabled = false;
                }
                
                setTimeout(function() {
                    var messages = findMessages();
                    exportMessages(messages);
                }, 300);
            } else {
                setTimeout(scrollDown, 50);
            }
        }
        
        setTimeout(scrollDown, 200);
    }

    function manualSelect() {
        var selected = [];
        
        var bar = document.createElement('div');
        bar.id = 'lmsys-bar';
        bar.style.cssText = 'position:fixed;top:0;left:0;right:0;padding:12px 20px;background:linear-gradient(135deg,#1a1a2e,#16213e);color:white;z-index:999999;text-align:center;font-family:system-ui;font-size:14px;box-shadow:0 4px 20px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;';
        bar.innerHTML = 
            '<span>📝 <b>Select Mode:</b> Klicke Nachrichten an</span>' +
            '<span id="lmsys-info" style="padding:6px 14px;background:#2196F3;border-radius:20px;font-weight:bold;font-size:13px;">Nächste: User | 0</span>' +
            '<button id="lmsys-save" style="padding:8px 16px;background:#4CAF50;color:white;border:none;border-radius:20px;cursor:pointer;font-weight:bold;font-size:13px;">💾 Speichern</button>' +
            '<button id="lmsys-undo" style="padding:8px 16px;background:#FF9800;color:white;border:none;border-radius:20px;cursor:pointer;font-weight:bold;font-size:13px;">↩️ Undo</button>' +
            '<button id="lmsys-exit" style="padding:8px 16px;background:#e74c3c;color:white;border:none;border-radius:20px;cursor:pointer;font-weight:bold;font-size:13px;">✕ Abbrechen</button>';
        document.body.appendChild(bar);
        
        function updateInfo() {
            var info = document.getElementById('lmsys-info');
            var next = selected.length % 2 === 0 ? 'User' : 'Assistant';
            var color = next === 'User' ? '#2196F3' : '#4CAF50';
            info.textContent = 'Nächste: ' + next + ' | ' + selected.length;
            info.style.background = color;
        }
        
        function cleanup() {
            bar.remove();
            document.querySelectorAll('.lmsys-sel').forEach(function(el) {
                el.style.outline = '';
                el.style.boxShadow = '';
                el.classList.remove('lmsys-sel');
            });
            document.removeEventListener('click', onClick, true);
        }
        
        function onClick(e) {
            if (e.target.closest('#lmsys-bar') || e.target.closest('#lmsys-panel')) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            var target = e.target;
            while (target && target !== document.body) {
                var cls = target.className || '';
                if (cls.indexOf('self-end') !== -1 && cls.indexOf('group') !== -1) break;
                if (cls.indexOf('bg-surface-primary') !== -1 && cls.indexOf('min-w-0') !== -1) break;
                if ((target.innerText || '').trim().length > 30) break;
                target = target.parentElement;
            }
            
            if (!target || !target.innerText) return;
            
            var text = target.innerText.trim();
            if (text.length < 10) return;
            
            var exists = selected.some(function(s) { return s.text === text; });
            if (exists) return;
            
            var isUser = selected.length % 2 === 0;
            var role = isUser ? 'User' : 'Assistant';
            var color = isUser ? '#2196F3' : '#4CAF50';
            
            target.style.outline = '3px solid ' + color;
            target.style.boxShadow = 'inset 0 0 0 3px ' + color + '44';
            target.classList.add('lmsys-sel');
            
            selected.push({
                text: text,
                isUser: isUser,
                el: target
            });
            
            updateInfo();
        }
        
        document.getElementById('lmsys-save').onclick = function() {
            cleanup();
            if (selected.length > 0) exportMessages(selected);
        };
        
        document.getElementById('lmsys-undo').onclick = function() {
            if (selected.length > 0) {
                var last = selected.pop();
                if (last.el) {
                    last.el.style.outline = '';
                    last.el.style.boxShadow = '';
                    last.el.classList.remove('lmsys-sel');
                }
                updateInfo();
            }
        };
        
        document.getElementById('lmsys-exit').onclick = cleanup;
        document.addEventListener('click', onClick, true);
        updateInfo();
    }

    function createUI() {
        if (document.getElementById('lmsys-panel')) return;
        
        var panel = document.createElement('div');
        panel.id = 'lmsys-panel';
        panel.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;font-family:system-ui;';
        
        var buttons = [
            { id: 'lmsys-auto-btn', text: '🚀 Auto Download', color: 'linear-gradient(135deg,#9C27B0,#673AB7)', fn: autoScrollAndDownload },
            { id: 'lmsys-manual-btn', text: '👆 Manual Select', color: 'linear-gradient(135deg,#2196F3,#1565C0)', fn: manualSelect }
        ];
        
        buttons.forEach(function(b) {
            var btn = document.createElement('button');
            btn.id = b.id;
            btn.textContent = b.text;
            btn.style.cssText = 'padding:14px 24px;font-size:14px;font-weight:bold;color:white;border:none;border-radius:12px;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.3);transition:all 0.15s;background:' + b.color + ';';
            btn.onmouseenter = function() { 
                this.style.transform = 'translateY(-3px)'; 
                this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)'; 
            };
            btn.onmouseleave = function() { 
                this.style.transform = ''; 
                this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)'; 
            };
            btn.onclick = b.fn;
            panel.appendChild(btn);
        });
        
        var tip = document.createElement('div');
        tip.style.cssText = 'font-size:11px;color:#aaa;text-align:center;padding:5px;';
        tip.textContent = '💡 Auto lädt alle Nachrichten';
        panel.appendChild(tip);
        
        document.body.appendChild(panel);
        console.log('[LMSYS Chat Downloader] UI bereit');
    }

    setTimeout(createUI, 1500);
    
    new MutationObserver(function() {
        if (!document.getElementById('lmsys-panel')) createUI();
    }).observe(document.body, { childList: true });

})();
