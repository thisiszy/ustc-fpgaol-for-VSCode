# ustc fpgaol for VSCode README

该插件用于USTC FPGAOL(FPGA online) 平台，集成了学习FPGA开发所需的常用功能。

**图片使用了raw.githubusercontent.com，大陆可能无法访问**

## Features
### 登录
- 登录支持USTC统一身份认证登录
  - 点击如下图所示的登录按钮

  <p align="center">
  <img src="https://raw.githubusercontent.com/thisiszy/ustc-fpgaol-for-VSCode/master/assets/login.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></a>
  </p>

  - 按照提示输入账号、密码和验证码
  - 右下提示登录成功

  <p align="center">
  <img src="https://raw.githubusercontent.com/thisiszy/ustc-fpgaol-for-VSCode/master/assets/login-success.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></a>
  </p>

### 设备管理

- 通过“功能”菜单中的 "Acquire" 和 "Release" 功能来获取和释放设备

  <p align="center">
  <img src="https://raw.githubusercontent.com/thisiszy/ustc-fpgaol-for-VSCode/master/assets/acquire-release.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></a>
  </p>

- 设备状态栏中显示当前已经获取的设备状态以及链接，点击链接打开设备网页

  <p align="center">
  <img src="https://raw.githubusercontent.com/thisiszy/ustc-fpgaol-for-VSCode/master/assets/require-open.gif" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></a>
  </p>

### 编译服务

- 右键zip后缀文件，选择 "Compile Current File" 可以提交当前文件到编译服务器

  <p align="center">
  <img src="https://raw.githubusercontent.com/thisiszy/ustc-fpgaol-for-VSCode/master/assets/compile.gif" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></a>
  </p>

- 右键文件夹，选择 "Compile This Folder" 可以提交当前文件夹中的工程到编译服务器

  <p align="center">
  <img src="https://raw.githubusercontent.com/thisiszy/ustc-fpgaol-for-VSCode/master/assets/compilefolder.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></a>
  </p>

- 在编译状态栏可以显示当前用户工程的编译情况，编译完成后提供文件下载链接

  <p align="center">
  <img src="https://raw.githubusercontent.com/thisiszy/ustc-fpgaol-for-VSCode/master/assets/compilestatus.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></a>
  </p>

### 其它

- 提供必要软件、示例工程、约束文件（XDC）的下载

  <p align="center">
  <img src="https://raw.githubusercontent.com/thisiszy/ustc-fpgaol-for-VSCode/master/assets/downloadcenter.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></a>
  </p>

-----------------------------------------------------------------------------------------------------------

## For more details

* [Github](https://github.com/thisiszy/ustc-fpgaol-for-VSCode/tree/master)

## Known Issues
- 登录和注销可能会出现 "Syntax Error: JSON"，如果出现错误可以尝试在`settings.json`中将`logginWithCookies`设置为`false`。
- 登录时在某些设备上可能出现 "RequestError: Error: certificate has expired Possible"，由于在作者所有设备上都无法复现该错误，所以暂时无法定位和解决bug，已知可能的解决方法包括
  - 升级vscode
  - 在`settings.json`中将`tlsRejectUnauthorized`设置为`"0"`

## Thanks
- <a href='https://pngtree.com/so/Vector'>extension icon from pngtree.com/</a>
- FPGAOL dev group