import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Mock servisi daha açık şekilde başlat
async function startApp() {
  // Geliştirme ortamında mock servisi başlat
  if (process.env.NODE_ENV !== 'production') {
    console.log('[DEV] MSW mock servisini başlatıyor...');
    try {
      const { worker } = await import('./mocks/browser');
      
      // MSW worker'ı başlat
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        }
      });
      
      console.log('[DEV] MSW mock servisi başlatıldı!');
      console.log('[DEV] API istekleri /api/* için yakalanacak');
    } catch (error) {
      console.error('[DEV] MSW başlatma hatası:', error);
    }
  }

  // React uygulamasını başlat
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div className='min-h-screen flex items-center justify-center bg-background py-6'>
      <App />
      </div>
    </StrictMode>,
  )
}

startApp().catch(err => {
  console.error('Uygulama başlatma hatası:', err);
});
