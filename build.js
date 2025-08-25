/**
 * 派派座位表 - 构建脚本
 * 用于生成代码混淆和保护的生产版本
 * 
 * 使用方法：
 * node build.js
 */

const fs = require('fs');
const path = require('path');

class BuildProtection {
    constructor() {
        this.sourceDir = './';
        this.distDir = './dist';
        this.files = [
            'index.html',
            'app.js',
            'style.css',
            'protect.js'
        ];
    }

    // 创建分发目录
    createDistDirectory() {
        if (!fs.existsSync(this.distDir)) {
            fs.mkdirSync(this.distDir);
        }
        console.log('✅ 创建分发目录完成');
    }

    // 简单的字符串混淆
    obfuscateString(str) {
        // 将字符串转为Base64编码
        return Buffer.from(str).toString('base64');
    }

    // 变量名混淆
    obfuscateVariables(code) {
        const varMapping = {
            'SeatingApp': '_0xa1b2c3',
            'students': '_0xd4e5f6',
            'seats': '_0xg7h8i9',
            'rows': '_0xj1k2l3',
            'cols': '_0xm4n5o6',
            'selectedStudent': '_0xp7q8r9',
            'selectedSeat': '_0xs1t2u3',
            'history': '_0xv4w5x6',
            'constraints': '_0xy7z8a9',
            'renderClassroom': '_0xb1c2d3',
            'renderStudentList': '_0xe4f5g6',
            'loadData': '_0xh7i8j9',
            'saveData': '_0xk1l2m3',
            'addStudent': '_0xn4o5p6',
            'deleteStudent': '_0xq7r8s9',
            'randomSeatArrangement': '_0xt1u2v3'
        };

        let obfuscatedCode = code;
        for (const [original, obfuscated] of Object.entries(varMapping)) {
            const regex = new RegExp(`\\b${original}\\b`, 'g');
            obfuscatedCode = obfuscatedCode.replace(regex, obfuscated);
        }

        return obfuscatedCode;
    }

    // 添加虚假代码
    addDecoyCode(code) {
        const decoyFunctions = [
            `
            function _0xfake1() {
                const _0xtemp = Math.random() * 1000;
                return _0xtemp > 500 ? 'alpha' : 'beta';
            }
            `,
            `
            const _0xfake2 = {
                process: function(data) {
                    return data.toString().split('').reverse().join('');
                },
                validate: function(input) {
                    return input.length > 0 && typeof input === 'string';
                }
            };
            `,
            `
            function _0xfake3(arr) {
                if (!Array.isArray(arr)) return [];
                return arr.filter((item, index) => index % 2 === 0);
            }
            `
        ];

        // 在代码中随机插入虚假函数
        const insertPoints = [
            code.indexOf('class'),
            code.indexOf('constructor'),
            code.indexOf('init()')
        ].filter(point => point > -1);

        let result = code;
        insertPoints.forEach((point, index) => {
            if (decoyFunctions[index]) {
                result = result.slice(0, point) + decoyFunctions[index] + result.slice(point);
            }
        });

        return result;
    }

    // 压缩代码（简单版本）
    minifyCode(code) {
        return code
            // 移除多行注释
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // 移除单行注释（保留URL中的//）
            .replace(/\/\/(?![^\r\n]*https?:).*$/gm, '')
            // 移除多余的空白
            .replace(/\s+/g, ' ')
            // 移除行首行尾空白
            .replace(/^\s+|\s+$/g, '')
            // 移除多余的分号
            .replace(/;+/g, ';')
            // 移除空行
            .replace(/\n\s*\n/g, '\n');
    }

    // 处理JavaScript文件
    processJavaScript(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        let processed = content;
        
        // 只对app.js进行深度混淆
        if (filePath.includes('app.js')) {
            console.log('🔄 处理主应用文件...');
            processed = this.obfuscateVariables(processed);
            processed = this.addDecoyCode(processed);
        }
        
        // 压缩代码
        processed = this.minifyCode(processed);
        
        return processed;
    }

    // 处理CSS文件
    processCSS(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // CSS压缩
        return content
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
            .replace(/\s+/g, ' ') // 压缩空白
            .replace(/; /g, ';') // 移除分号后空格
            .replace(/ {/g, '{') // 移除花括号前空格
            .replace(/} /g, '}') // 移除花括号后空格
            .trim();
    }

    // 处理HTML文件
    processHTML(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // HTML压缩和混淆
        return content
            .replace(/<!--[\s\S]*?-->/g, '') // 移除注释
            .replace(/\s+/g, ' ') // 压缩空白
            .replace(/> </g, '><') // 移除标签间空格
            .trim();
    }

    // 构建单个文件
    buildFile(fileName) {
        const sourcePath = path.join(this.sourceDir, fileName);
        const distPath = path.join(this.distDir, fileName);
        
        if (!fs.existsSync(sourcePath)) {
            console.log(`⚠️ 文件不存在: ${fileName}`);
            return;
        }

        let processed;
        const ext = path.extname(fileName);
        
        switch (ext) {
            case '.js':
                processed = this.processJavaScript(sourcePath);
                break;
            case '.css':
                processed = this.processCSS(sourcePath);
                break;
            case '.html':
                processed = this.processHTML(sourcePath);
                break;
            default:
                // 其他文件直接复制
                processed = fs.readFileSync(sourcePath, 'utf8');
        }

        fs.writeFileSync(distPath, processed);
        console.log(`✅ 处理完成: ${fileName}`);
    }

    // 生成额外保护文件
    generateExtraProtection() {
        // 生成robots.txt
        const robotsContent = `User-agent: *
Disallow: /
Crawl-delay: 86400

# 版权保护 - 禁止机器人抓取
# Copyright Protection - Crawler Disallowed`;

        fs.writeFileSync(path.join(this.distDir, 'robots.txt'), robotsContent);
        
        // 生成.htaccess（如果部署在Apache服务器）
        const htaccessContent = `# 派派座位表 - 版权保护设置
# Copyright Protection Settings

# 禁用服务器签名
ServerSignature Off

# 防止查看源码
<Files "*.js">
    Header set Content-Type "application/javascript; charset=utf-8"
    Header set Cache-Control "no-cache, no-store, must-revalidate"
</Files>

<Files "*.css">
    Header set Content-Type "text/css; charset=utf-8"
    Header set Cache-Control "no-cache, no-store, must-revalidate"
</Files>

# 防止直接访问源文件
<Files "*.bak">
    Deny from all
</Files>

<Files "*.log">
    Deny from all
</Files>`;

        fs.writeFileSync(path.join(this.distDir, '.htaccess'), htaccessContent);
        
        console.log('✅ 生成额外保护文件完成');
    }

    // 生成部署说明
    generateDeploymentGuide() {
        const guide = `# 派派座位表 - 部署指南

## 版权保护版本部署说明

此版本包含以下保护措施：

### 1. 代码保护
- 变量名混淆
- 代码压缩
- 虚假代码插入
- 域名验证

### 2. 运行时保护
- 开发者工具检测
- 右键菜单禁用
- 源码查看保护
- 页面完整性验证

### 3. 部署建议
- 部署到官方域名: https://paizuobao.asia/
- 启用HTTPS
- 配置适当的HTTP头部
- 监控异常访问

### 4. 文件说明
- index.html: 主页面文件
- app.js: 应用逻辑文件（已混淆）
- style.css: 样式文件（已压缩）
- protect.js: 保护层文件
- robots.txt: 搜索引擎爬取控制
- .htaccess: Apache服务器配置

### 5. 更新维护
保持源码版本在私有仓库，使用此构建版本进行公开部署。

---
© 2025 派派座位表 - 版权所有
构建时间: ${new Date().toLocaleString('zh-CN')}
`;

        fs.writeFileSync(path.join(this.distDir, 'DEPLOYMENT.md'), guide);
        console.log('✅ 生成部署说明完成');
    }

    // 执行构建
    build() {
        console.log('🚀 开始构建保护版本...\n');
        
        // 创建目录
        this.createDistDirectory();
        
        // 处理所有文件
        this.files.forEach(file => {
            this.buildFile(file);
        });
        
        // 生成额外文件
        this.generateExtraProtection();
        this.generateDeploymentGuide();
        
        console.log('\n🎉 构建完成！');
        console.log(`📁 输出目录: ${this.distDir}`);
        console.log('⚠️ 请将dist目录中的文件部署到生产环境');
        console.log('🔒 保护措施已激活，请在官方域名测试');
    }
}

// 执行构建
if (require.main === module) {
    const builder = new BuildProtection();
    builder.build();
}