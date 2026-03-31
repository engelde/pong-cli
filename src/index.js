const termkit = require('terminal-kit');
const Renderer = require('./ui/Renderer');
const Sound = require('./game/Sound');
const ScreenManager = require('./screens/ScreenManager');
const TitleScreen = require('./screens/TitleScreen');
const MenuScreen = require('./screens/MenuScreen');
const GameScreen = require('./screens/GameScreen');
const GameOverScreen = require('./screens/GameOverScreen');

// Parse CLI flags
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  🏓 Pong CLI — A faithful recreation of the 1972 Atari classic

  Usage: pong-cli [options]

  Options:
    --score <n>           Set winning score (1-99, default: 11)
    --difficulty <level>  AI difficulty: easy, normal, hard (default: normal)
    --no-sound            Disable terminal beep sounds
    --help, -h            Show this help message
    --version, -v         Show version
  `);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  const { version } = require('../package.json');
  console.log('pong-cli v' + version);
  process.exit(0);
}

const noSound = args.includes('--no-sound');

let winningScore = 11;
const scoreIdx = args.indexOf('--score');
if (scoreIdx !== -1 && args[scoreIdx + 1]) {
  const parsed = Number.parseInt(args[scoreIdx + 1], 10);
  if (parsed >= 1 && parsed <= 99) {
    winningScore = parsed;
  }
}

// Initialize terminal
const term = termkit.terminal;

// Check minimum terminal size
if (term.width < 40 || term.height < 20) {
  term('Terminal too small. Minimum size: 40x20 (current: %dx%d)\n', term.width, term.height);
  process.exit(1);
}

// Enter alt screen, hide cursor
term.fullscreen(true);
term.hideCursor(true);

// Graceful cleanup
function cleanup() {
  term.hideCursor(false);
  term.fullscreen(false);
  term.grabInput(false);
  term.processExit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Initialize renderer
const renderer = new Renderer({ terminal: term });
renderer.init();

// Initialize sound
const sound = new Sound({ enabled: !noSound });

// Initialize screen manager
const screenManager = new ScreenManager({ terminal: term, renderer });

// Create screens
const titleScreen = new TitleScreen({ renderer, screenManager });
const menuScreen = new MenuScreen({ renderer, screenManager });
const gameScreen = new GameScreen({ renderer, screenManager, sound, winningScore });
const gameOverScreen = new GameOverScreen({ renderer, screenManager });

// Register screens
screenManager.register('title', titleScreen);
screenManager.register('menu', menuScreen);
screenManager.register('game', gameScreen);
screenManager.register('gameover', gameOverScreen);

// Handle terminal resize
term.on('resize', () => {
  renderer.resize();
});

// Start the game
screenManager.show('title');
