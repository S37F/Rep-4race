import { create } from 'zustand';
import { mockSupabase } from '../supabase';
import { GameState, Player } from '../../types/game';
import { generateJoinCode } from '../../utils/gameLogic';

interface MultiplayerStore {
  isConnected: boolean;
  currentPlayerId: string | null;
  error: string | null;
  isLoading: boolean;
  
  // Actions
  createGame: (playerName: string) => Promise<{ gameId: string; joinCode: string } | null>;
  joinGame: (joinCode: string, playerName: string) => Promise<string | null>;
  leaveGame: () => void;
  syncGameState: (gameState: Partial<GameState>) => Promise<void>;
  subscribeToGame: (gameId: string, callback: (gameState: GameState) => void) => () => void;
  setError: (error: string | null) => void;
}

export const useMultiplayerStore = create<MultiplayerStore>((set, get) => ({
  isConnected: false,
  currentPlayerId: null,
  error: null,
  isLoading: false,

  createGame: async (playerName: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const gameId = `game_${Date.now()}`;
      const joinCode = generateJoinCode();
      const playerId = `player_${Date.now()}`;
      
      const gameData: GameState = {
        id: gameId,
        joinCode,
        players: [{
          id: playerId,
          name: playerName,
          chits: [],
          position: 0,
          isReady: false,
        }],
        currentTurn: 0,
        phase: 'lobby',
        rankings: [],
        createdAt: new Date().toISOString(),
      };

      const { data, error } = await mockSupabase.createGame(gameData);
      
      if (error) {
        set({ error: 'message' in error ? error.message : 'Failed to create game', isLoading: false });
        return null;
      }

      set({ 
        isConnected: true, 
        currentPlayerId: playerId,
        isLoading: false 
      });
      
      return { gameId, joinCode };
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create game',
        isLoading: false 
      });
      return null;
    }
  },

  joinGame: async (joinCode: string, playerName: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real implementation, we'd search for the game by join code
      // For now, we'll simulate finding a game
      const gameId = `game_${joinCode}`;
      const { data: gameData, error } = await mockSupabase.getGame(gameId);
      
      if (error || !gameData) {
        set({ error: 'Game not found', isLoading: false });
        return null;
      }

      if (gameData.players.length >= 4) {
        set({ error: 'Game is full', isLoading: false });
        return null;
      }

      const playerId = `player_${Date.now()}`;
      const newPlayer: Player = {
        id: playerId,
        name: playerName,
        chits: [],
        position: gameData.players.length,
        isReady: false,
      };

      await mockSupabase.updateGame(gameId, {
        players: [...gameData.players, newPlayer]
      });

      set({ 
        isConnected: true, 
        currentPlayerId: playerId,
        isLoading: false 
      });
      
      return gameId;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to join game',
        isLoading: false 
      });
      return null;
    }
  },

  leaveGame: () => {
    set({ 
      isConnected: false, 
      currentPlayerId: null, 
      error: null 
    });
  },

  syncGameState: async (gameState: Partial<GameState>) => {
    if (!gameState.id) return;
    
    try {
      await mockSupabase.updateGame(gameState.id, gameState);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sync game state'
      });
    }
  },

  subscribeToGame: (gameId: string, callback: (gameState: GameState) => void) => {
    const subscription = mockSupabase.subscribe(gameId, callback);
    return subscription.unsubscribe;
  },

  setError: (error: string | null) => set({ error }),
}));
