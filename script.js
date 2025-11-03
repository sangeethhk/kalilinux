document.addEventListener('DOMContentLoaded', () => {
    // Terminal elements
    const terminal = document.querySelector('.terminal-content');
    const terminalWindow = document.querySelector('.terminal.window');
    const terminalIcon = document.querySelector('.icon[data-type="application"]');
    const input = document.querySelector('.command-input');
    const output = document.querySelector('.output');
    const time = document.querySelector('.time');
    const date = document.querySelector('.date');
    const desktop = document.querySelector('.desktop');
    const contextMenu = document.querySelector('.context-menu');
    const startMenu = document.querySelector('.start-menu');
    const applicationsMenu = document.querySelector('.applications-menu');
    const terminalTaskItem = document.querySelector('#terminal-task');
    const browserTaskItem = document.querySelector('#browser-task');

    // Initialize settings manager
    const settings = new SettingsManager();
    settings.loadSettings();

    function getCommand(cmd) {
        return settings.getCommand(cmd);
    }
    function getTheme(component) {
        return settings.getTheme(component);
    }
    function getWindowSettings(type) {
        return settings.getWindowSettings(type);
    }

    // Apply initial settings
    const terminalTheme = getTheme('terminal');
    terminal.style.backgroundColor = terminalTheme.background;
    terminal.style.color = terminalTheme.foreground;
    document.documentElement.style.setProperty('--terminal-prompt-color', terminalTheme.prompt);
    document.documentElement.style.setProperty('--terminal-cursor-color', terminalTheme.cursor);

    // Window control buttons
    const closeButton = document.querySelector('.window-buttons .close');
    const minimizeButton = document.querySelector('.window-buttons .minimize');
    const maximizeButton = document.querySelector('.window-buttons .maximize');

    let isMaximized = false;
    let windowState = {
        width: '90%',
        height: '80vh',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    };

    // Window control functionality
    closeButton.addEventListener('click', () => {
        terminalWindow.classList.remove('visible');
        taskItem.classList.remove('active');
    });

    minimizeButton.addEventListener('click', () => {
        // Add a message instead of minimizing
        const warningMessage = 'This terminal cannot be minimized. It\'s a core system process.\n';
        output.innerHTML += `<div style="color: #ffbd2e;">${warningMessage}</div>`;
        terminal.scrollTop = terminal.scrollHeight;
    });

    maximizeButton.addEventListener('click', () => {
        if (!isMaximized) {
            // Store current window state
            windowState = {
                width: terminalWindow.style.width,
                height: terminalWindow.style.height,
                top: terminalWindow.style.top,
                left: terminalWindow.style.left,
                transform: terminalWindow.style.transform
            };

            // Maximize
            terminalWindow.style.width = '100%';
            terminalWindow.style.height = '100%';
            terminalWindow.style.top = '0';
            terminalWindow.style.left = '0';
            terminalWindow.style.transform = 'none';
        } else {
            // Restore
            Object.assign(terminalWindow.style, windowState);
        }
        isMaximized = !isMaximized;
    });
    
    // Update clock and date
    function updateDateTime() {
        const now = new Date();
        time.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        date.textContent = now.toLocaleDateString();
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Desktop icon selection
    const icons = document.querySelectorAll('.icon');
    icons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            icons.forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');
            e.stopPropagation();
        });
    });

    // Browser elements
    const browserWindow = document.querySelector('.browser.window');
    const browserIcon = document.querySelector('.icon[data-type="browser"]');
    const urlInput = document.getElementById('url-input');
    const browserIframe = document.getElementById('browser-iframe');
    const backButton = document.getElementById('back');
    const forwardButton = document.getElementById('forward');
    const reloadButton = document.getElementById('reload');

    // Browser window controls
    const browserCloseButton = browserWindow.querySelector('.window-buttons .close');
    const browserMinimizeButton = browserWindow.querySelector('.window-buttons .minimize');
    const browserMaximizeButton = browserWindow.querySelector('.window-buttons .maximize');

    // Browser state
    let browserMaximized = false;
    let browserWindowState = {
        width: '90%',
        height: '80vh',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    };

    // Browser window controls handlers
    browserCloseButton.addEventListener('click', () => {
        browserWindow.classList.remove('visible');
        browserTaskItem.classList.remove('active');
    });

    browserMinimizeButton.addEventListener('click', () => {
        browserWindow.classList.remove('visible');
        browserTaskItem.classList.remove('active');
    });

    browserMaximizeButton.addEventListener('click', () => {
        if (!browserMaximized) {
            // Store current window state
            browserWindowState = {
                width: browserWindow.style.width,
                height: browserWindow.style.height,
                top: browserWindow.style.top,
                left: browserWindow.style.left,
                transform: browserWindow.style.transform
            };

            // Maximize
            browserWindow.style.width = '100%';
            browserWindow.style.height = '100%';
            browserWindow.style.top = '0';
            browserWindow.style.left = '0';
            browserWindow.style.transform = 'none';
        } else {
            // Restore
            Object.assign(browserWindow.style, browserWindowState);
        }
        browserMaximized = !browserMaximized;
    });

    // Browser functions
    function loadURL(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        browserIframe.src = url;
        urlInput.value = url;
    }

    // URL input handler
    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            loadURL(urlInput.value);
        }
    });

    // Browser navigation
    backButton.addEventListener('click', () => {
        browserIframe.contentWindow.history.back();
    });

    forwardButton.addEventListener('click', () => {
        browserIframe.contentWindow.history.forward();
    });

    reloadButton.addEventListener('click', () => {
        browserIframe.contentWindow.location.reload();
    });

    // Terminal icon click handler
    terminalIcon.addEventListener('click', () => {
        terminalWindow.classList.add('visible');
        taskItem.classList.add('active');
        browserWindow.classList.remove('visible');
        input.focus();
    });

    // Browser icon click handler
    browserIcon.addEventListener('click', () => {
        if (!browserWindow.classList.contains('visible')) {
            browserWindow.classList.add('visible');
            terminalWindow.classList.remove('visible');
            terminalTaskItem.classList.remove('active');
            browserTaskItem.classList.add('active');
            
            // Restore window state if it was previously maximized
            if (browserMaximized) {
                browserWindow.style.width = '100%';
                browserWindow.style.height = '100%';
                browserWindow.style.top = '0';
                browserWindow.style.left = '0';
                browserWindow.style.transform = 'none';
            } else {
                Object.assign(browserWindow.style, browserWindowState);
            }
            
            urlInput.focus();
        }
    });

    // Terminal task item click handler
    terminalTaskItem.addEventListener('click', () => {
        if (terminalWindow.classList.contains('visible')) {
            terminalWindow.classList.remove('visible');
            terminalTaskItem.classList.remove('active');
        } else {
            terminalWindow.classList.add('visible');
            browserWindow.classList.remove('visible');
            terminalTaskItem.classList.add('active');
            browserTaskItem.classList.remove('active');
            input.focus();
        }
    });

    // Browser task item click handler
    browserTaskItem.addEventListener('click', () => {
        if (browserWindow.classList.contains('visible')) {
            browserWindow.classList.remove('visible');
            browserTaskItem.classList.remove('active');
        } else {
            browserWindow.classList.add('visible');
            terminalWindow.classList.remove('visible');
            browserTaskItem.classList.add('active');
            terminalTaskItem.classList.remove('active');
            urlInput.focus();
        }
    });

    // Context menu terminal option
    const openTerminalOption = document.querySelector('.menu-item:first-child');
    openTerminalOption.addEventListener('click', () => {
        terminalWindow.classList.add('visible');
        taskItem.classList.add('active');
        input.focus();
        contextMenu.style.display = 'none';
    });

    // Clear selection when clicking desktop
    desktop.addEventListener('click', () => {
        icons.forEach(icon => icon.classList.remove('selected'));
    });

    // Context menu
    desktop.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.top = `${e.clientY}px`;
    });

    // Hide context menu on click outside
    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
        applicationsMenu.classList.remove('active');
    });

    // Open browser from context menu
    const openBrowserOption = document.querySelector('.menu-item[data-action="browser"]');
    if (openBrowserOption) {
        openBrowserOption.addEventListener('click', () => {
            browserWindow.classList.add('visible');
            terminalWindow.classList.remove('visible');
            browserTaskItem.classList.add('active');
            terminalTaskItem.classList.remove('active');
            urlInput.focus();
            contextMenu.style.display = 'none';
        });
    }

    // Applications menu
    startMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        applicationsMenu.classList.toggle('active');
    });

    // Prevent context menu from closing when clicking inside it
    contextMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Handle wallpaper switching
        const wallpaperItem = e.target.closest('[data-wallpaper]');
        if (wallpaperItem) {
            const wallpaper = wallpaperItem.dataset.wallpaper;
            document.body.style.backgroundImage = `url('./assects/wallpaper/${wallpaper}')`;
            
            // Update active state
            document.querySelectorAll('[data-wallpaper]').forEach(item => {
                item.classList.remove('active');
            });
            wallpaperItem.classList.add('active');
        }
    });

    // Set initial active wallpaper
    document.querySelector('[data-wallpaper="black-kali.webp"]').classList.add('active');

    // Window settings
    const terminalSettings = getWindowSettings('terminal');
    terminalWindow.style.width = terminalSettings.defaultSize.width;
    terminalWindow.style.height = terminalSettings.defaultSize.height;
    terminalWindow.style.top = terminalSettings.defaultSize.top;
    terminalWindow.style.left = terminalSettings.defaultSize.left;
    terminalWindow.style.transform = terminalSettings.defaultSize.transform;

    const browserSettings = getWindowSettings('browser');
    browserWindow.style.width = browserSettings.defaultSize.width;
    browserWindow.style.height = browserSettings.defaultSize.height;
    browserWindow.style.top = browserSettings.defaultSize.top;
    browserWindow.style.left = browserSettings.defaultSize.left;
    browserWindow.style.transform = browserSettings.defaultSize.transform;

    // Window resize and drag functionality
    [terminalWindow, browserWindow].forEach(win => {
        win.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('top-bar')) {
                const offsetY = e.clientY - win.getBoundingClientRect().top;
                const offsetX = e.clientX - win.getBoundingClientRect().left;
                function mouseMoveHandler(e) {
                    const newY = e.clientY - offsetY;
                    const newX = e.clientX - offsetX;
                    win.style.top = `${newY}px`;
                    win.style.left = `${newX}px`;
                    win.style.transform = 'none';
                }
                function mouseUpHandler() {
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                }
                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            }
        });
    });

    // Settings Dialog
    const settingsDialog = document.getElementById('settings-dialog');
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    const settingsSections = document.querySelectorAll('.settings-section');
    const settingsApplyBtn = document.getElementById('settings-apply');
    const settingsSaveBtn = document.getElementById('settings-save');
    const settingsCancelBtn = document.getElementById('settings-cancel');

    // Settings Open/Close
    function openSettings() {
        settingsDialog.classList.add('visible');
        loadCurrentSettings();
    }

    function closeSettings() {
        settingsDialog.classList.remove('visible');
    }

    // Settings Navigation
    settingsNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            settingsNavItems.forEach(nav => nav.classList.remove('active'));
            settingsSections.forEach(sec => sec.classList.remove('active'));
            item.classList.add('active');
            document.getElementById(`${section}-settings`).classList.add('active');
        });
    });

    // Load Current Settings
    function loadCurrentSettings() {
        // Terminal Settings
        document.getElementById('terminal-bg-color').value = getTheme('terminal').background;
        document.getElementById('terminal-text-color').value = getTheme('terminal').foreground;
        document.getElementById('terminal-prompt-color').value = getTheme('terminal').prompt;

        // Browser Settings
        const browserSettings = getWindowSettings('browser');
        document.getElementById('browser-default-width').value = browserSettings.defaultSize.width;
        document.getElementById('browser-default-height').value = browserSettings.defaultSize.height;
    }

    // Apply Settings
    function applySettings() {
        // Terminal Settings
        const terminalTheme = {
            background: document.getElementById('terminal-bg-color').value,
            foreground: document.getElementById('terminal-text-color').value,
            prompt: document.getElementById('terminal-prompt-color').value
        };
        settings.theme.terminal = terminalTheme;

        // Apply terminal colors
        terminal.style.backgroundColor = terminalTheme.background;
        terminal.style.color = terminalTheme.foreground;
        document.documentElement.style.setProperty('--terminal-prompt-color', terminalTheme.prompt);

        // Browser Settings
        const browserSettings = {
            defaultSize: {
                width: document.getElementById('browser-default-width').value,
                height: document.getElementById('browser-default-height').value,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }
        };
        settings.windowSettings.browser = browserSettings;
    }

    // Save Settings
    function saveSettings() {
        applySettings();
        settings.saveSettings();
        closeSettings();
    }

    // Settings Event Listeners
    settingsApplyBtn.addEventListener('click', applySettings);
    settingsSaveBtn.addEventListener('click', saveSettings);
    settingsCancelBtn.addEventListener('click', closeSettings);

    // Add settings to context menu
    const settingsMenuItem = document.querySelector('.menu-item:last-child');
    settingsMenuItem.addEventListener('click', () => {
        openSettings();
        contextMenu.style.display = 'none';
    });

    // Add settings to applications menu
    const settingsAppMenuItem = document.querySelector('.menu-category:last-child');
    settingsAppMenuItem.addEventListener('click', () => {
        openSettings();
        applicationsMenu.classList.remove('active');
    });

    // Apply initial settings
    loadCurrentSettings();
    applySettings();

    // Auto-focus input
    input.focus();
    document.addEventListener('click', () => input.focus());

    // Handle command input
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const fullCommand = input.value.trim();
            const parts = fullCommand.split(' ');
            const command = parts[0].toLowerCase();
            const args = parts.slice(1).join(' ');

            // Add to history
            if (fullCommand) {
                commandHistory.unshift(fullCommand);
                historyIndex = -1;
            }

            const prompt = document.createElement('div');
            prompt.innerHTML = `<span class="prompt">root@kali:~#</span> ${fullCommand}`;
            output.appendChild(prompt);

            let response;
            const commandFunction = getCommand(command);
            if (commandFunction) {
                if (typeof commandFunction === 'function') {
                    response = commandFunction(args);
                } else {
                    response = commandFunction;
                }
            } else if (command === '') {
                response = '';
            } else {
                response = `Command not found: ${command}. Type 'help' for available commands.`;
            }

            // Handle help for specific commands
            if (args === '--help' && commandFunction) {
                response = `Usage information for ${command}:\n${commandFunction.help || 'No help available for this command.'}`;
            }

            // Animation support
            if (response && typeof response === 'object' && response.animated && Array.isArray(response.frames)) {
                let i = 0;
                function showFrame() {
                    const responseElement = document.createElement('div');
                    responseElement.innerHTML = `<pre>${response.frames[i]}</pre>`;
                    output.appendChild(responseElement);
                    terminal.scrollTop = terminal.scrollHeight;
                    i++;
                    if (i < response.frames.length) {
                        setTimeout(showFrame, response.delay || 800);
                    }
                }
                showFrame();
            } else if (response) {
                const responseElement = document.createElement('div');
                responseElement.innerHTML = `<pre>${response}</pre>`;
                output.appendChild(responseElement);
            }

            input.value = '';
            terminal.scrollTop = terminal.scrollHeight;
        } else if (e.key === 'ArrowUp') {
            // ...existing code...