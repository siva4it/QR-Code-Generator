# QR Code Generator

A beautiful, modern QR code generator web application that can run directly on GitHub Pages. Generate QR codes for URLs, text, phone numbers, emails, WiFi credentials, and more with customizable options.

## ✨ Features

- **Real-time Generation**: QR codes are generated instantly as you type
- **Customizable Options**: 
  - Size (128x128, 256x256, 512x512)
  - Colors (foreground and background)
  - Error correction levels (L, M, Q, H)
- **Multiple Download Formats**: PNG and SVG formats
- **Quick Examples**: Pre-filled examples for common use cases
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + Enter`: Generate QR code
  - `Escape`: Clear input
- **Right-click Context Menu**: Quick actions for copying text and downloading
- **Modern UI**: Beautiful gradient design with smooth animations

## 🚀 Live Demo

Visit the live application: [https://siva4it.github.io/QR-Code-Generator/](https://siva4it.github.io/QR-Code-Generator/)

## 📱 Supported QR Code Types

- **URLs**: Direct links to websites
- **Text**: Plain text messages
- **Phone Numbers**: `tel:+1234567890`
- **Email**: `mailto:example@email.com`
- **WiFi**: `WIFI:S:NetworkName;T:WPA;P:Password;;`
- **SMS**: `sms:+1234567890:Message`
- **Geolocation**: `geo:latitude,longitude`
- **vCard**: Contact information

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Vanilla JavaScript with async/await
- **QRCode.js**: Client-side QR code generation library
- **Font Awesome**: Icons
- **Google Fonts**: Inter font family

## 📦 Installation & Deployment

### Option 1: Deploy to GitHub Pages (Recommended)

1. **Fork or Clone this repository**
   ```bash
   git clone https://github.com/siva4it/QR-Code-Generator.git
   cd QR-Code-Generator
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to "GitHub Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access your app**
   - Your app will be available at: `https://siva4it.github.io/QR-Code-Generator/`

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/siva4it/QR-Code-Generator.git
   cd QR-Code-Generator
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```

3. **Access locally**
   - Open `http://localhost:8000` in your browser

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #ffd700;
}
```

### Adding New QR Code Types
Add new example buttons in `index.html`:
```html
<button class="example-btn" data-text="your-custom-text">Custom Type</button>
```

### Modifying Options
Update the options in `script.js`:
```javascript
const options = {
    width: parseInt(qrSize.value),
    margin: 2,
    color: {
        dark: qrColor.value,
        light: qrBgColor.value
    },
    errorCorrectionLevel: qrErrorCorrection.value
};
```

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 API Reference

The app uses the [QRCode.js](https://github.com/davidshimjs/qrcode) library with the following methods:

### QRCode.toString(text, options)
Generates QR code as SVG string.

### QRCode.toCanvas(text, options)
Generates QR code as canvas element.

### Options Object
```javascript
{
    width: number,           // QR code size
    margin: number,          // Margin around QR code
    color: {
        dark: string,        // Foreground color
        light: string        // Background color
    },
    errorCorrectionLevel: string  // 'L', 'M', 'Q', 'H'
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [QRCode.js](https://github.com/davidshimjs/qrcode) - QR code generation library
- [Font Awesome](https://fontawesome.com/) - Icons
- [Google Fonts](https://fonts.google.com/) - Inter font family
- [GitHub Pages](https://pages.github.com/) - Hosting platform

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the existing issues for solutions
- Contact the maintainer

---

Made with ❤️ for the open source community 