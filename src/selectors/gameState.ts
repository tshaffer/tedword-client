import {
  GameState,
  ParsedClue,
  TedwordState
} from '../types';

export const getGameState = (state: TedwordState): GameState => {
  return state.gameState;
};

export const getFocusedAcrossClue = (state: TedwordState): ParsedClue => {
  return getGameState(state).focusedAcrossClue;
};

export const getFocusedDownClue = (state: TedwordState): ParsedClue => {
  return getGameState(state).focusedDownClue;
};

