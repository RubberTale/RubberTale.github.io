@echo off

REM ** ��������������⣬������̨����ҳ����Ϊ UTF-8 **
chcp 65001 > nul 

REM ** �л�����ȷ����ĿĿ¼ **
cd /d "D:\RubberTale\RubberTale.github.io\"

echo ��������ɵ������ļ��ͻ���...
call hexo clean

echo ��ʼ���� Hexo ��̬�ļ�...
call hexo g

echo ��̬�ļ�������ϣ���ʼ����...
call hexo d

echo ������ɣ�
pause