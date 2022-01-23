# Change Log

All notable changes to the "ustc fpgaol for VSCode" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.0] - 2022-01-21
### Added
- 登录/注销功能，支持通过USTC统一身份认证登录
- 设备的获取和释放
- 监测设备当前状态
- 提交编译任务/查看编译状态/下载编译文件

## [1.0.1] - 2022-01-21
### Added
- 增加编译文件夹功能
- 修改部分图标

## [1.0.2] - 2022-01-22
### Added
- 在功能栏提供一些文件的下载链接
- 自动刷新编译状态和设备状态栏

## [1.1.0] - 2022-01-23
### Added
- 在登录时显示底部Status Bar
- 添加了Logger，可以在Output窗口输出log
- settings.json中添加了`logLevel`,`logginWithCookies`设置，可以设置错误输出等级和选择是否使用cookies登录。
### Bug fix
- （好像）修复了注销登陆后重新登录可能导致的cookies文件错误

## [1.1.1] - 2022-01-23
### Bug fix
- 修复Status Bar错误
- settings.json中添加`tlsRejectUnauthorized`选项用于某些TLS证书过期的VSCode