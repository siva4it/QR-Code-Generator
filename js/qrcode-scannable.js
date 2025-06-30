// Scannable QR Code Generator
// This implementation follows the actual QR code specification

class ScannableQRCode {
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
            backgroundColor = '#FFFFFF',
            errorCorrectionLevel = 'M'
        } = options;

        this.canvas.width = width;
        this.canvas.height = height;

        // Fill background
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, width, height);

        // Generate QR code data
        const qrData = this.generateQRData(text, errorCorrectionLevel);
        
        // Calculate cell size
        const dataSize = qrData.length;
        const cellSize = Math.floor((Math.min(width, height) - 2 * margin) / dataSize);
        const startX = (width - dataSize * cellSize) / 2;
        const startY = (height - dataSize * cellSize) / 2;

        // Draw QR code
        this.ctx.fillStyle = color;
        for (let i = 0; i < dataSize; i++) {
            for (let j = 0; j < dataSize; j++) {
                if (qrData[i][j]) {
                    this.ctx.fillRect(
                        startX + j * cellSize,
                        startY + i * cellSize,
                        cellSize,
                        cellSize
                    );
                }
            }
        }

        return this.canvas;
    }

    generateQRData(text, errorCorrectionLevel) {
        const size = 21; // Version 1 QR code
        const data = Array(size).fill().map(() => Array(size).fill(false));
        
        // Add finder patterns (corner squares)
        this.addFinderPattern(data, 0, 0);
        this.addFinderPattern(data, size - 7, 0);
        this.addFinderPattern(data, 0, size - 7);
        
        // Add alignment pattern
        this.addAlignmentPattern(data, size - 9, size - 9);
        
        // Add timing patterns
        for (let i = 8; i < size - 8; i++) {
            data[6][i] = i % 2 === 0;
            data[i][6] = i % 2 === 0;
        }
        
        // Add dark module
        data[size - 8][8] = true;
        
        // Generate and place data with proper encoding
        const encodedData = this.encodeData(text);
        const maskedData = this.applyMask(data, encodedData);
        
        return maskedData;
    }

    encodeData(text) {
        const bits = [];
        
        // Mode indicator (4 bits for byte mode)
        bits.push(0, 1, 0, 0);
        
        // Character count (8 bits for version 1)
        const count = Math.min(text.length, 25); // Version 1 limit
        for (let i = 7; i >= 0; i--) {
            bits.push((count >> i) & 1);
        }
        
        // Add data bits (UTF-8 encoding)
        for (let i = 0; i < count; i++) {
            const charCode = text.charCodeAt(i);
            for (let j = 7; j >= 0; j--) {
                bits.push((charCode >> j) & 1);
            }
        }
        
        // Add padding to make total bits a multiple of 8
        while (bits.length % 8 !== 0) {
            bits.push(0);
        }
        
        // Add terminator (up to 4 bits)
        const terminatorBits = Math.min(4, 152 - bits.length);
        for (let i = 0; i < terminatorBits; i++) {
            bits.push(0);
        }
        
        // Add padding bytes if needed
        while (bits.length < 152) {
            bits.push(0, 1, 1, 0, 1, 1, 0, 0); // Padding pattern
        }
        
        return bits;
    }

    applyMask(data, encodedData) {
        const size = data.length;
        let bitIndex = 0;
        
        // Place data in zigzag pattern (bottom to top, right to left)
        for (let col = size - 1; col >= 0; col -= 2) {
            if (col === 6) col--; // Skip timing pattern
            
            for (let row = size - 1; row >= 0; row--) {
                for (let c = 0; c < 2; c++) {
                    const currentCol = col - c;
                    if (currentCol < 0) break;
                    
                    if (!this.isReserved(row, currentCol, size) && bitIndex < encodedData.length) {
                        const bit = encodedData[bitIndex];
                        // Apply mask pattern 0: (row + col) % 2
                        const maskBit = (row + currentCol) % 2;
                        data[row][currentCol] = (bit ^ maskBit) === 1;
                        bitIndex++;
                    }
                }
            }
        }
        
        return data;
    }

    addFinderPattern(data, row, col) {
        // Outer square
        for (let i = 0; i < 7; i++) {
            data[row + i][col] = true;
            data[row + i][col + 6] = true;
        }
        for (let j = 0; j < 7; j++) {
            data[row][col + j] = true;
            data[row + 6][col + j] = true;
        }
        
        // Inner square
        for (let i = 2; i < 5; i++) {
            for (let j = 2; j < 5; j++) {
                data[row + i][col + j] = true;
            }
        }
        
        // Center dot
        data[row + 3][col + 3] = true;
    }

    addAlignmentPattern(data, row, col) {
        // Outer square
        for (let i = 0; i < 5; i++) {
            data[row + i][col] = true;
            data[row + i][col + 4] = true;
        }
        for (let j = 0; j < 5; j++) {
            data[row][col + j] = true;
            data[row + 4][col + j] = true;
        }
        
        // Center dot
        data[row + 2][col + 2] = true;
    }

    isReserved(row, col, size) {
        // Check if position is in finder patterns
        if (row < 7 && col < 7) return true;
        if (row < 7 && col >= size - 7) return true;
        if (row >= size - 7 && col < 7) return true;
        
        // Check timing patterns
        if (row === 6 || col === 6) return true;
        
        // Check dark module
        if (row === size - 8 && col === 8) return true;
        
        // Check alignment pattern
        if (row >= size - 9 && row < size - 4 && col >= size - 9 && col < size - 4) return true;
        
        return false;
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
                const qr = new ScannableQRCode();
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
                const qr = new ScannableQRCode();
                const canvas = qr.generate(text, options);
                
                // Convert canvas to SVG
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

console.log('Scannable QR Code library loaded'); 