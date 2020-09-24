const chalk = require('chalk');
const logSymbols = require('log-symbols');
const os = require('os');

const { Configs: { devConfig } } = require('../project.config');

/**
 * 获取当前 Webpack Dev 展示哪个类型的终端样式
 */
const getWebpackDevTerminalStyle = () => {
  const { TERM_PROGRAM, TERMINAL_EMULATOR } = process.env;

  switch (devConfig.terminalStyle) {
    case 'auto':
      if (TERMINAL_EMULATOR === 'JetBrains-JediTerm' || TERM_PROGRAM === 'vscode') {
        return 'progress';
      } else {
        return 'dashboard';
      }
    case 'dashboard':
      return 'dashboard';
    case 'progress':
      return 'progress';
    default:
      return 'default';
  }
};


const LOG_COLOR = {
  info: 'blueBright',
  success: 'greenBright',
  warning: 'yellowBright',
  error: 'redBright',
};
/**
 * 集成 LOGGER
 * @param {string} msg
 * @param {'info' | 'success' | 'warning' | 'error' | 'default'} type
 * @param {boolean} showInfo 是否展示类型提示文字
 * @param {boolean} bold 是否加粗
 */
const log = (msg, type = 'info', showInfo = true, bold = false) => {
  msg = chalk[LOG_COLOR[type]](`[${logSymbols[type]}]${showInfo ? ` ${type}` : ''} ${msg}`);
  if (bold) {
    console.log(chalk.bold(msg));
  } else {
    console.log(msg);
  }
};

/**
 * 获取本地 IP
 */
const getIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    const interface = interfaces[devName];
    for (let i = 0; i < interface.length; i++) {
      const alias = interface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
};

/**
 * 获取字符串的 Hash
 * @param {string} str
 * @param {number} cat 保留几位
 */
const str2Hash = (str, cat) => {
  let hash = ~~(Math.random() * 1e10);
  let ch;

  for (let i = str.length - 1; i >= 0; i--) {
    ch = str.charCodeAt(i);
    hash ^= ((hash << 5) + ch + (hash >> 2));
  }

  const ans = hash & 0x7FFFFFFF;
  return cat > 0 ? `${ans}`.slice(0, ~~cat) : ans;
};

module.exports = {
  getWebpackDevTerminalStyle,
  logger: log,
  getIpAddress,
  str2Hash
};