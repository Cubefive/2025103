import App from './components/App.js';

console.log('main.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('Document readyState:', document.readyState);
  console.log('Checking for root element');
  const rootElement = document.getElementById('root'); // Ändrat från 'app' till 'root'
  if (!rootElement) {
    console.error('Root element #root not found in DOM');
    return;
  }
  console.log('Root element found:', rootElement);
  try {
    const app = new App(rootElement);
    console.log('App instance created');
    app.init();
  } catch (error) {
    console.error('Error initializing App:', error);
  }
});