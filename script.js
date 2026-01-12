class TVIPlayer {
    constructor() {
        this.videos = ['videos/video1.mp4', 'videos/video2.mp4', 'videos/video3.mp4'];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.player = document.getElementById('main-player');
        this.sidebar = document.querySelector('.sidebar');

        // Carga inicial
        this.player.src = this.videos[this.currentIndex];

        // Evento: Solo cuando termina el video actual
        this.player.onended = () => this.transitionToNext();

        this.updateTime();
        this.updateWeatherLive();
        this.startSidebarCycle();
    }

    transitionToNext() {
        // 1. Inicia el desvanecimiento a blanco (2 segundos)
        this.player.classList.add('fade-out');

        // 2. Esperamos a que el video sea invisible para cambiar la fuente
        setTimeout(() => {
            this.currentIndex = (this.currentIndex + 1) % this.videos.length;
            this.player.src = this.videos[this.currentIndex];
            this.player.load();

            // 3. Cuando el nuevo video esté listo, lo reproducimos y lo mostramos
            this.player.oncanplay = () => {
                this.player.play();
                this.player.classList.remove('fade-out');
                this.player.oncanplay = null; // Limpiar para el siguiente ciclo
            };
        }, 800); // Coincide con el tiempo del CSS
    }

    startSidebarCycle() {
        const hide = () => {
            this.sidebar.classList.add('hidden-panel');
            setTimeout(show, 15000);
        };
        const show = () => {
            this.sidebar.classList.remove('hidden-panel');
            setTimeout(hide, 30000);
        };
        setTimeout(hide, 30000);
    }

    async updateWeatherLive() {
        try {
            const response = await fetch('https://wttr.in/Arica?format=j1');
            const data = await response.json();
            document.getElementById('temperatura').textContent = Math.round(data.current_condition[0].temp_C) + '°C';
            document.getElementById('ciudad').textContent = `Arica (${data.current_condition[0].humidity}%)`;
        } catch (e) { console.error(e); }
        setTimeout(() => this.updateWeatherLive(), 300000);
    }

    updateTime() {
        const now = new Date();
        document.getElementById('hora').textContent = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
        document.getElementById('fecha').textContent = now.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }).replace(/^\w/, c => c.toUpperCase());
        setTimeout(() => this.updateTime(), 1000);
    }
}

window.onload = () => new TVIPlayer();