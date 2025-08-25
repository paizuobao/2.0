/**
 * 派派座位表 - 页面保护层
 * Copyright © 2025 派派座位表 - 版权所有
 * 
 * 警告：此代码受版权保护，未经授权不得复制、修改或分发
 * Warning: This code is protected by copyright law. Unauthorized copying, modification or distribution is prohibited.
 */

// 增强的右键和快捷键保护
(function() {
    'use strict';
    
    
    // 全面的右键拦截
    const blockRightClick = function(e) {
        e = e || window.event;
        
        // 检测所有右键相关事件
        if (e.button === 2 || e.which === 3 || e.type === 'contextmenu' ||
            (e.type === 'mousedown' && e.button === 2) ||
            (e.type === 'mouseup' && e.button === 2) ||
            (e.buttons && (e.buttons & 2))) {
            
            // 阻止所有默认行为
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            if (e.returnValue !== undefined) e.returnValue = false;
            if (e.cancelBubble !== undefined) e.cancelBubble = true;
            
            return false;
        }
    };
    
    // 增强的快捷键拦截
    const blockKeys = function(e) {
        const keyCode = e.keyCode || e.which;
        const key = e.key ? e.key.toLowerCase() : '';
        const ctrl = e.ctrlKey;
        const shift = e.shiftKey;
        const alt = e.altKey;
        const meta = e.metaKey;
        
        // 定义被禁用的快捷键组合
        const blockedCombinations = [
            // 开发者工具
            keyCode === 123, // F12
            key === 'f12',
            (ctrl && shift && keyCode === 73), // Ctrl+Shift+I
            (ctrl && shift && key === 'i'),
            (ctrl && shift && keyCode === 74), // Ctrl+Shift+J
            (ctrl && shift && key === 'j'),
            (ctrl && shift && keyCode === 67), // Ctrl+Shift+C
            (ctrl && shift && key === 'c'),
            (ctrl && keyCode === 85), // Ctrl+U (查看源码)
            (ctrl && key === 'u'),
            
            // Safari/Mac 快捷键
            (meta && alt && keyCode === 73), // Cmd+Option+I
            (meta && alt && key === 'i'),
            (meta && alt && keyCode === 74), // Cmd+Option+J
            (meta && alt && key === 'j'),
            (meta && keyCode === 85), // Cmd+U
            (meta && key === 'u'),
            
            // Firefox 快捷键
            (ctrl && shift && keyCode === 75), // Ctrl+Shift+K
            (ctrl && shift && key === 'k'),
            
            // 保存页面
            (ctrl && keyCode === 83), // Ctrl+S
            (ctrl && key === 's'),
            (meta && keyCode === 83), // Cmd+S
            (meta && key === 's'),
            
            // 打印
            (ctrl && keyCode === 80), // Ctrl+P
            (ctrl && key === 'p'),
            (meta && keyCode === 80), // Cmd+P
            (meta && key === 'p'),
            
            // 复制（在非输入框中禁用）
            (ctrl && keyCode === 67 && !isInputField(e.target)), // Ctrl+C
            (ctrl && key === 'c' && !isInputField(e.target)),
            (meta && keyCode === 67 && !isInputField(e.target)), // Cmd+C
            (meta && key === 'c' && !isInputField(e.target))
        ];
        
        // 检查是否命中禁用列表
        if (blockedCombinations.some(condition => condition)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            return false;
        }
    };
    
    // 检查是否为输入字段
    function isInputField(element) {
        const inputTags = ['INPUT', 'TEXTAREA', 'SELECT'];
        return inputTags.includes(element.tagName) || 
               element.contentEditable === 'true';
    }
    
    // 多层次事件绑定
    function bindProtection() {
        // 右键保护
        const rightClickEvents = ['contextmenu', 'mousedown', 'mouseup', 'auxclick'];
        rightClickEvents.forEach(eventType => {
            document.addEventListener(eventType, blockRightClick, true);
            document.addEventListener(eventType, blockRightClick, false);
            window.addEventListener(eventType, blockRightClick, true);
        });
        
        // 键盘保护
        const keyboardEvents = ['keydown', 'keypress', 'keyup'];
        keyboardEvents.forEach(eventType => {
            document.addEventListener(eventType, blockKeys, true);
            document.addEventListener(eventType, blockKeys, false);
            window.addEventListener(eventType, blockKeys, true);
        });
        
        // 直接属性绑定
        document.oncontextmenu = blockRightClick;
        document.onmousedown = blockRightClick;
        document.onmouseup = blockRightClick;
        document.onkeydown = blockKeys;
        document.onkeypress = blockKeys;
        
        if (window) {
            window.oncontextmenu = blockRightClick;
            window.onkeydown = blockKeys;
        }
    }
    
    // 立即绑定保护
    bindProtection();
    
    // 页面加载后重新绑定
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindProtection);
    }
    window.addEventListener('load', bindProtection);
    
    // 定期重新绑定，防止被移除
    setInterval(bindProtection, 2000);
    
    // 禁用选择文本（除了输入框）
    document.addEventListener('selectstart', function(e) {
        if (!isInputField(e.target)) {
            e.preventDefault();
            return false;
        }
    });
    
    // 禁用拖拽（除了应用内的拖拽功能）
    document.addEventListener('dragstart', function(e) {
        // 允许应用内的学生拖拽功能
        if (e.target.classList.contains('student-item') || 
            e.target.closest('.student-item') ||
            e.target.classList.contains('seat') ||
            e.target.closest('.seat')) {
            return true;
        }
        e.preventDefault();
        return false;
    });
    
})();

// 额外的页面保护措施
(function() {
    'use strict';
    
    // 控制台版权警告
    function showCopyrightWarning() {
        const styles = [
            'color: #e74c3c',
            'font-size: 18px',
            'font-weight: bold'
        ].join(';');
        
        console.log('%c⚠️ 派派·座位表 ⚠️', styles);
        console.log('%c版权所有 - 请勿随意复制', 'color: #c0392b; font-size: 14px;');
        console.log('%c© ' + new Date().getFullYear() + ' 派派座位表', 'color: #7f8c8d; font-size: 12px;');
    }
    
    // 基本开发者工具检测
    function detectDevTools() {
        // 简单的窗口尺寸检测
        setInterval(() => {
            const heightDiff = window.outerHeight - window.innerHeight;
            const widthDiff = window.outerWidth - window.innerWidth;
            
            if (heightDiff > 150 || widthDiff > 150) {
                showCopyrightWarning();
            }
        }, 5000);
        
        // 基本的调试器检测
        setInterval(() => {
            const before = Date.now();
            debugger;
            const after = Date.now();
            if (after - before > 100) {
                showCopyrightWarning();
            }
        }, Math.random() * 10000 + 5000);
    }
    
    // 初始化保护
    function initProtection() {
        showCopyrightWarning();
        detectDevTools();
    }
    
    // 页面加载时启动保护
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProtection);
    } else {
        initProtection();
    }
    
})();