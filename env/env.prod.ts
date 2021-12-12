export default {
  production: true,
  baseUrl: 'http://localhost:4200',
  useEmulators: false,
  firebase: {
    options: {
      apiKey: 'demo',
      appId: 'demo',
      projectId: 'demo-market',
      authDomain: 'demo-market.firebaseapp.com',
      storageBucket: 'default-bucket',
    }
  }
};
