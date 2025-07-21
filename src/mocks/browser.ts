// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Debug mesajları ekleyelim
console.log('[MSW] Browser başlatıcı yüklendi');

// Create and export the service worker
export const worker = setupWorker(...handlers);

// İstek sayacı
let requestCount = 0;

// Dinleyici ekle
worker.events.on('request:start', ({ request }) => {
  requestCount++;
  console.log(`[MSW] #${requestCount} İstek başladı: ${request.method} ${request.url.toString()}`);
});

// request:end olayı için event parametreleri düzeltildi
worker.events.on('request:end', ({ request, requestId }) => {
  console.log(`[MSW] #${requestCount} İstek tamamlandı: ${request.method} ${request.url.toString()}`);
});