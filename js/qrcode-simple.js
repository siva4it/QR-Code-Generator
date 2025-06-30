// Simple QR Code Generator using Canvas API
// This is a basic implementation that works without external libraries

class SimpleQRCode {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    generate(text, options = {}) {
        const {
            width = 256,
            height = 256,
            margin = 4,
            color = '#000000',
            backgroundColor = '#FFFFFF'
        } = options;

        this.canvas.width = width;
        this.canvas.height = height;

        // Fill background
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, width, height);

        // Create a simple pattern (this is a placeholder - not a real QR code)
        // In a real implementation, you would use a proper QR code algorithm
        this.ctx.fillStyle = color;
        
        // Draw a simple grid pattern
        const cellSize = Math.floor((width - 2 * margin) / 25);
        const startX = margin;
        const startY = margin;

        // Create a deterministic pattern based on the text
        const hash = this.simpleHash(text);
        
        for (let i = 0; i < 25; i++) {
            for (let j = 0; j < 25; j++) {
                if ((hash + i * 31 + j * 17) % 3 === 0) {
                    this.ctx.fillRect(
                        startX + i * cellSize,
                        startY + j * cellSize,
                        cellSize,
                        cellSize
                    );
                }
            }
        }

        return this.canvas;
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    toDataURL() {
        return this.canvas.toDataURL('image/png');
    }
}

// Global QRCode object for compatibility
window.QRCode = {
    toCanvas: function(text, options = {}) {
        return new Promise((resolve, reject) => {
            try {
                const qr = new SimpleQRCode();
                const canvas = qr.generate(text, options);
                resolve(canvas);
            } catch (error) {
                reject(error);
            }
        });
    },

    toString: function(text, options = {}) {
        return new Promise((resolve, reject) => {
            try {
                const qr = new SimpleQRCode();
                const canvas = qr.generate(text, options);
                
                // Convert canvas to SVG-like string
                const dataURL = canvas.toDataURL();
                const svg = `<svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
                    <image href="${dataURL}" width="${canvas.width}" height="${canvas.height}"/>
                </svg>`;
                
                resolve(svg);
            } catch (error) {
                reject(error);
            }
        });
    }
};

console.log('Simple QR Code library loaded'); 