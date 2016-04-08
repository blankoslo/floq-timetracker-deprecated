export default function() {
  return {
    request: function(config) {
      config.headers['X-Access-Token'] = window.apiToken;
      return config;
    }
  };
};
