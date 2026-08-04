// serial.js
class SerialManager {
  constructor(config) {
    this.config = config;
    this.port = null;
    this.writer = null;
    this.reader = null;
    this.isConnected = false;
  }

  // 请求并打开串口
  async connect() {
    try {
      // 请求用户选择串口
      this.port = await navigator.serial.requestPort();
      // 以配置的波特率打开
      await this.port.open(this.config);
      this.isConnected = true;
      
      // 获取写入流
      this.writer = this.port.writable.getWriter();
      
      // 可选：监听断开连接事件
      this.port.readable.getReader().closed.catch(() => {
        this.disconnect();
      });
      
      return true;
    } catch (error) {
      console.error('串口连接失败:', error);
      this.disconnect();
      return false;
    }
  }

  // 发送数据 (自动添加换行符)
  async sendData(data) {
    if (!this.isConnected || !this.writer) {
      console.warn('串口未连接，无法发送数据');
      return false;
    }
    try {
      // 将字符串转换为Uint8Array并写入
      const encoder = new TextEncoder();
      const message = data + '\n'; // 添加换行作为结束标志
      await this.writer.write(encoder.encode(message));
      await this.waitAck();
      return true;
    } catch (error) {
      console.error('发送数据失败:', error);
      return false;
    }
  }

  // 发送命令 (复用sendData)
  async sendCommand(cmd) {
    return this.sendData(cmd);
  }

  // 断开连接
  disconnect() {
    this.isConnected = false;
    if (this.writer) {
      this.writer.releaseLock();
      this.writer = null;
    }
    if (this.port) {
      this.port.close();
      this.port = null;
    }
    // 触发UI更新
    this.onDisconnectCallback?.();
  }

  // 设置断开连接的回调函数 (用于更新UI状态)
  setDisconnectCallback(callback) {
    this.onDisconnectCallback = callback;
  }

  // ACK 握手协议
  async waitAck() {
    while (true) {
      const {value, done} = await this.reader.read();
      if (done) {
        return false;
      }
      const text = new TextDecoder().decode(value).trim();
      if (text === "OK") {
        return true;
      }
    }
  }
}