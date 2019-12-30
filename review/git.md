### 多人协作和分支流程

分支介绍

- master主分支
- 自己的分支 dev

##### 流程

git add .

git commit -m'feat: xxxx'

git pull origin dev

git checkout master

git pull

修改冲突

git add .

git commit -m 'merge'

git checkout dev

git merge master

git push

### git 丢弃本地修改

`git checkout .`