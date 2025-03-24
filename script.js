document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("commandInput");
    const output = document.getElementById("output");
    const terminal = document.getElementById("terminal-container");
    const hint = document.getElementById("autocompleteHint");
    const mirror = document.getElementById("inputMirror");

    const helpMessage = `<pre>
    <b>Available commands:</b>

    <b>help</b>        - Show this help message
    <b>whoami</b>      - Display my identity
    <b>skills</b>      - Display my skills
    <b>projects</b>    - Show my featured projects
    <b>awards</b>      - Display my achievements
    <b>others</b>      - Display my management experience / soft skills
    <b>linkedin</b>    - Open my LinkedIn profile in a new tab
    <b>github</b>      - Open my GitHub profile in a new tab
    <b>neofetch</b>    - Display system info (Arch Linux style)
    <b>clear</b>       - Clear the terminal
    </pre>`;


    const commands = {
        help: helpMessage,
        neofetch: () => {
            let currentTime = new Date().toLocaleTimeString();
            return `<pre>
        <span class="blue">      /\\      </span>  User: jkartik
        <span class="blue">     /  \\     </span>  OS: Arch Linux
        <span class="blue">    /    \\    </span>  Hostname: jkartik.in
        <span class="blue">   /  /\\  \\   </span>  Time: ${currentTime}
        <span class="blue">  /  (--)  \\  </span>  Email: <a href="mailto:a.contact@jkartik.in" class="custom-link">contact@jkartik.in</a>
        <span class="blue"> /  /    \\  \\ </span>  GitHub: <a href="https://GitHub.com/KartikJain14" target="_blank" class="custom-link">GitHub.com/KartikJain14</a>
        <span class="blue">/___\\    /___\\</span>  LinkedIn: <a href="https://LinkedIn.com/in/KartikJain1410" target="_blank" class="custom-link">LinkedIn.com/in/KartikJain1410</a>
        </pre>`;
        },

        github: `Opening <a href="https://GitHub.com/KartikJain14" target="_blank" class="custom-link">GitHub/KartikJain14</a>...`,
        linkedin: `Opening <a href="https://LinkedIn.com/in/KartikJain1410" target="_blank" class="custom-link">LinkedIn/KartikJain1410</a>...`,
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
        clear: () => resetTerminal(),
        exit: () => resetTerminal(),
    };

    const commandList = Object.keys(commands);

    function processCommand(cmd) {
        if (cmd === "") {
            output.scrollTop = output.scrollHeight;
            return;
        }

        if (cmd === "clear" || cmd === "exit") {
            resetTerminal();
            return;
        }

        // Open GitHub and LinkedIn links automatically in a new tab
        if (cmd === "github") {
            window.open("https://GitHub.com/KartikJain14", "_blank");
        } else if (cmd === "linkedin") {
            window.open("https://LinkedIn.com/in/KartikJain1410", "_blank");
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

        output.scrollTop = output.scrollHeight;
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

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            processCommand(input.value.trim());
            input.value = "";
            hint.textContent = "";
        } else if (event.key === "ArrowRight" || event.key === "Tab") {
            event.preventDefault();
            autocompleteCommand();
        }
    });

    input.addEventListener("input", updateAutocompleteHint);

    terminal.addEventListener("click", function () {
        input.focus();
    });

    resetTerminal();
});
