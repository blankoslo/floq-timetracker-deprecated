export default () => ({
  request(config) {
    config.headers['X-Access-Token'] = `${window.apiToken}`;
    return config;
  }
});
