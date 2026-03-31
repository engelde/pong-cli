const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const GameState = require('../src/game/GameState.js');

describe('GameState', () => {
  describe('constructor', () => {
    it('initializes with default values', () => {
      const gs = new GameState();
      assert.equal(gs.winningScore, 11);
      assert.equal(gs.gameMode, 'single');
      assert.equal(gs.difficulty, 'normal');
      assert.equal(gs.isPaused, false);
      assert.equal(gs.isGameOver, false);
    });

    it('accepts custom options', () => {
      const gs = new GameState({ winningScore: 5, gameMode: 'multi', difficulty: 'hard' });
      assert.equal(gs.winningScore, 5);
      assert.equal(gs.gameMode, 'multi');
      assert.equal(gs.difficulty, 'hard');
    });
  });

  describe('score()', () => {
    it('increments player 1 score', () => {
      const gs = new GameState();
      const result = gs.score(1);
      assert.equal(result.scored, true);
      assert.equal(result.player, 1);
      assert.equal(gs.player1Score, 1);
    });

    it('increments player 2 score', () => {
      const gs = new GameState();
      gs.score(2);
      assert.equal(gs.player2Score, 1);
    });

    it('sets lastScorer', () => {
      const gs = new GameState();
      gs.score(1);
      assert.equal(gs.lastScorer, 1);
      gs.score(2);
      assert.equal(gs.lastScorer, 2);
    });

    it('returns gameOver true when winning score reached', () => {
      const gs = new GameState({ winningScore: 2 });
      gs.score(1);
      const result = gs.score(1);
      assert.equal(result.gameOver, true);
    });

    it('does not score after game is over', () => {
      const gs = new GameState({ winningScore: 1 });
      gs.score(1); // game over
      const result = gs.score(1);
      assert.equal(result.scored, false);
      assert.equal(result.gameOver, true);
      assert.equal(gs.player1Score, 1);
    });
  });

  describe('checkWin()', () => {
    it('returns false when no one has reached winning score', () => {
      const gs = new GameState();
      assert.equal(gs.checkWin(), false);
    });

    it('returns true and sets winner when player 1 wins', () => {
      const gs = new GameState({ winningScore: 3 });
      gs.player1Score = 3;
      assert.equal(gs.checkWin(), true);
      assert.equal(gs.winner, 1);
      assert.equal(gs.isGameOver, true);
    });

    it('returns true and sets winner when player 2 wins', () => {
      const gs = new GameState({ winningScore: 3 });
      gs.player2Score = 3;
      assert.equal(gs.checkWin(), true);
      assert.equal(gs.winner, 2);
    });
  });

  describe('reset()', () => {
    it('resets all state', () => {
      const gs = new GameState();
      gs.score(1);
      gs.score(2);
      gs.isPlaying = true;
      gs.reset();
      assert.equal(gs.player1Score, 0);
      assert.equal(gs.player2Score, 0);
      assert.equal(gs.isGameOver, false);
      assert.equal(gs.winner, null);
      assert.equal(gs.isPlaying, false);
      assert.equal(gs.lastScorer, null);
    });
  });

  describe('getServeDirection()', () => {
    it('returns -1 after player 1 scores', () => {
      const gs = new GameState();
      gs.score(1);
      assert.equal(gs.getServeDirection(), -1);
    });

    it('returns 1 after player 2 scores', () => {
      const gs = new GameState();
      gs.score(2);
      assert.equal(gs.getServeDirection(), 1);
    });

    it('returns -1 or 1 when no one has scored yet', () => {
      const gs = new GameState();
      const dir = gs.getServeDirection();
      assert.ok(dir === -1 || dir === 1);
    });
  });

  describe('togglePause()', () => {
    it('toggles pause state', () => {
      const gs = new GameState();
      assert.equal(gs.isPaused, false);
      gs.togglePause();
      assert.equal(gs.isPaused, true);
      gs.togglePause();
      assert.equal(gs.isPaused, false);
    });
  });

  describe('getScores()', () => {
    it('returns both player scores', () => {
      const gs = new GameState();
      gs.score(1);
      gs.score(1);
      gs.score(2);
      assert.deepEqual(gs.getScores(), { player1: 2, player2: 1 });
    });
  });
});
