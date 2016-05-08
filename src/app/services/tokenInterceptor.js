export default () => ({
  request(config) {
    config.headers.Authorization = `Bearer ${window.apiToken}`;
    return config;
  }
});
