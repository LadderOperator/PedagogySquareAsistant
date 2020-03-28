# 教学立方图片预览插件
 A Chrome extension to preview images at teaching.applysquare.com

## 原理

直接注入js脚本从页面获取作业真是下载链接，如果是图片就直接用`<img>...</img>`嵌入，如果不是就转换为真实下载链接而不是`javascript:void(0);`

## 安装方式

1. `clone`到本地
2. 打开Chrome或Chromium系浏览器，Chrome输入`chrome://extensions`，Chromium Edge输入`edge://extensions`
3. 打开“开发人员模式”
4. 点击“加载解压缩的扩展包”，选中本地的仓库文件夹

## 使用方式

打开每个学生的教学立方作业批改页面，直接点击插件图标。

## 备注

由于本人能力有限只能暂时解决图片问题，pdf和word文档基本都是一个文档其实也不太妨碍。