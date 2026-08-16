@echo off

REM ** ⣬̨ҳΪ UTF-8 **
chcp 65001 > nul 

REM ** 切换到正确的项目目录 **
cd /d "D:\RubberTale\rubbertale.github.io\"

echo ɵļͻ...
call hexo clean

echo ʼ Hexo ̬ļ...
call hexo g

echo ��̬�ļ�������ϣ���ʼ����...
call hexo d

echo ������ɣ�
pause