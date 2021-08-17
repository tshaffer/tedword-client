import {
  GameState,
  TedwordState
} from '../types';

export const getGameState = (state: TedwordState): GameState => {
  return state.gameState;
};
