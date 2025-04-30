document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("commandInput");
    const output = document.getElementById("output");
    const terminal = document.getElementById("terminal-container");
    const hint = document.getElementById("autocompleteHint");
    const mirror = document.getElementById("inputMirror");

    let commandHistory = [];
    let historyIndex = -1;

    const helpMessage = `
    <b>💻 System Commands:</b><br>
    <b>help or h</b>        - Show available commands<br>
    <b>clear or cls</b>       - Clear the terminal<br>
    <b>neofetch or fetch</b>    - Display system info (Arch Linux style)<br>
    <br>
    <b>👤 Personal Information:</b><br>
    <b>whoami</b>      - Display my identity<br>
    <b>skills</b>      - Show my technical skills<br>
    <b>projects</b>    - List my featured projects<br>
    <b>awards</b>      - Display my achievements<br>
    <b>others</b>      - Show my management/soft skills<br>
    <br>
    <b>🌐 Online Profiles:</b><br>
    <b>linkedin or ln</b>    - Open my LinkedIn profile<br>
    <b>github or gh</b>      - Open my GitHub profile<br>
    <br>
    <b>📄 Documents:</b><br>
    <b>resume or r</b>      - Download my resume<br>
    `;

    const commands = {
        help: helpMessage,
        neofetch: () => {
            let currentTime = new Date().toLocaleTimeString();
            return `<pre>
        <span class="blue">      /\\      </span>  User: jkartik
        <span class="blue">     /  \\     </span>  OS: Arch Linux
        <span class="blue">    /    \\    </span>  Hostname: jkartik.in
        <span class="blue">   /  /\\  \\   </span>  Time: ${currentTime}
        <span class="blue">  /  (--)  \\  </span>  Email: <a href="mailto:contact@jkartik.in" class="custom-link">contact@jkartik.in</a>
        <span class="blue"> /  /    \\  \\ </span>  GitHub: <a href="https://GitHub.com/KartikJain14" target="_blank" class="custom-link">GitHub.com/KartikJain14</a>
        <span class="blue">/___\\    /___\\</span>  LinkedIn: <a href="https://LinkedIn.com/in/KartikJain1410" target="_blank" class="custom-link">LinkedIn.com/in/KartikJain1410</a>
        </pre>`;
        },

        github: () => {
            window.open("https://github.com/KartikJain14", "_blank");
            return `Opening <a href="https://github.com/KartikJain14" target="_blank" class="custom-link">GitHub/KartikJain14</a>...`;
        },

        linkedin: () => {
            window.open("https://linkedin.com/in/KartikJain1410", "_blank");
            return `Opening <a href="https://linkedin.com/in/KartikJain1410" target="_blank" class="custom-link">LinkedIn/KartikJain1410</a>...`;
        },

        projects: `
        - Backend: Taqneeq App's Backend, Mumbai MUN's Backend, ACM's Website Backend (Certification Portal)<br>
        - App Integrations: Integrate Dynamic data with backend to the flutter app.<br>
        - Hindi Call Transcriber: <a href="https://github.com/KartikJain14/darpg2024" target="_blank" class="custom-link">VoxBridge</a> is a Hindi audio to English and Hindi transcriber.<br>
        - Subdomain Distribution Portal: <a href="https://github.com/KartikJain14/CloudFrost" target="_blank" class="custom-link">CloudFrost</a> is a portal that allows users to recieve free sub domains with DNS support.<br>
        - Discord Bots: Customized Discord bot (heavily customized)
        `,
        awards: `
        - Discovered security bug in Meta’s WhatsApp<br>
        - Discovered XSS in Mumbai Police website
        `,
        skills: `
        - Backend Development<br>
        - Python: Flask, FastApi, discord.py<br>
        - Java: Competitive Programming, JDA, Spring Boot (learning)<br>
        - JavaScript: Mongoose, Express, NodeJs, discord.js, passport.js<br>
        - Database: MongoDB, MySQL<br>
        - Version Control: Git<br>
        - CI/CD: Docker, GitHub CI/CD<br>
        - Cloud: Azure, AWS, GCP, Oracle Cloud<br>
        - Tools: Postman, BurpSuite, Nmap, Cloudflared<br>
        - OS: Arch Linux, Ubuntu, Windows
        `,
        others: `
        - Rapid learner with a strong ability to adapt to new technologies<br>
        - Strong communication and interpersonal skills<br>
        - Strong problem-solving skills<br>
        - Managed a team of 15+ developers for ACM MPSTME's Technical Team<br>
        - Managed a team of 5+ developers for NMIMS' official Technical Fest
        `,
        whoami: `<a href="https://jkartik.in" class="custom-link">Kartik Jain</a> | Backend Developer`,

        resume: () => {
            const link = document.createElement("a");
            link.href = "/resume.pdf";
            link.download = "Kartik_Resume.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return "Downloading resume...";
        },

        clear: () => resetTerminal(),
        exit: () => resetTerminal(),
    };

    const aliases = {
        gh: "github",
        ln: "linkedin",
        r: "resume",
        cls: "clear",
        h: "help",
        fetch: "neofetch"
    };

    const commandList = Object.keys(commands).concat(Object.keys(aliases));

    function processCommand(cmd) {
        cmd = cmd.toLowerCase();
        if (cmd === "") {
            output.scrollTop = output.scrollHeight;
            return;
        }

        commandHistory.push(cmd);
        historyIndex = commandHistory.length;

        if (aliases[cmd]) cmd = aliases[cmd];

        if (cmd === "clear" || cmd === "exit") {
            resetTerminal();
            return;
        }

        let response = typeof commands[cmd] === "function" ? commands[cmd]() : commands[cmd] || getClosestCommand(cmd);
        appendCommand(cmd, response);
    }

    function resetTerminal() {
        output.innerHTML = `<div class="help-message">Type 'help' to see available commands.</div>`;
        input.value = "";
        hint.textContent = "";
    }

    function appendCommand(command, result) {
        let commandLine = document.createElement("div");
        commandLine.classList.add("command-line");
        commandLine.innerHTML = `<span class="prompt">λ</span> ${command}`;
        output.appendChild(commandLine);

        let resultLine = document.createElement("div");
        resultLine.classList.add("command-result");
        resultLine.innerHTML = result;
        output.appendChild(resultLine);

        input.scrollIntoView({ behavior: "smooth" });
    }

    function getClosestCommand(inputCmd) {
        let closestMatch = commandList.find(cmd => cmd.startsWith(inputCmd));
        return closestMatch ? `Did you mean <b>${closestMatch}</b>?` : `Command not found: ${inputCmd}`;
    }

    function updateAutocompleteHint() {
        let currentInput = input.value;
        if (!currentInput) {
            hint.textContent = "";
            return;
        }
        let match = commandList.find(cmd => cmd.startsWith(currentInput));
        if (match) {
            hint.textContent = match.slice(currentInput.length);
            mirror.textContent = currentInput;
            hint.style.left = mirror.offsetWidth + "px";
        } else {
            hint.textContent = "";
        }
    }

    function autocompleteCommand() {
        let currentInput = input.value;
        if (!currentInput) return;
        let match = commandList.find(cmd => cmd.startsWith(currentInput));
        if (match) input.value = match;
        hint.textContent = "";
    }

    function createCommandBar() {
        const bar = document.getElementById("command-bar");
    
        const allCommands = Object.keys(commands);
    
        [...allCommands].sort().forEach(cmd => {
            const button = document.createElement("button");
            button.textContent = cmd;
            button.dataset.cmd = cmd;
            button.addEventListener("click", () => {
                processCommand(cmd);
            });
            bar.appendChild(button);
        });
    }

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            processCommand(input.value.trim());
            input.value = "";
            hint.textContent = "";
        } else if (event.key === "ArrowRight" || event.key === "Tab") {
            event.preventDefault();
            autocompleteCommand();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = "";
            }
        }
    });

    input.addEventListener("input", updateAutocompleteHint);

    terminal.addEventListener("click", function () {
        input.focus();
    });

    resetTerminal();
    createCommandBar();
});
