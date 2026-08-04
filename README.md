<<<<<<< HEAD
从我们一路推倒重写到现在，2.0 已经不是最开始那个 Demo 了，而是一个完整的架构版本。

Keyboard Injector v2.0（冻结）

前端

✅ Lexer / Parser / Translator / Processor / Encoder 五级 Pipeline

✅ 配置集中到 config.js

✅ CommandManager 独立

✅ UI 与 Processor 解耦

✅ 自动 IME 状态机

✅ 自动恢复默认输入法

✅ 中文→拼音转换

✅ 中英文自动切换

✅ 中文/英文标点处理

✅ STM32 数据包生成


STM32

✅ 串口接收

✅ 命令解析器

✅ Command Table

✅ tapKey()

✅ tapCombination()

✅ ACK(READY/OK)

✅ Overflow 防护

✅ Command Timeout 防护（commit 1.8）

✅ Delay 命令

✅ Shift 输入法切换

✅ 随机按键延迟

✅ LED 状态提示


通信协议（v2.0）

仍保持：

普通文本<COMMAND>普通文本<COMMAND>

例如：

huanzhe<SWITCH_IME><DELAY_150>ABC<SWITCH_IME>ruyuan

协议先冻结，不再折腾。


---

剩下的已知问题（Accepted）

只有一些边界情况，不影响正常使用：

混合标点（例如 [】]）属于用户输入本身混用中英文字符，保持原样，不做特殊处理。

微软输入法偶尔自身状态异常，这是输入法行为，不是程序逻辑问题。

中文输入法候选词会导致错字（如"入院→如愿"），属于输入法词库问题，更换专业输入法即可。


这些都不属于程序 Bug，可以接受。


---

建议打 Tag

建议直接把这一版打上：

Keyboard Injector v2.0

后面所有开发都从 v2.0 开分支，不再修改这套核心逻辑。

例如：

v2.0  （冻结）
├── v2.1  UI优化
├── v2.2  宏命令
├── v2.3  模板系统
├── v2.4  医学快捷词典
└── v3.0  新通信协议（${IME}、二进制协议等）

我建议以后遵循一个原则：

> 2.0 不再加功能，只修会导致程序崩溃或无法使用的严重 Bug。



=======
从我们一路推倒重写到现在，2.0 已经不是最开始那个 Demo 了，而是一个完整的架构版本。

Keyboard Injector v2.0（冻结）

前端

✅ Lexer / Parser / Translator / Processor / Encoder 五级 Pipeline

✅ 配置集中到 config.js

✅ CommandManager 独立

✅ UI 与 Processor 解耦

✅ 自动 IME 状态机

✅ 自动恢复默认输入法

✅ 中文→拼音转换

✅ 中英文自动切换

✅ 中文/英文标点处理

✅ STM32 数据包生成


STM32

✅ 串口接收

✅ 命令解析器

✅ Command Table

✅ tapKey()

✅ tapCombination()

✅ ACK(READY/OK)

✅ Overflow 防护

✅ Command Timeout 防护（commit 1.8）

✅ Delay 命令

✅ Shift 输入法切换

✅ 随机按键延迟

✅ LED 状态提示


通信协议（v2.0）

仍保持：

普通文本<COMMAND>普通文本<COMMAND>

例如：

huanzhe<SWITCH_IME><DELAY_150>ABC<SWITCH_IME>ruyuan

协议先冻结，不再折腾。


---

剩下的已知问题（Accepted）

只有一些边界情况，不影响正常使用：

混合标点（例如 [】]）属于用户输入本身混用中英文字符，保持原样，不做特殊处理。

微软输入法偶尔自身状态异常，这是输入法行为，不是程序逻辑问题。

中文输入法候选词会导致错字（如"入院→如愿"），属于输入法词库问题，更换专业输入法即可。


这些都不属于程序 Bug，可以接受。


---

建议打 Tag

建议直接把这一版打上：

Keyboard Injector v2.0

后面所有开发都从 v2.0 开分支，不再修改这套核心逻辑。

例如：

v2.0  （冻结）
├── v2.1  UI优化
├── v2.2  宏命令
├── v2.3  模板系统
├── v2.4  医学快捷词典
└── v3.0  新通信协议（${IME}、二进制协议等）

我建议以后遵循一个原则：

> 2.0 不再加功能，只修会导致程序崩溃或无法使用的严重 Bug。



>>>>>>> e20817d76230c55abbf7fece21e1aec4b14f4db5
这样以后每个版本的职责都会很清晰，也不会再出现为了修一个小问题牵一发而动全身的情况。