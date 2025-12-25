// Polyfill DOMMatrix for Node.js
if (typeof global.DOMMatrix === "undefined") {
    global.DOMMatrix = class { constructor() { } };
}

// Use Legacy build for Node.js support
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export function setupPDFWorker() {
    if (typeof window !== "undefined") {
        // Client-side: use CDN worker
        pdfjsLib.GlobalWorkerOptions.workerSrc =
            `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    } else {
        // Server-side: Point to local file to verify it exists
        const path = require('path');
        const { pathToFileURL } = require('url');
        const workerPath = path.join(process.cwd(), 'node_modules/pdfjs-dist/build/pdf.worker.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
    }
    return pdfjsLib;
}
