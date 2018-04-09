const electron = require('electron');
const path = require('path');

const { app, BrowserWindow, Menu, Tray } = electron;

let mainWindow;

const menuTemplate = [
  {
    label: 'Electron',
    submenu: [
      {
        label: 'Quit',
        click: () => {
          app.quit();
        },
      },
    ],
  },
];

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1000,
    resizeable: false,
    frame: false,
    icon: path.join(__dirname, '/octopus_large.png'),
  });

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  const appIcon = new Tray(path.join(__dirname, '/octopus.png'));

  // mainWindow.webContents.openDevTools();

  mainWindow.setTitle('OctoPOS');
  // mainWindow.loadURL("file://" + __dirname + "/client/dist/index.html");
  mainWindow.loadURL('http://192.168.1.3:3000');
  mainWindow.webContents.executeJavaScript(`
    var path = require('path');
    module.paths.push(path.resolve('node_modules'));
    module.paths.push(path.resolve('../node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));
    path = undefined;
  `);


  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
