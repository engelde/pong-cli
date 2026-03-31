<div align="center">

<pre>
██████╗  ██████╗ ███╗   ██╗ ██████╗
██╔══██╗██╔═══██╗████╗  ██║██╔════╝
██████╔╝██║   ██║██╔██╗ ██║██║  ███╗
██╔═══╝ ██║   ██║██║╚██╗██║██║   ██║
██║     ╚██████╔╝██║ ╚████║╚██████╔╝
╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝
</pre>

**The 1972 Atari classic, right in your terminal.** 🏓

[![npm version](https://img.shields.io/npm/v/pong-cli?color=black&label=npm&style=flat-square)](https://www.npmjs.com/package/pong-cli)
[![license](https://img.shields.io/npm/l/pong-cli?color=black&style=flat-square)](LICENSE)
[![node](https://img.shields.io/node/v/pong-cli?color=black&style=flat-square)](package.json)

<pre>
█                       ┆                        █
█            03         ┆         07             █
█                       ┆                        █
█                       ┆                        █
█              ●        ┆                        █
█                       ┆                        █
</pre>

*"Avoid missing ball for high score."*

</div>

## 🚀 Quick Start

```bash
npx pong-cli
```

One command. No install. Just play.

> **Want it installed?** Run `npm install -g pong-cli` then just type `pong`.

## 🕹️ What Is This?

A faithful recreation of **Pong** — the game that started it all in 1972. Black and white. Two paddles. One ball. Pure arcade action, running at 30 FPS in your terminal.

## ✨ Features

- 🤖 **1-Player** — Battle the CPU on Easy, Normal, or Hard
- 👥 **2-Player** — Grab a friend, share a keyboard
- 🏓 **Real Physics** — Angle changes based on where the ball hits your paddle
- ⚡ **Speed Ramp** — The ball gets faster with every volley
- 🔊 **Sound Effects** — Terminal beeps for hits and scores (disable with `--no-sound`)
- 🏆 **First to 11** — Or set your own target with `--score`
- ⬛ **Monochrome** — Black-and-white aesthetic, faithful to the original CRT
- 🖥️ **30 FPS** — Smooth real-time terminal rendering

## 🎮 Controls

| | Player 1 | Player 2 |
|---|---|---|
| **Move Up** | `W` | `↑` |
| **Move Down** | `S` | `↓` |

| Key | Action |
|---|---|
| `Space` / `P` | Pause |
| `Enter` | Select |
| `Esc` | Quit |

> 💡 In 1-Player mode, both `W`/`S` and arrow keys control your paddle.

## ⚙️ Options

| Flag | Description | Default |
|---|---|---|
| `--score <n>` | Winning score (1–99) | `11` |
| `--difficulty <level>` | `easy` · `normal` · `hard` | `normal` |
| `--no-sound` | Disable beep sounds | — |
| `--help` | Show help | — |
| `--version` | Show version | — |

```bash
# Hard mode, first to 21
npx pong-cli --difficulty hard --score 21
```

## 💡 Pro Tips

> 🏓 **Aim with your paddle** — hitting the ball near the edge creates a steep angle. Center hits go straight.

> ⚡ **Stay sharp** — ball speed increases with every rally and resets after each point.

> 🤖 **Hard mode is no joke** — the CPU predicts where the ball will land.

## 🛠️ Development

```bash
git clone https://github.com/engelde/pong-cli.git
cd pong-cli
npm install
```

| Command | Description |
|---|---|
| `npm start` | Run the game |
| `npm test` | Run tests |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format with Biome |

[Husky](https://typicode.github.io/husky/) runs linting + tests on pre-commit and enforces [Conventional Commits](https://www.conventionalcommits.org/). CI runs on Node 18 / 20 / 22. Releases via [release-please](https://github.com/googleapis/release-please).

## 📜 Credits

Inspired by the original **Pong** arcade game by **Atari, Inc.** (1972), designed and built by **Allan Alcorn**. Pong was the first commercially successful video game and launched the arcade era.

## 📄 License

[MIT](LICENSE)
