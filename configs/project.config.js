const path = require('path');

const ROOT = path.join(__dirname, '..');

const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const DLL = path.join(ROOT, 'dll');

const ModulesPath = {
  ROOT,
  SRC,
  DIST,
  DLL
};

const Configs = {
  // Dll entrys
  // todo:: You can modify which you want to extract to dll
  dllEntry: {
    react: ['react', 'react-dom'],
    polyfill: ['@babel/polyfill'],
    // common: ['axios', 'classnames']
  },

  // Dev Configs
  devConfig: {
    port: 8080,
    terminalStyle: 'auto', // 终端展示样式
    // 'auto': 自动适应：
    //     - process.env.TERM_PROGRAM 是否为 vscode
    //     - process.env.TERMINAL_EMULATOR 是否为 JetBrains-JediTerm
    //     如果是上面两者，则选择 progress，反之是 dashboard
    // 'dashboard': NASA 界面
    // 'progress': 灵活的进度条
    // 'default': Webpack 默认
    proxy: {
      // todo:: 
      // dev Proxy
    }
  },

  bannerMsg: 'Make 2019 by Euphoria',
  // Webpack 将不会对下面的 from 模块进行处理，而是直接复制到 to 中
  // from 是相对于当前路径
  // to 是相对于 output 路径（dist）
  copyPlugin: [
    // {
    //   from: path.join(SRC, 'doc'),
    //   to: './doc'
    // }
  ],

  // 如果你需要打包分析（在生产模式下），可以设置为 true
  bundleAnalyzer: false,

  // todo:: alias
  alias: {
    // you can add some alias to project import
    // do not forget to add configurate in tsconfig.json
    //? You also can use ModulePath instead of path.resolve
    //? Like: '@': ModulePath.SRC
  }
};

module.exports = {
  ModulesPath,
  Configs
};
