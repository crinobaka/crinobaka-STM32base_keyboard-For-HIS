// ui.js
class UIManager {
	constructor(serialManager, processor, commandManager) {
		this.serialManager = serialManager;
		this.processor = processor;
		this.commandManager = commandManager;
		// 保存配置引用,方便整个UI使用
		this.config = this.commandManager.config;
		this.isConnected = false;
		this.initUI();
	}

	// 初始化UI控件和事件绑定
	initUI() {
		this.connectBtn = document.getElementById('connectBtn');
		this.sendBtn = document.getElementById('sendBtn');
		this.textInput = document.getElementById('textInput');
		this.statusDiv = document.getElementById('status');
		this.modeSelect = document.getElementById('modeSelect');
		// ==========================
		// 按钮事件
		// ==========================
		this.connectBtn.addEventListener('click', () => this.toggleConnection());
		this.sendBtn.addEventListener('click', () => this.handleSend());
		// Enter发送（Shift+Enter换行）
		this.textInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				this.handleSend();
			}
		});
		// 输入模式切换
		this.modeSelect.addEventListener('change', (e) => {
			this.processor.config.ime.mode = e.target.value;
			this.updateStatus(`输入模式：${e.target.value}`, 'success');
		});
		// 串口断开回调
		this.serialManager.setDisconnectCallback(() => {
			this.isConnected = false;
			this.connectBtn.textContent = '🔌 连接串口';
			this.updateStatus('串口已断开', 'disconnected');
		});

	}
	// 切换连接状态
	async toggleConnection() {
		if (this.isConnected) {
			this.serialManager.disconnect();
			this.isConnected = false;
			this.connectBtn.textContent = '🔌 连接串口';
			this.updateStatus('已断开连接', 'disconnected');
			return;
		}
		const success = await this.serialManager.connect();
		if (success) {
			this.isConnected = true;
			this.connectBtn.textContent = '❌ 断开连接';
			this.updateStatus('串口连接成功', 'connected');
		} else {
			this.updateStatus('串口连接失败', 'error');
		}
	}
	// ============================================================
	// 处理发送文本
	// ============================================================
	async handleSend() {
		if (!this.isConnected) {
			this.updateStatus('请先连接串口', 'error');
			return;
		}
		const rawText = this.getInputText();
		if (!rawText.trim()) {
			this.updateStatus('请输入内容', 'error');
			return;
		}
		this.updateStatus('正在处理...', 'processing');
		try {
			// 文本预处理
			const processedText = this.processor.process(rawText);
			// 发送数据

			// await this.delay(this.config.ui.sendDelay);
			if (this.config.ui.sendDelay > 0) {
				await this.delay(this.config.ui.sendDelay);
			}

			const success = await this.serialManager.sendData(processedText);
			if (!success) {
				this.updateStatus('发送失败', 'error');
				return;
			}
			this.updateStatus('发送成功', 'success');
			
			// 根据配置决定是否清空
			if (this.config.ui.autoClear) {
				this.clearInput();
			}
			// 根据配置重新聚焦
			if (this.config.ui.autoFocus) {
				this.textInput.focus();
			}
		}
		catch (error) {
			console.error(error);
			this.updateStatus(
				`处理失败：${error.message}`,
				'error'
			);
		}
	}
	// 新增一个辅助方法，用于延时
	delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	// =======================================================
	// 在光标位置插入文本
	// =======================================================
	insertText(text, cursorOffset = 0) {
		const input = this.textInput;
		const start = input.selectionStart;
		const end = input.selectionEnd;
		const value = input.value;
		input.value =
			value.slice(0, start) +
			text +
			value.slice(end);
		const cursor = start + text.length + cursorOffset;
		input.selectionStart = cursor;
		input.selectionEnd = cursor;
		input.focus();
	}
	// ============================================================
	// 插入快捷命令
	// ============================================================
	insertCommand(commandKey) {
		if (!this.commandManager.hasCommand(commandKey)) {
			this.updateStatus(`未知命令：${commandKey}`, 'error');
			return;
		}
		const command = this.commandManager.formatCommand(commandKey);
		this.insertText(command);
		const info = this.commandManager.getCommandInfo(commandKey);
		this.updateStatus(
			`已添加命令：${info.title}`,
			'success'
		);
	}
	// ============================================================
	// 插入模板
	// ============================================================
	insertTemplate(templateKey) {
		if (!this.commandManager.hasTemplate(templateKey)) {
			this.updateStatus(
				`未知模板：${templateKey}`,
				'error'
			);
			return;
		}
		const text = this.commandManager.getTemplateValue(templateKey);
		const offset = this.commandManager.getTemplateCursorOffset(templateKey);
		this.insertText(text, offset);
		const info = this.commandManager.getTemplateInfo(templateKey);
		this.updateStatus(
			`已插入模板：${info.title}`,
			'success'
		);
	}
	// 清空
	clearInput() {
		this.textInput.value = '';
		this.textInput.focus();
	}
	// 更新状态显示
	updateStatus(message, type = 'info') {
		if (!this.statusDiv) return;
		this.statusDiv.textContent = message;
		this.statusDiv.className = `status ${type}`;
		// 可以添加日志记录
		console.log(`[${type.toUpperCase()}] ${message}`);
	}
	// 获取输入框文本
	getInputText() {
		return this.textInput.value;
	}
	// 设置输入框文本
	setInputText(text) {
		this.textInput.value = text;
	}
=======
// ui.js
class UIManager {
	constructor(serialManager, processor, commandManager) {
		this.serialManager = serialManager;
		this.processor = processor;
		this.commandManager = commandManager;
		// 保存配置引用,方便整个UI使用
		this.config = this.commandManager.config;
		this.isConnected = false;
		this.initUI();
	}

	// 初始化UI控件和事件绑定
	initUI() {
		this.connectBtn = document.getElementById('connectBtn');
		this.sendBtn = document.getElementById('sendBtn');
		this.textInput = document.getElementById('textInput');
		this.statusDiv = document.getElementById('status');
		this.modeSelect = document.getElementById('modeSelect');
		// ==========================
		// 按钮事件
		// ==========================
		this.connectBtn.addEventListener('click', () => this.toggleConnection());
		this.sendBtn.addEventListener('click', () => this.handleSend());
		// Enter发送（Shift+Enter换行）
		this.textInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				this.handleSend();
			}
		});
		// 输入模式切换
		this.modeSelect.addEventListener('change', (e) => {
			this.processor.config.ime.mode = e.target.value;
			this.updateStatus(`输入模式：${e.target.value}`, 'success');
		});
		// 串口断开回调
		this.serialManager.setDisconnectCallback(() => {
			this.isConnected = false;
			this.connectBtn.textContent = '🔌 连接串口';
			this.updateStatus('串口已断开', 'disconnected');
		});

	}
	// 切换连接状态
	async toggleConnection() {
		if (this.isConnected) {
			this.serialManager.disconnect();
			this.isConnected = false;
			this.connectBtn.textContent = '🔌 连接串口';
			this.updateStatus('已断开连接', 'disconnected');
			return;
		}
		const success = await this.serialManager.connect();
		if (success) {
			this.isConnected = true;
			this.connectBtn.textContent = '❌ 断开连接';
			this.updateStatus('串口连接成功', 'connected');
		} else {
			this.updateStatus('串口连接失败', 'error');
		}
	}
	// ============================================================
	// 处理发送文本
	// ============================================================
	async handleSend() {
		if (!this.isConnected) {
			this.updateStatus('请先连接串口', 'error');
			return;
		}
		const rawText = this.getInputText();
		if (!rawText.trim()) {
			this.updateStatus('请输入内容', 'error');
			return;
		}
		this.updateStatus('正在处理...', 'processing');
		try {
			// 文本预处理
			const processedText = this.processor.process(rawText);
			// 发送数据

			// await this.delay(this.config.ui.sendDelay);
			if (this.config.ui.sendDelay > 0) {
				await this.delay(this.config.ui.sendDelay);
			}

			const success = await this.serialManager.sendData(processedText);
			if (!success) {
				this.updateStatus('发送失败', 'error');
				return;
			}
			this.updateStatus('发送成功', 'success');
			
			// 根据配置决定是否清空
			if (this.config.ui.autoClear) {
				this.clearInput();
			}
			// 根据配置重新聚焦
			if (this.config.ui.autoFocus) {
				this.textInput.focus();
			}
		}
		catch (error) {
			console.error(error);
			this.updateStatus(
				`处理失败：${error.message}`,
				'error'
			);
		}
	}
	// 新增一个辅助方法，用于延时
	delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	// =======================================================
	// 在光标位置插入文本
	// =======================================================
	insertText(text, cursorOffset = 0) {
		const input = this.textInput;
		const start = input.selectionStart;
		const end = input.selectionEnd;
		const value = input.value;
		input.value =
			value.slice(0, start) +
			text +
			value.slice(end);
		const cursor = start + text.length + cursorOffset;
		input.selectionStart = cursor;
		input.selectionEnd = cursor;
		input.focus();
	}
	// ============================================================
	// 插入快捷命令
	// ============================================================
	insertCommand(commandKey) {
		if (!this.commandManager.hasCommand(commandKey)) {
			this.updateStatus(`未知命令：${commandKey}`, 'error');
			return;
		}
		const command = this.commandManager.formatCommand(commandKey);
		this.insertText(command);
		const info = this.commandManager.getCommandInfo(commandKey);
		this.updateStatus(
			`已添加命令：${info.title}`,
			'success'
		);
	}
	// ============================================================
	// 插入模板
	// ============================================================
	insertTemplate(templateKey) {
		if (!this.commandManager.hasTemplate(templateKey)) {
			this.updateStatus(
				`未知模板：${templateKey}`,
				'error'
			);
			return;
		}
		const text = this.commandManager.getTemplateValue(templateKey);
		const offset = this.commandManager.getTemplateCursorOffset(templateKey);
		this.insertText(text, offset);
		const info = this.commandManager.getTemplateInfo(templateKey);
		this.updateStatus(
			`已插入模板：${info.title}`,
			'success'
		);
	}
	// 清空
	clearInput() {
		this.textInput.value = '';
		this.textInput.focus();
	}
	// 更新状态显示
	updateStatus(message, type = 'info') {
		if (!this.statusDiv) return;
		this.statusDiv.textContent = message;
		this.statusDiv.className = `status ${type}`;
		// 可以添加日志记录
		console.log(`[${type.toUpperCase()}] ${message}`);
	}
	// 获取输入框文本
	getInputText() {
		return this.textInput.value;
	}
	// 设置输入框文本
	setInputText(text) {
		this.textInput.value = text;
	}
}
