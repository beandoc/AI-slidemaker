// server.js — Local dev server with API route support
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

// Dynamically import API handlers
async function loadApiHandler(name) {
    const mod = await import(`./api/${name}.js`);
    return mod.default;
}

const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost`);

    // ─── API Routes ───
    if (url.pathname.startsWith('/api/')) {
        const handlerName = url.pathname.replace('/api/', '').replace(/\.js$/, '');

        // Parse body for POST requests
        let body = '';
        if (req.method === 'POST') {
            body = await new Promise((resolve) => {
                let data = '';
                req.on('data', chunk => data += chunk);
                req.on('end', () => resolve(data));
            });
        }

        // Create mock req/res for Vercel-style handlers
        const mockReq = {
            method: req.method,
            body: body ? JSON.parse(body) : {},
            headers: req.headers,
        };

        const mockRes = {
            statusCode: 200,
            _headers: { 'Content-Type': 'application/json' },
            status(code) { this.statusCode = code; return this; },
            json(data) {
                res.writeHead(this.statusCode, this._headers);
                res.end(JSON.stringify(data));
            },
            setHeader(k, v) { this._headers[k] = v; },
        };

        try {
            const handler = await loadApiHandler(handlerName);
            await handler(mockReq, mockRes);
        } catch (err) {
            console.error(`API Error (${handlerName}):`, err.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // ─── Static Files ───
    let filePath = join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname);

    if (!existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
    }

    const ext = extname(filePath);
    const mime = MIME_TYPES[ext] || 'application/octet-stream';

    try {
        const content = readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': mime });
        res.end(content);
    } catch (err) {
        res.writeHead(500);
        res.end('Server error');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`\n🚀 AI Slidemaker running at: http://localhost:${PORT}`);
    console.log(`   API routes active: /api/generate, /api/edit`);
    console.log(`   Press Ctrl+C to stop.\n`);
});
