class ScreenManager {
  constructor({ terminal, renderer }) {
    this.terminal = terminal;
    this.renderer = renderer;
    this.screens = {};
    this.currentName = null;
    this.currentScreen = null;

    this.terminal.grabInput({ mouse: false });
    this.terminal.on('key', (key) => {
      if (this.currentScreen && typeof this.currentScreen.handleKey === 'function') {
        this.currentScreen.handleKey(key);
      }
    });
  }

  register(name, screen) {
    this.screens[name] = screen;
  }

  show(name, data) {
    const screen = this.screens[name];
    if (!screen) {
      throw new Error('Screen "' + name + '" is not registered');
    }

    if (this.currentScreen && typeof this.currentScreen.hide === 'function') {
      this.currentScreen.hide();
    }

    this.currentName = name;
    this.currentScreen = screen;
    this.currentScreen.show(data);
  }

  getCurrent() {
    return this.currentName;
  }
}

module.exports = ScreenManager;
