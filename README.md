指挥云前端界面
=======================


### 开发/运行环境：

 - webstorm 2017.1.2
 
 
 - ngnix 1.0.11


### 支持的浏览器

 - Chrome (stable)
 - Firefox
 - IE 8, 9 and 10
 


## Demo

 
### 服务器版（较为旧）请点击这里 [DEMO page](http://192.168.6.70:80)

 - username: admin
 - password: 111111
  
### 单机版 （最新版） 请点击这里[DEMO page](http://192.168.5.183:9091)
 - username: admin
 - password: 111111
  
 


=================================================================
华丽丽的分割线……（开发者看过来）
 
# To Developers (something more about easemob )



### 后台管理界面地址

```python
   http://192.168.10.36:81
```
- username: Admin1
- password: Easemob2015

### 环信北京后台部署信息
 
 共有4台服务器：3台centos6, 一台centos7

 地址： 192.168.10.36-39  其中39是视频服务器

- 用户名：easemob
- 密码：easemob.com




### 环信公网接口测试

1、 获取Token

 
```python
 curl -X POST "https://a1.easemob.com/1196161220115612/test/token" -d '{"grant_type":"client_credentials","client_id":"YXA6b6Kh0MZjEeaHHcfN-8f80A","client_secret":"YXA6Rz7jCdaPaip0NMdcRhf64c8b5Zc"}'
```
2、 开放注册用户

```python
 curl -X POST -i "https://a1.easemob.com/1196161220115612/test/users" -d '{"username":"jliu","password":"123456"}'
```

### 环信私有化接口测试

- 后台Rest地址+端口：
 

```python
http://192.168.10.36:80
AppKey: ssy#ccf
client_id: YXA6vtYy8DO3Eeemug8WKGqd9A
client_secret:  YXA6-e7HK0MiAgAfv27RwZLJ3ZjzQNo
```

- 开放注册用户
```python
curl -X POST -i "http://192.168.10.36:80/ssy/ccf/users" -d '{"username":"jliu","password":"123456"}'
```