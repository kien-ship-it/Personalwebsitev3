/**
 * Vite plugin to handle API routes locally during development.
 * This allows the same API handlers to work both locally and when deployed to Vercel.
 */

import type { Plugin, Connect } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { loadEnv } from 'vite';

// Mock VercelRequest and VercelResponse interfaces for local development
interface MockVercelRequest {
    method: string;
    headers: Record<string, string | string[] | undefined>;
    body: unknown;
    socket?: { remoteAddress?: string };
}

interface MockVercelResponse {
    statusCode: number;
    _headers: Record<string, string>;
    _body: unknown;
    _isStreaming: boolean;
    _streamEnded: boolean;
    _rawRes: ServerResponse | null;
    status(code: number): MockVercelResponse;
    json(data: unknown): void;
    setHeader(name: string, value: string): void;
    write(chunk: string): boolean;
    end(chunk?: string): void;
}

function createMockResponse(rawRes?: ServerResponse): MockVercelResponse {
    const res: MockVercelResponse = {
        statusCode: 200,
        _headers: {},
        _body: null,
        _isStreaming: false,
        _streamEnded: false,
        _rawRes: rawRes || null,
        status(code: number) {
            this.statusCode = code;
            return this;
        },
        json(data: unknown) {
            this._body = data;
            this._headers['Content-Type'] = 'application/json';
        },
        setHeader(name: string, value: string) {
            this._headers[name] = value;
            if (this._rawRes && !this._rawRes.headersSent) {
                this._rawRes.setHeader(name, value);
            }
        },
        write(chunk: string): boolean {
            if (!this._isStreaming && this._rawRes) {
                this._isStreaming = true;
                this._rawRes.statusCode = this.statusCode;
                for (const [key, value] of Object.entries(this._headers)) {
                    if (!this._rawRes.headersSent) {
                        this._rawRes.setHeader(key, value);
                    }
                }
            }
            if (this._rawRes) {
                return this._rawRes.write(chunk);
            }
            return false;
        },
        end(chunk?: string) {
            this._streamEnded = true;
            if (this._rawRes) {
                if (chunk) {
                    this._rawRes.end(chunk);
                } else {
                    this._rawRes.end();
                }
            }
        },
    };
    return res;
}

async function parseBody(req: IncomingMessage): Promise<unknown> {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                resolve({});
            }
        });
        req.on('error', reject);
    });
}

export function viteApiPlugin(): Plugin {
    return {
        name: 'vite-api-plugin',
        config(_, { mode }) {
            // Load environment variables from .env.local into process.env
            const env = loadEnv(mode, process.cwd(), '');
            for (const [key, value] of Object.entries(env)) {
                if (process.env[key] === undefined) {
                    process.env[key] = value;
                }
            }
        },
        configureServer(server) {
            server.middlewares.use(async (req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
                const url = req.url || '';

                // Only handle /api routes
                if (!url.startsWith('/api/')) {
                    return next();
                }

                try {
                    // Parse the request body for POST requests
                    const body = req.method === 'POST' ? await parseBody(req) : {};

                    // Create mock request object
                    const mockReq: MockVercelRequest = {
                        method: req.method || 'GET',
                        headers: req.headers as Record<string, string | string[] | undefined>,
                        body,
                        socket: { remoteAddress: req.socket?.remoteAddress },
                    };

                    // Create mock response object with raw response for streaming
                    const mockRes = createMockResponse(res);

                    // Route to appropriate handler
                    if (url === '/api/chat' || url.startsWith('/api/chat?')) {
                        const { default: chatHandler } = await import('./api/chat');
                        await chatHandler(mockReq as any, mockRes as any);
                    } else if (url === '/api/embed' || url.startsWith('/api/embed?')) {
                        const { default: embedHandler } = await import('./api/embed');
                        await embedHandler(mockReq as any, mockRes as any);
                    } else {
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'API route not found' }));
                        return;
                    }

                    // Only send non-streaming responses here
                    // Streaming responses are handled directly via write/end
                    if (!mockRes._isStreaming && !mockRes._streamEnded) {
                        res.statusCode = mockRes.statusCode;
                        for (const [key, value] of Object.entries(mockRes._headers)) {
                            res.setHeader(key, value);
                        }
                        res.end(JSON.stringify(mockRes._body));
                    }
                } catch (error) {
                    console.error('API handler error:', error);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                }
            });
        },
    };
}
