# 改进：

删除帖子之后 或者更新帖子之后 从数据库, clouddiary 删除图片

叉号清空搜索框
搜索之后 清空搜索框 -------------部分解决 就是得到搜索结果后 仍然在 focus
搜索框不在中间 ----------------- 就跟在按钮的左边吧 一个框 一个按钮

首页应当设置为可以在未登陆的状态下浏览
首先 去掉后端中的 login required
app.js useEffect 中 local storage reset push 是什么意思？
去掉这一行 会一直显示 loading
然后去掉 home page 中的 state，会发现 data 完全是从这里来的

点击图片 出 modal
Footer
Loading

# 已解决

提示信息是中文
fetch 的是 localhost

# 用户列表

4

# Deploy 方法

client 文件夹在 server 文件夹内
npm run build
更改 Port 为 or
if production, send
config keys, dev, prod

package.json
删除.git
