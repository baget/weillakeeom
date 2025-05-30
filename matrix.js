// Matrix digital rain effect
class MatrixEffect {
    constructor() {
        this.canvas = document.getElementById('matrix-bg');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.characters = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ123456789@#$%&'.split('');
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.initialize();

        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.initialize();
        });

        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initialize() {
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
    }

    draw() {
        // Semi-transparent black to create fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#0fa';
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            // Random character
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            
            // Main green characters
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            // Add glow effect
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#0fa';
            
            // Draw the character
            this.ctx.fillText(char, x, y);
            
            // Reset shadow
            this.ctx.shadowBlur = 0;

            // White leading character for glow effect
            if (Math.random() > 0.975) {
                this.ctx.fillStyle = '#fff';
                this.ctx.fillText(char, x, y);
                this.ctx.fillStyle = '#0fa';
            }

            // Reset drops after they reach bottom or randomly
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            // Move drop
            this.drops[i]++;
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Start Matrix effect when page loads
window.addEventListener('load', () => {
    new MatrixEffect();
});