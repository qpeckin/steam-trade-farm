@echo off
:main
color d
echo Script Started
echo Github -  https://github.com/qpeckin/steam-trade-farm
echo Steam Group - https://steamcommunity.com/groups/qpeckin
echo.                                                                                                                            
title Account #2 - Trade Boost 
node account2.js
echo Script Crashed
timeout /t 20
goto main
