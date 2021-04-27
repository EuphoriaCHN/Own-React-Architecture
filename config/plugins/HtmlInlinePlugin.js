const path = require('path');
const fs = require('fs');
const cwd = process.cwd();
const sass = require('sass');
const mime = require('mime');
const CleanCss = require('clean-css');
const cleanCss = new CleanCss();
const Terser = require('terser');
const jsExt = ['.js', '.ts'];
const acorn = require('acorn');

function getJsRegExp(postFix) {
  return new RegExp(`<script[^><]*src=['"]([^><]*)${postFix}['"][^><]*>\\s*(<\/script>)?`, 'img');
}
function getCssRegExp(postFix) {
  return new RegExp(`<link[^><]*href=['"]([^><]*\\.css[^><]*)${postFix}['"][^><]*>(\\s*<\/link>)?`, 'img');
}
function getHtmlRegExp(postFix) {
  return new RegExp(`<link[^><]*href=['"]([^><]*\\.(html|tpl|tmpl)[^><]*)${postFix}['"][^><]*>(\\s*<\/link>)?`, 'img');
}
function getSassRegExp() {
  return new RegExp('<link[^><]*href=[\'"]([^><]*\\.scss[^><]*)[\'"][^><]*>(\\s*<\/link>)?', 'img');
}
function getImageTagRegExp(postFix) {
  return new RegExp(`<img[^><]*src=['"]([^><]*\\.(jpe?g|png|gif|webp|svg)[^><]*)${postFix}['"][^><]*>(\\s*<\/img>)?`, 'img');
}
function getImageStyleRegExp(postFix) {
  return new RegExp(`style=['"]([^><]*\\.(jpe?g|png|gif|webp|svg)[^><]*)${postFix}[^><]*['"]`, 'img');
}
function getFontTagRegExp(postFix) {
  return new RegExp(`<link[^><]*href=['"]([^><]*\\.(woff2?|eot|ttf|otf)[^><]*)${postFix}['"][^><]*>(\\s*<\/link>)?`, 'img');
}
function getFontStyleRegExp(postFix) {
  return new RegExp(`style=['"]([^><]*\\.(woff2?|eot|ttf|otf)[^><]*)${postFix}[^><]*['"]`, 'img');
}

function fileResolve(src, currentFilePath) {
  if (~src.indexOf('//')) {
    return null;
  } else if (src[0] === '.') {
    return path.resolve(currentFilePath, '../', src).split('?')[0];
  } else {
    src = src[0] === '/' ? `.${src}` : `./${src}`;
    return path.resolve(cwd, src).split('?')[0];
  }
}

function inline(content, resourcePath) {
  return content && content.replace(/__inline\((['"])?([^'"]*)\1\);?/img, function (match, quota, url) {
    if (url[0] === '/') {
      url = path.resolve(cwd, `.${url}`);
    } else {
      url = path.resolve(resourcePath, '../', url);
    }

    let fileString;
    try {
      fileString = inline(fs.readFileSync(url).toString(), url);

      if (~jsExt.indexOf(path.extname(resourcePath)) && !~jsExt.indexOf(path.extname(url))) {
        return `\`${fileString.replace(/\$/img, '\\$')}\``;
      } else {
        return fileString;
      }
    } catch (e) {
      console.log(`Error finding inline files: ${url}, skip!`);
      return '';
    }
  });
}

const jsInlineCache = new Map();

function inlineCssOrJs(regExp, html, type, currentFilePath) {
  html = html.replace(regExp, function (match, src) {
    let filePath = fileResolve(src, currentFilePath);
    if (!filePath) {
      return match;
    }
    let file;
    try {
      file = fs.readFileSync(filePath).toString();
    } catch (e) {
      console.log(`File not found: ${filePath}，skip!`);
    }
    if (type === 'js') {
      let code = inline(file, filePath);
      if (process.env.NODE_ENV === 'development') {
        try {
          acorn.parse(code, {
            ecmaVersion: 5
          });
        } catch (e) {
          console.log(`${filePath} File contains non-ES5 syntax. \n${e.message}\n`);
        }
        file = code;
      } else {
        let result = jsInlineCache.get(code);
        if (!result) {
          result = Terser.minify(code, {
            mangle: {
              safari10: true
            },
            compress: {
              defaults: false,
              drop_console: true
            },
            output: {
              comments: 'some',
              ascii_only: true
            }
          });
          jsInlineCache.set(code, result);
        }
        if (result.error) {
          console.log(`Error compressing inline ES5 script in html, file path is: ${filePath}`);
          throw result.error;
        }
        file = result.code;
      }
    }
    if (type === 'sass') {
      try {
        file = sass.renderSync({
          data: file,
          includePaths: [process.cwd()]
        }).css.toString();
        file = file.replace('?__inline', '');
        file = cleanCss.minify(file).styles;
      } catch (e) {
        console.log(`Compile sass file error: ${filePath}, skip! Details are as follows
         :\n`);
        console.log(e);
      }
    }
    if (!file) {
      return '';
    }
    return type === 'js' ? `<script type="text/javascript">${file}</script>` :
      `<style type="text/css">${file}</style>`;
  });
  return html;
}

function inlineImage(regExp, html, type, currentFilePath) {
  html = html.replace(regExp, function (match, src) {
    let filePath = fileResolve(src, currentFilePath);
    if (!filePath) {
      return match;
    }
    let file;
    const mimetype = mime.getType(filePath);
    try {
      file = `data:${mimetype ? `${mimetype};` : ''}base64,${fs.readFileSync(filePath).toString('base64')}`;
    } catch (e) {
      console.log(`Image not found: ${filePath}, skip!`);
    }
    if (type === 'tag') {
      return match.replace(/src=['"]\S+['"]/, `src="${file}"`);
    } else if (type === 'style') {
      return match.replace(/url\(\S+\)/, `url(${file})`);
    }
  });
  return html;
}

function inlineFont(regExp, html, type, currentFilePath) {
  html = html.replace(regExp, function (match, src) {
    let filePath = fileResolve(src, currentFilePath);
    if (!filePath) {
      return match;
    }
    let file;
    const mimetype = mime.getType(filePath);
    try {
      file = `data:${mimetype ? `${mimetype};` : ''}base64,${fs.readFileSync(filePath).toString('base64')}`;
    } catch (e) {
      console.log(`Font not found: ${filePath}, skip!`);
    }
    if (type === 'tag') {
      return match.replace(/href=['"]\S+['"]/, `href="${file}"`);
    } else if (type === 'style') {
      return match.replace(/url\(\S+\)/, `url(${file})`);
    }
  });
  return html;
}


function inlineHtml(regExp, html, currentFilePath) {
  html = html.replace(regExp, function (match, src) {
    let filePath = fileResolve(src, currentFilePath);
    if (!filePath) {
      return match;
    }
    let file;
    try {
      file = inlineHtml(regExp, fs.readFileSync(filePath).toString(), filePath);
    } catch (e) {
      console.log(`File not found: ${filePath}, skip!`);
    }
    return file;
  });
  return html;
}

class HtmlInline {
  constructor(options) {
    this.postFix = options && options.postFix && `?${options.postFix}` || '?__inline';
    this.postFix = this.postFix === '?all' ? '' : this.postFix;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('htmlInline', compilation => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing &&
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(
          'htmlInline',
          data => {
            const currentFilePath = data.plugin.options.template.split('!')[1];
            let { html } = data;
            html = inlineCssOrJs(getJsRegExp(this.postFix), html, 'js', currentFilePath);
            html = inlineCssOrJs(getCssRegExp(this.postFix), html, 'css', currentFilePath);
            html = inlineCssOrJs(getSassRegExp(), html, 'sass', currentFilePath);
            html = inlineImage(getImageTagRegExp(this.postFix), html, 'tag', currentFilePath);
            html = inlineImage(getImageStyleRegExp(this.postFix), html, 'style', currentFilePath);
            html = inlineFont(getFontTagRegExp(this.postFix), html, 'tag', currentFilePath);
            html = inlineFont(getFontStyleRegExp(this.postFix), html, 'style', currentFilePath);
            html = inlineHtml(getHtmlRegExp(this.postFix), html, currentFilePath);
            data.html = html;
            return data;
          }
        );
    });
  }
}

module.exports = HtmlInline;