// scripts/main.js
import { PRESETS, generateHTML } from './generator.js';
import { generateOutline } from './gemini.js';

let activeStyleId = PRESETS[0].id; // Default to first style
let apiKey = localStorage.getItem('GEMINI_API_KEY') || '';

// DOM Elements
const styleGrid = document.getElementById('styleGrid');
const generateBtn = document.getElementById('generateBtn');
const promptInput = document.getElementById('promptInput');
const errorBox = document.getElementById('errorBox');
const settingsModal = document.getElementById('settingsModal');
const openSettingsBtn = document.getElementById('openSettingsBtn');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const apiKeyInput = document.getElementById('apiKeyInput');

// Initialize UI
function init() {
    renderStyles();

    // Settings logic
    openSettingsBtn.addEventListener('click', () => {
        apiKeyInput.value = apiKey;
        settingsModal.classList.add('open');
    });

    cancelSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('open');
    });

    saveSettingsBtn.addEventListener('click', () => {
        apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('GEMINI_API_KEY', apiKey);
        } else {
            localStorage.removeItem('GEMINI_API_KEY');
        }
        settingsModal.classList.remove('open');
    });

    // Generate trigger
    generateBtn.addEventListener('click', handleGenerate);
}

function renderStyles() {
    styleGrid.innerHTML = '';
    PRESETS.forEach(preset => {
        const card = document.createElement('div');
        card.className = `style-card ${preset.id === activeStyleId ? 'active' : ''}`;
        card.innerHTML = `
            <div class="style-name">${preset.name}</div>
            <div class="style-desc">${preset.vibe}</div>
        `;
        card.addEventListener('click', () => {
            activeStyleId = preset.id;
            renderStyles(); // re-render to update active class
        });
        styleGrid.appendChild(card);
    });
}

function showError(msg) {
    if (!msg) {
        errorBox.style.display = 'none';
        return;
    }
    errorBox.style.display = 'block';
    errorBox.innerText = msg;
}

async function handleGenerate() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        showError("Please enter some content or a topic.");
        return;
    }

    showError(null);
    const originalText = generateBtn.innerText;
    generateBtn.disabled = true;
    generateBtn.innerText = "🧠 Planning Slides with Gemini...";

    try {
        const outline = await generateOutline(prompt, apiKey);

        generateBtn.innerText = "🎨 Generating Layout & CSS...";

        const htmlContent = generateHTML(outline, activeStyleId);

        // Let's either download it or save it and go to editor
        // We'll store it in sessionStorage and go to editor.html
        sessionStorage.setItem('LAST_GENERATED_PRESENTATION', htmlContent);
        sessionStorage.setItem('LAST_OUTLINE', JSON.stringify(outline));
        sessionStorage.setItem('LAST_STYLE', activeStyleId);

        generateBtn.innerText = "✅ Done! Opening...";

        // Open in editor
        setTimeout(() => {
            window.location.href = 'editor.html';
            generateBtn.disabled = false;
            generateBtn.innerText = originalText;
        }, 800);

    } catch (err) {
        console.error(err);
        showError(err.message);
        generateBtn.disabled = false;
        generateBtn.innerText = originalText;
    }
}

// Start app
init();
