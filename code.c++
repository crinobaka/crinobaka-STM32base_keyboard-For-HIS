#include <Keyboard.h>

// ------------------ 配置区 ------------------
#define SERIAL_BAUD 115200   // 波特率，与手机端保持一致
#define LED_PIN PC13         // 板载LED
#define MAX_INPUT_LEN 256    // 最大输入字符数
// 打字速度(毫秒/字符)
// commit 1.6 吞字预防
#define KEY_DELAY_MIN 6
#define KEY_DELAY_MAX 15
#define WORD_DELAY 25
#define COMMAND_DELAY 80
#define ENTER_DELAY 80
#define IME_DELAY 120
// 串口接受超时
unsigned long lastReceiveTime = 0;
#define RECEIVE_TIMEOUT 1000 // ms
// -------------------------------------------
// 输入缓冲
String inputString = "";
bool stringComplete = false;

// commit 1.2: 2026-07-13 00:40:00 add number-variable to update the processInput function to process the input string character by character and handle commands and text separately
String commandBuffer = "";
bool readingCommand = false;

// Command Table
typedef struct{
  /* data */
  const char* name;
  void (*handler)();
} CommandEntry;


// ------------------ 函数声明 ------------------
void processInput(const String& input);
void processText(const String& text);
void processCommand(const String& cmd);
void executeCommand(const String& cmd);
void typeWithDelay(const String& text);
void sendCharAsKey(char c);
void ledBlink(int times, int duration);
void tapKey(uint8_t key);
void tapCombination(uint8_t modifier, uint8_t key);
// cmd函数
void cmdSwitchIme();
void cmdEnter();
void cmdTab();
void cmdEsc();
void cmdBackspace();
void cmdDelete();
void cmdLeft();
void cmdRight();
void cmdUp();
void cmdDown();
void cmdHome();
void cmdEnd();
void cmdPageUp();
void cmdPageDown();
void cmdCopy();
void cmdPaste();
void cmdCut();
void cmdUndo();
void cmdRedo();

// ------------------ 核心函数 ------------------
// commit 1.1: 2026-07-12 23:30:00 rewrite `processInput` function to process the input string character by character and handle commands and text separately
// commit 1.2: 2026-07-13 00:40:00 add number-variable to update the processInput function to process the input string character by character and handle commands and text separately
void processInput(const String& input) {
  String textBuffer = "";
  for (int i = 0; i < input.length(); i++) {
    char c = input[i];
    // normal text processing mode
    if (!readingCommand) {
      if (c == '<') {
        if (textBuffer.length() > 0) {
          processText(textBuffer);
          textBuffer = "";
        }
        readingCommand = true;
        commandBuffer = "";
      } else {
        textBuffer += c;
      }
      continue;
    }
    // command reading mode
    commandBuffer += c;
    if (c == '>') {
      processCommand(commandBuffer);
      commandBuffer = "";
      readingCommand = false;
    }
  }
  // 剩余的普通文本处理
  if (textBuffer.length() > 0) {
    processText(textBuffer);
  }
  // commit 1.8
  // 当前数据包结束, 命令仍未闭合, 直接丢弃
  // 防止下一包继续
  if (readingCommand) {
    readingCommand = false;
    commandBuffer = "";
  }
}

// 处理普通文本
void processText(const String& text) {
  if (text.length() == 0) {
    return;
  }
  typeWithDelay(text);
}

// 处理命令
void processCommand(const String& cmd) {
  executeCommand(cmd);
}

// 抽离
void cmdSwitchIme() {
  // 发送shift键切换输入法
  tapKey(KEY_LEFT_SHIFT);
  delay(IME_DELAY);
}
void cmdEnter() {
  tapKey(KEY_RETURN);
  delay(ENTER_DELAY);
}
void cmdTab() {
  tapKey(KEY_TAB);
}
void cmdEsc() {
  tapKey(KEY_ESC);
}
void cmdBackspace() {
  tapKey(KEY_BACKSPACE);
}
void cmdDelete() {
  tapKey(KEY_DELETE);
}
void cmdLeft() {
  tapKey(KEY_LEFT_ARROW);
}
void cmdRight() {
  tapKey(KEY_RIGHT_ARROW);
}
void cmdUp() {
  tapKey(KEY_UP_ARROW);
}
void cmdDown() {
  tapKey(KEY_DOWN_ARROW);
}
void cmdHome() {
  tapKey(KEY_HOME);
}
void cmdEnd() {
  tapKey(KEY_END);
}
void cmdPageUp() {
  tapKey(KEY_PAGE_UP);
}
void cmdPageDown() {
  tapKey(KEY_PAGE_DOWN);
}
void cmdCopy() {
  tapCombination(KEY_LEFT_CTRL, 'c');
}
void cmdPaste() {
  tapCombination(KEY_LEFT_CTRL, 'v');
}
void cmdCut() {
  tapCombination(KEY_LEFT_CTRL, 'x');

}
void cmdUndo() {
  tapCombination(KEY_LEFT_CTRL, 'z');
}
void cmdRedo() {
  tapCombination(KEY_LEFT_CTRL, 'y');
}

// Command 表
CommandEntry commandTable[] = {
  {"SWITCH_IME", cmdSwitchIme},
  {"ENTER", cmdEnter},
  {"TAB", cmdTab},
  {"ESC", cmdEsc},
  {"BACKSPACE", cmdBackspace},
  {"DELETE", cmdDelete},
  {"LEFT", cmdLeft},
  {"RIGHT", cmdRight},
  {"UP", cmdUp},
  {"DOWN", cmdDown},
  {"HOME", cmdHome},
  {"END", cmdEnd},
  {"PAGEUP", cmdPageUp},
  {"PAGEDOWN",cmdPageDown},
  {"COPY", cmdCopy},
  {"PASTE", cmdPaste},
  {"CUT", cmdCut},
  {"UNDO", cmdUndo},
  {"REDO", cmdRedo}
};
const uint8_t COMMAND_COUNT = sizeof(commandTable) / sizeof(commandTable[0]);

// 执行命令
void executeCommand(const String& cmd) {
  for (uint8_t i = 0; i < COMMAND_COUNT; i++) {
    if (cmd.equals(commandTable[i].name)){
      commandTable[i].handler();
      return;
    }
  }
}

// 单击一个按键
void tapKey(uint8_t key) {
  Keyboard.press(key);
  delay(20);
  Keyboard.release(key);
}

// 单击组合键
void tapCombination(uint8_t modifier, uint8_t key) {
  Keyboard.press(modifier);
  Keyboard.press(key);
  delay(20);
  Keyboard.release(key);
  Keyboard.release(modifier);
}

// 带延迟的打字
void typeWithDelay(const String& text) {
  for (int i = 0; i < text.length(); i++) {
    sendCharAsKey(text[i]);
    delay(random(KEY_DELAY_MIN, KEY_DELAY_MAX));
  }
}

// abstracted function to send a character with shift key pressed
// commit 1.3: 2026-07-13 01:18 update `sendShiftedKey` to compatible with malti-platform
void sendShiftedKey(char key) {
  Keyboard.press(KEY_LEFT_SHIFT);
  Keyboard.press(key);
  delay(5);
  Keyboard.release(key);
  Keyboard.release(KEY_LEFT_SHIFT);
}

// 发送单个字符作为按键
// commit 1.1: 2026-07-12 23:40:00 rewrite `sendCharAsKey` function to compatible with Ascii characters and special keys(selctable by the user)
// commit 1.1.1: 2026-07-13 00:37:00 add `sendShiftedKey` function to send a character with shift key pressed
void sendCharAsKey(char c) {
  // 字母
  if (c >= 'a' && c <=  'z') {
    Keyboard.write(c);
    return;
  }
  if (c >= 'A' && c <=  'Z') {
    sendShiftedKey(c + 32); // 转换为小写字母
    return;
  }
  // 数字
  if (c >= '0' && c <=  '9') {
    Keyboard.write(c);
    return;
  }
  // 特殊字符
  switch (c) {
    default:
      Keyboard.write(c);
      return;
    // 第一组 non-shifted keys
    case ' ':
    case '-':
    case '=':
    case '[':
    case ']':
    case '\\':
    case ';':
    case '\'':
    case ',':
    case '.':
    case '/':
    case '`':
      Keyboard.write(c);
      return;
    // 第二组 shift-needed keys along with numbers-keys
    case '!':
      sendShiftedKey('1');
      return;
    case '@':
      sendShiftedKey('2');
      return;
    case '#':
      sendShiftedKey('3');
      return;
    case '$':
      sendShiftedKey('4');
      return;
    case '%':
      sendShiftedKey('5');
      return;
    case '^':
      sendShiftedKey('6');
      return;
    case '&':
      sendShiftedKey('7');
      return;
    case '*':
      sendShiftedKey('8');
      return;
    case '(':
      sendShiftedKey('9');
      return;
    case ')':
      sendShiftedKey('0');
      return;
    // 第三组 shift-needed keys along with punctuation-keys
    case '_':
      sendShiftedKey('-');
      return;
    case '+':
      sendShiftedKey('=');
      return;
    case '{':
      sendShiftedKey('[');
      return;
    case '}':
      sendShiftedKey(']');
      return;
    case '|':
      sendShiftedKey('\\');
      return;
    case ':':
      sendShiftedKey(';');
      return;
    case '"':
      sendShiftedKey('\'');
      return;
    case '<':
      sendShiftedKey(',');
      return;
    case '>':
      sendShiftedKey('.');
      return;
    case '?':
      sendShiftedKey('/');
      return;
    case '~':
      sendShiftedKey('`');
      return;
  }
}

// LED闪烁提示
void ledBlink(int times, int duration) {
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_PIN, LOW);
    delay(duration);
    digitalWrite(LED_PIN, HIGH);
    delay(duration);
  }
}

// 核心
void setup() {
  // 初始化LED
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);

  // 初始化串口
  Serial.begin(SERIAL_BAUD);
  
  // 初始化键盘
  Keyboard.begin();
  
  // 启动成功提示：快闪3次
  ledBlink(3, 100);
  
  // inform browser
  Serial.println("READY");
}

void loop() {
  // 读取串口数据
  while (Serial.available()) {
    char c = (char)Serial.read();
    lastReceiveTime = millis();
    if (c == '\r' || c == '\n') {
      if (inputString.length() > 0) {
        stringComplete = true;
      }
    } else {
      if (inputString.length() >= MAX_INPUT_LEN) {
        inputString = "";
        readingCommand = false;
        commandBuffer = "";
        Serial.println("ERR:OVERFLOW");
        return;
      }
      inputString += c;
    }
  }

  // 处理完整的一行数据
  if (stringComplete) {
    // 开始输入指示：LED长亮
    digitalWrite(LED_PIN, LOW);
    
    // 处理输入内容
    processInput(inputString);
    
    // 清空缓冲
    inputString = "";
    stringComplete = false;
    
    // 结束指示：LED熄灭
    digitalWrite(LED_PIN, HIGH);

    // inform browser with ok to go on
    Serial.println("OK");
  }
  
  // 接收超时,恢复状态
  if (readingCommand && millis() - lastReceiveTime > RECEIVE_TIMEOUT) {
    readingCommand = false;
    commandBuffer = "";
    inputString = "";
  }

  delay(5);
}