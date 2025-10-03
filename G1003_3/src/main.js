import App from './components/App.js';

console.log('main.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('Document readyState:', document.readyState);
  console.log('Checking for root element');
  const rootElement = document.getElementById('app');
  if (!rootElement) {
    console.error('Root element #app not found in DOM');
    return;
  }
  console.log('Root element found:', rootElement);
  try {
    const app = new App(rootElement);  // assuming constructor takes rootElement only
    console.log('App instance created');
    app.init();  // <-- add this line to initialize and render the app
  } catch (error) {
    console.error('Error initializing App:', error);
  }
});