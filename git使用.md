### 本地创建好，第一次推送到远程仓库
git add .
git commit -m '注释'

git remote add origin url

git pull origin master
git push origin master

### 拉取远程分支到本地

 - git clone -b dev 远程分支名 远程url
（再进入到文件夹里，会自动创建好分支：适合单一分支）

- git clone url 
git branch -a
git checkout 远程分支名
...
git push(会自动对标分支)