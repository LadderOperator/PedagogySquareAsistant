# 教学立方辅助插件
 一键预览助教批改作业页面上传的图片，同时会把课件页面未放开的下载打开。

 [demo演示动画点这里](https://cdn.nlark.com/yuque/0/2020/gif/378223/1585654793944-c6640faf-a70f-448a-97d9-def7f7cd8784.gif)

> 所有课件均为任课老师的辛苦劳动付出，本插件使用者仅可为了教学工作、课程学习方便之用，不得未经允许将课件在网络随意传播！请珍惜老师的劳动成果和心血！

## 原理

非常非常非常没有难度，看两天代码照着模板套你也可以做。

+ 预览图片：直接注入js脚本从页面获取作业真实下载链接，如果是图片就直接用`<img>...</img>`嵌入到网页而不必单独下载，如果不是就转换为真实下载链接而不是`javascript:void(0);`（好像并没有什么卵用，你可能需要“一键下载本页”这种功能，但把作业拆成多份pdf的学生估计百年一遇……）。

+ 放开下载：直接注入js脚本从页面修改课件可下载的属性。

## 安装方式

1. `clone`到本地（如果是`.zip`压缩包那解压成文件夹）
2. 打开Chrome或Chromium系浏览器，Chrome输入`chrome://extensions`，Chromium Edge输入`edge://extensions`
3. 打开“开发人员模式”
4. 点击“加载解压缩的扩展包”，选中本地的仓库文件夹

## 使用方式

+ 对助教：打开每个学生的教学立方作业批改页面，**直接点击插件图标**。
+ 对学生：打开课件所在页面，**直接点击插件图标**，可以显示“下载”图标。

## 已知问题

+ 由于本人能力有限只能暂时解决图片问题，pdf和word文档基本都是一个文档其实也不太妨碍。
+ 实际测试中，极个别图片显示不正常，目前不知道原因，但绝大多数可以用

## 欢迎改进

非常非常非常欢迎有大佬看见感兴趣可以改进的，特别是文件预览因为url含有验证遭遇到不小麻烦，暂时没办法解决。当然最好的办法是官方技术能抽个小空来改造，这样这个插件从此就用不上了……

## 更新日志

### v1.1

+ 更名为教学立方辅助工具
+ 仿照原来的方式，增加了一键显示所有下载的功能
+ 吐槽：实现方式过于简单，这变量作用范围到底算bug还是算feature？