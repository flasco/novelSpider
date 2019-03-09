#制定node镜像的版本
FROM node:10.15.3
#声明作者
LABEL author=flasco
#移动当前目录下面的文件到app目录下
ADD . /app/
#进入到app目录下面，类似cd
WORKDIR /app
#安装依赖
RUN npm install
# 挂载数据卷
VOLUME /data
# 添加个标明是docker环境的环境变量
ENV IS_DOCKER true
#程序启动脚本
ENTRYPOINT ["node", "src/start.js"]
CMD ["xs", "0 40"]