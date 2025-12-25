// This utility now runs strictly on client side to avoid Node.js build errors with canvas/DOM

export async function parseResume(file: File): Promise<string> {
    if (typeof window === 'undefined') return '';

    try {
        // Dynamic import to ensure it never loads on server
        const pdfjsLib = await import('pdfjs-dist');

        // Set worker source
        // In production next.js, we need to point to the file in public
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + ' ';
        }

        return fullText;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        return 'Error parsing resume text. Please input manually.';
    }
}
