<<<<<<< HEAD
// commands.js
class CommandManager {
    constructor(config) {
      this.config = config;
    }
  
    // ====================
    // 判断是否为系统命令
    // ====================
    hasCommand(commandKey) {
      return Object.prototype.hasOwnProperty.call(
        this.config.commands,commandKey
      );
    }
  
    // ====================
    // 获取命令完整信息
    // ====================
    getCommandInfo(commandKey) {
      return this.config.commands[commandKey] || null;
    }

    // ====================
    // 获取命令显示模板
    // ====================
    formatCommand(commandKey) {
      const command = this.getCommandInfo(commandKey);

      if(!command) return '';

      return command.appendSpace? ` ${command.value} `: command.value;
    }
  
    // ====================
    // 判断是否存在模板
    // ====================
    hasTemplate(templateKey) {
      return Object.prototype.hasOwnProperty.call(
        this.config.templates,
        templateKey
      );
    }

    // ====================
    // 获取模板完整信息
    // ====================
    getTemplateInfo(templateKey) {
      return this.config.templates[templateKey] || null;
    }

    // ====================
    // 获取模板偏移量
    // ====================
    getTemplateCursorOffset(templateKey) {
      const template = this.getTemplateInfo(templateKey);
      return template?.cursorOffset ?? 0;
    }

    // ====================
    // 是否为命令前缀
    // ====================
    isCommand(text) {
      return text.startsWith(this.getCommandPrefix());
    }

    // ====================
    // 去除命令前缀
    // ====================
    normalizeCommand(text) {
      return text.replace(this.getCommandPrefix(), '').trim();
    }

    // ====================
    // 获取命令前缀
    // ====================
    getCommandPrefix() {
      return this.config.commands.prefix;
    }

    // ====================
    // 获取所有模板（以后生成按钮）
    // ====================
    getAllTemplates() {
      return this.config.templates;
    }

    // ====================
    // 获取所有命令
    // ====================
    getAllCommands() {
      return this.config.commands;
    }

    // ====================
    // 获取模板文本
    // ====================
    getTemplateValue(templateKey) {
      return this.getTemplateInfo(templateKey)?.value ?? '';
    }
    
=======
// commands.js
class CommandManager {
    constructor(config) {
      this.config = config;
    }
  
    // ====================
    // 判断是否为系统命令
    // ====================
    hasCommand(commandKey) {
      return Object.prototype.hasOwnProperty.call(
        this.config.commands,commandKey
      );
    }
  
    // ====================
    // 获取命令完整信息
    // ====================
    getCommandInfo(commandKey) {
      return this.config.commands[commandKey] || null;
    }

    // ====================
    // 获取命令显示模板
    // ====================
    formatCommand(commandKey) {
      const command = this.getCommandInfo(commandKey);

      if(!command) return '';

      return command.appendSpace? ` ${command.value} `: command.value;
    }
  
    // ====================
    // 判断是否存在模板
    // ====================
    hasTemplate(templateKey) {
      return Object.prototype.hasOwnProperty.call(
        this.config.templates,
        templateKey
      );
    }

    // ====================
    // 获取模板完整信息
    // ====================
    getTemplateInfo(templateKey) {
      return this.config.templates[templateKey] || null;
    }

    // ====================
    // 获取模板偏移量
    // ====================
    getTemplateCursorOffset(templateKey) {
      const template = this.getTemplateInfo(templateKey);
      return template?.cursorOffset ?? 0;
    }

    // ====================
    // 是否为命令前缀
    // ====================
    isCommand(text) {
      return text.startsWith(this.getCommandPrefix());
    }

    // ====================
    // 去除命令前缀
    // ====================
    normalizeCommand(text) {
      return text.replace(this.getCommandPrefix(), '').trim();
    }

    // ====================
    // 获取命令前缀
    // ====================
    getCommandPrefix() {
      return this.config.commands.prefix;
    }

    // ====================
    // 获取所有模板（以后生成按钮）
    // ====================
    getAllTemplates() {
      return this.config.templates;
    }

    // ====================
    // 获取所有命令
    // ====================
    getAllCommands() {
      return this.config.commands;
    }

    // ====================
    // 获取模板文本
    // ====================
    getTemplateValue(templateKey) {
      return this.getTemplateInfo(templateKey)?.value ?? '';
    }
    
>>>>>>> e20817d76230c55abbf7fece21e1aec4b14f4db5
  }