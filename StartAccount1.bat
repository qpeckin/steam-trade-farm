@echo off
:main                                                                                                                         
title Account #1 - Trade Boost 
node account1.js
echo Script Crashed
timeout /t 20
goto main
