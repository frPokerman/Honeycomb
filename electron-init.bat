@echo off

echo Please wait until Electron-init: Done is displayed...
echo.

for /F "delims=" %%i in ("%CD%") do set "name=%%~ni"
set /p "name=Name of your application (%name%) : "

set /p "author=Author name : "

set /p "desc=A quick description ? "

set "main=entry.js"
set /p "main=Filename of the entry (%main%) : "

echo.
:askloop
set "doLive=yes"
set /p "doLive=Do you want to use live Server ? (%doLive%) : "
if "%doLive%" == "yes" goto :loopexit
if "%doLive%" == "no" goto :loopexit
goto :askloop
:loopexit

(
echo {
echo   "name": "%name%",
echo   "version": "1.0.0",
echo   "description": "%desc%",
echo   "main": "%main%",
echo   "scripts": {
echo     "start": "less-update skeleton && electron .",
echo     "test": "echo %name%: Ping !"
echo   },
echo   "author": "%author%",
echo   "license": "ISC"
echo }
) > package.json

cmd /c npm install --save-dev electron
cmd /c npm install -g less

(
echo @echo off
echo SetLocal
echo set "origin=%%cd%%"
echo cd %%1
echo FOR /r %%%%f in ^("*"^) do call :extract "%%%%f"
echo goto :exit
echo :extract
echo set "filepath=x"
echo set "fileextension=x"
echo set "filename=x"
echo FOR %%%%a in ^(%%1^) DO ^(
echo   set fileextension=%%%%~xa
echo   set filepath=%%%%~dpa
echo   set filename=%%%%~na
echo ^)
echo if "%%fileextension%%" == ".less" ^(
echo     lessc %%1 "%%filepath%%%%filename%%.css"
echo ^)
echo :exit
echo cd "%%origin%%"
) > less-update.bat

echo.
echo Electron initialization done,
echo Building app sample ...

if not exist skeleton\ mkdir skeleton

(
echo ^<!DOCTYPE html^>
echo ^<html^>
echo     ^<head^>
echo         ^<meta charset="UTF-8"^>
) > skeleton\index.html
if "%doLive%" == "no" echo         ^<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'"^> >> skeleton\index.html
echo         ^<title^>%name%^</title^> >> skeleton\index.html

if "%doLive%" == "yes" goto :ifLiveSnippet
goto :ifNotLive

:ifLiveSnippet
(
echo         ^<script^>
echo             if ^(window.location.protocol ^!^= "file:" && window.WebSocket && typeof require ^=^= ^'function^'^)
echo             {
echo                 const sockets ^= []^;
echo                 const nativeWebSocket ^= window.WebSocket^;
echo                 window.WebSocket ^= function^(...args^){
echo                     const socket ^= new nativeWebSocket^(...args^)^;
echo                     sockets.push^(socket^)^;
echo                     return socket^;
echo                 }^;
echo                 setTimeout^(^(^) ^=^> {
echo                     let socket ^= sockets[0]^;
echo                     let oddEvent ^= socket.onmessage^;
echo                     socket.onmessage ^= function ^(msg^) {
echo                         if ^(msg.data ^=^= ^'reload^'^)
echo                         {
echo                             const childProcess ^= require^("child_process"^)^;
echo                             const bash_run ^= childProcess.spawn^(^'cmd.exe^', [ ^'/c^',^'less-update^',^'skeleton^' ]^)^;
echo.
echo                             bash_run.on^("exit", ^(^) ^=^> {
echo                                 window.location.reload^(^)^;
echo                             }^)^;
echo                         }
echo                         else if ^(msg.data ^=^= ^'refreshcss^'^) oddEvent^(msg^)^;
echo                     }^;
echo                 }, 1000^)^;
echo             }
echo         ^</script^>
) >> skeleton\index.html
:ifNotLive

(
echo     ^</head^>
echo     ^<body^>
echo         ^<h1^>Hello World!^</h1^>
echo         ^<div^>You successfully created your Electron app !^</div^>
echo     ^</body^>
echo ^</html^>
) >> skeleton\index.html

(
echo const { app, BrowserWindow } ^= require^(^'electron^'^)
echo const path ^= require^(^'path^'^)
echo.
echo function createWindow ^(^) {
echo     const win ^= new BrowserWindow^({
echo         width: 800,
echo         height: 600,
echo         webPreferences: {
echo             nodeIntegration: true,
echo             contextIsolation: false,
echo             preload: path.join^(__dirname, ^'preload.js^'^)
echo         }
echo     }^)
echo.
) > %main%
if "%doLive%" == "no" echo     win.loadFile^(^'skeleton/index.html^'^) >> %main%
if "%doLive%" == "yes" goto :ifLiveSnippet2
goto :ifStillNotLive
:ifLiveSnippet2
(
echo     const liveServerURL = "http://127.0.0.1:5500/skeleton/"^;
echo     const http = require^("http"^)^;
echo     http.get^(liveServerURL, ^(^) ^=^> { win.loadURL^(liveServerURL^)^; }^).on^("error", ^(^) ^=^> { win.loadFile^(^'skeleton/index.html^'^) }^)^;
) >> %main%
:ifStillNotLive
(
echo }
echo.
echo app.whenReady^(^).then^(^(^) ^=^> {
echo     createWindow^(^)
echo.
echo     app.on^(^'activate^', ^(^) ^=^> {
echo         if ^(BrowserWindow.getAllWindows^(^).length ^=^=^= 0^) {
echo            createWindow^(^)
echo         }
echo     }^)
echo }^)
echo.
echo app.on^(^'window-all-closed^', ^(^) ^=^> {
echo     if ^(process.platform !^=^= ^'darwin^'^) {
echo         app.quit^(^)
echo     }
echo }^)
) >> %main%

(
echo window.addEventListener^(^'DOMContentLoaded^', ^(^) ^=^> {
echo     console.log^("Application loaded !"^)^;
echo }^)
) > preload.js

echo.
echo ============================================================
echo Electron-init: Done
echo.
echo You can now use npm start to debug your application !
echo ============================================================

npm start
