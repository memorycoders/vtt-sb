// put all app configuration here with a sensible default and then override per machine/environment/etc in other config files
// more docs on how config files work = https://github.com/lorenwest/node-config/wiki/Configuration-Files
// NOTE: temporary local config (for local debugging/development) can be put into config/local.js (it's git ignored)
const envValueQA = {
  // apiHost: '10.58.71.187:8080',
  // apiHost: 'salesbox.gemvietnam.com/backend',
  apiHost: '172.16.10.43:8080/',
  // apiHost: 'production-qa.salesbox.com',
  notificationServerUrl: 'https://notification-test.salesbox.com/ws', //qa
  oldWebVersion: 'https://qa.salesbox.com',
};
const envValueTestVT = {
  apiHost: '10.58.71.187:8080/',
  protocol: 'http',
  notificationServerUrl: 'https://notification-test.salesbox.com/ws', //qa
  oldWebVersion: 'https://qa.salesbox.com',
};

const envValueProduction = {
  apiHost: 'affapi.viettel.vn/salebox',
  notificationServerUrl: 'https://notification.salesbox.com/ws', //production
  oldWebVersion: 'https://old-go.salesbox.com',
};
// const envVal = envValueProduction;
const envVal = envValueQA;
// const envVal = envValueTestVT;

const api = {
  // protocol: envVal.protocol || 'https',
  protocol: 'http',
  // version: 'v2',
  // host: 'production-qa.salesbox.com',
  // host: 'production.salesbox.com',
  host: envVal.apiHost,
  route: null,
};

const auth = {
  protocol: 'https',
  host: 'localhost:8500',
  route: null,
};

module.exports = {
  host: undefined,
  port: 5000,
  debounceTime: 450,
  // config inside here will be available in the client browser app
  clientConfig: {
    api,
    auth,
  },
  api,
  enableServerSideRender: true,

  logIncomingHttpRequests: true,
  logOutgoingHttpRequests: true,

  logging: {
    consoleLogLevel: 'debug',
    logFileLogLevel: 'info',
    logFilePath: './logs/server.log',
    maxLogFileSizeInMB: 5,
    maxLogFileCount: 5,
  },
  envVal,
  timeLive: 3 * 3600 * 1000,
  // timeLive: 1 * 300 * 1000,
};
