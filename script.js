class TVIPlayer {
    constructor() {
        this.videos = ['videos/video1.mp4','videos/video2.mp4','videos/video2.mp4'];
        this.init();
    }

    init() {
        this.mainPlayer = document.getElementById('main-player');
        this.mainPlayer.src = this.videos[0];
        this.mainPlayer.play();
        this.autoPlayRandom();
        this.updateTime();
        this.updateWeatherLive();
    }

    /** CLIMA TIEMPO REAL - wttr.in (SATÉLITE ACTUAL) */
    async updateWeatherLive() {
        try {
            const response = await fetch('https://wttr.in/Arica?format=j1');
            const data = await response.json();
            
            // DATOS REALES DEL SATÉLITE
            const tempReal = Math.round(data.current_condition[0].temp_C);
            const feelsLike = Math.round(data.current_condition[0].FeelsLikeC);
            const humidity = data.current_condition[0].humidity;
            const desc = data.current_condition[0].weatherDesc[0].value;
            
            // MUESTRA TEMPERATURA REAL
            document.getElementById('temperatura').textContent = tempReal + '°C';
            document.getElementById('ciudad').textContent = `Arica (${humidity}%)`;
            
            // ÍCONO REAL por descripción meteorológica
            const iconMap = {
                'Sunny': '☀️', 'Clear': '☀️', 'Mostly Clear': '🌤️', 'Partly Cloudy': '⛅',
                'Cloudy': '☁️', 'Overcast': '☁️', 'Mist': '🌫️', 'Rain': '🌧️',
                'Light Rain': '🌦️', 'Heavy Rain': '⛈️'
            };
            document.getElementById('clima-icon').textContent = iconMap[desc] || '🌤️';
            
            console.log(`🌡️ TIEMPO REAL Arica: ${tempReal}°C (sensación ${feelsLike}°C) - ${desc}`);
            
        } catch (error) {
            // ERROR MÍNIMO - Mantiene último valor válido
            console.error('API temporalmente no disponible');
        }
        
        // ACTUALIZA CADA 5 MINUTOS (estándar meteorológico)
        setTimeout(() => this.updateWeatherLive(), 1000);
    }

    autoPlayRandom() {
        setInterval(() => {
            const randomVideo = this.videos[Math.floor(Math.random() * this.videos.length)];
            this.mainPlayer.src = randomVideo;
            this.mainPlayer.play();
            console.log('▶️ Video:', randomVideo);
        }, 45000);
    }

    updateTime() {
        const now = new Date();
        document.getElementById('hora').textContent = now.toLocaleTimeString('es-CL', {
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Santiago'
        });
        document.getElementById('fecha').textContent = now.toLocaleDateString('es-CL', {
            weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', timeZone: 'America/Santiago'
        }).replace(/^\w/, c => c.toUpperCase());
        setTimeout(() => this.updateTime(), 1000);
    }
}

new TVIPlayer();
