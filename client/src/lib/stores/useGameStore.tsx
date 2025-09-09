import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Player, GameState, Chit, PassingState } from '../../types/game';
import { distributeChits, checkWinCondition, getNextPlayerPosition } from '../../utils/gameLogic';

interface GameStore extends GameState {
  selectedChit: string | null;
  passingStates: PassingState[];
  
  // Actions
  setSelectedChit: (chitId: string | null) => void;
  initializeGame: (players: Player[], gameId: string, joinCode: string) => void;
  addPlayer: (player: Omit<Player, 'chits' | 'position'>) => void;
  addBotPlayer: () => void;
  removePlayer: (playerId: string) => void;
  setPlayerReady: (playerId: string, isReady: boolean) => void;
  startGame: () => void;
  passChit: (fromPlayerId: string, chitId: string) => void;
  completePass: (fromPlayerId: string, toPlayerId: string, chitId: string) => void;
  setPlayerRank: (playerId: string, rank: number) => void;
  resetGame: () => void;
  makeBotMove: (playerId: string) => void;
}

const initialState: Omit<GameState, 'id' | 'joinCode'> = {
  players: [],
  currentTurn: 0,
  phase: 'lobby',
  rankings: [],
  createdAt: new Date().toISOString(),
};

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,
    id: '',
    joinCode: '',
    selectedChit: null,
    passingStates: [],

    setSelectedChit: (chitId) => set({ selectedChit: chitId }),

    initializeGame: (players, gameId, joinCode) => {
      const playersWithPositions = players.map((player, index) => ({
        ...player,
        position: index,
        chits: [],
        isReady: false,
      }));

      set({
        ...initialState,
        id: gameId,
        joinCode,
        players: playersWithPositions,
      });
    },

    addPlayer: (newPlayer) => {
      const { players } = get();
      if (players.length >= 4) return;

      const playerWithPosition: Player = {
        ...newPlayer,
        position: players.length,
        chits: [],
        isReady: false,
      };

      set({ players: [...players, playerWithPosition] });
    },

    addBotPlayer: () => {
      const { players } = get();
      if (players.length >= 4) return;

      const botNames = ['Bot Alice', 'Bot Bob', 'Bot Charlie'];
      const availableBotNames = botNames.filter(name => 
        !players.some(p => p.name === name)
      );
      
      if (availableBotNames.length === 0) return;

      const botPlayer: Player = {
        id: `bot_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        name: availableBotNames[0],
        chits: [],
        position: players.length,
        isReady: true, // Bots are always ready
      };

      set({ players: [...players, botPlayer] });
    },

    removePlayer: (playerId) => {
      const { players } = get();
      const filteredPlayers = players
        .filter(p => p.id !== playerId)
        .map((player, index) => ({ ...player, position: index }));
      
      set({ players: filteredPlayers });
    },

    setPlayerReady: (playerId, isReady) => {
      const { players } = get();
      const updatedPlayers = players.map(player =>
        player.id === playerId ? { ...player, isReady } : player
      );
      set({ players: updatedPlayers });
    },

    startGame: () => {
      const { players } = get();
      if (players.length < 2 || !players.every(p => p.isReady)) return;

      const playerChits = distributeChits(players.length);
      const updatedPlayers = players.map((player, index) => ({
        ...player,
        chits: playerChits[index],
      }));

      set({
        players: updatedPlayers,
        phase: 'playing',
        currentTurn: 0,
      });
    },

    passChit: (fromPlayerId, chitId) => {
      const { players, currentTurn } = get();
      const fromPlayer = players.find(p => p.id === fromPlayerId);
      if (!fromPlayer || fromPlayer.position !== currentTurn) return;

      const toPlayerPosition = getNextPlayerPosition(fromPlayer.position, players.length);
      const toPlayer = players.find(p => p.position === toPlayerPosition);
      if (!toPlayer) return;

      set({ phase: 'passing' });

      // Add passing animation state
      const passingState: PassingState = {
        fromPlayerId,
        toPlayerId: toPlayer.id,
        chitId,
        isAnimating: true,
      };

      set({ passingStates: [passingState] });

      // Complete the pass after animation
      setTimeout(() => {
        get().completePass(fromPlayerId, toPlayer.id, chitId);
      }, 1000);
    },

    completePass: (fromPlayerId, toPlayerId, chitId) => {
      const { players, currentTurn } = get();
      
      const fromPlayerIndex = players.findIndex(p => p.id === fromPlayerId);
      const toPlayerIndex = players.findIndex(p => p.id === toPlayerId);
      
      if (fromPlayerIndex === -1 || toPlayerIndex === -1) return;

      const fromPlayer = players[fromPlayerIndex];
      const toPlayer = players[toPlayerIndex];
      
      const chitIndex = fromPlayer.chits.findIndex(c => c.id === chitId);
      if (chitIndex === -1) return;

      const passedChit = fromPlayer.chits[chitIndex];
      
      const updatedPlayers = [...players];
      updatedPlayers[fromPlayerIndex] = {
        ...fromPlayer,
        chits: fromPlayer.chits.filter(c => c.id !== chitId),
      };
      updatedPlayers[toPlayerIndex] = {
        ...toPlayer,
        chits: [...toPlayer.chits, passedChit],
      };

      // Check for winner
      const winnerPlayer = updatedPlayers.find(player => 
        checkWinCondition(player.chits)
      );

      if (winnerPlayer) {
        set({
          players: updatedPlayers,
          winner: winnerPlayer,
          phase: 'finished',
          rankings: [winnerPlayer],
          passingStates: [],
          selectedChit: null,
        });
        
        // Auto-assign ranks for bot players after a delay
        setTimeout(() => {
          const state = get();
          const unrankedBots = state.players.filter(p => 
            p.name.startsWith('Bot') && !state.rankings.find(r => r.id === p.id)
          );
          
          unrankedBots.forEach((bot, index) => {
            setTimeout(() => {
              const currentState = get();
              const availableRanks = [2, 3, 4].filter(rank => 
                !currentState.rankings.find(r => r.rank === rank)
              );
              
              if (availableRanks.length > 0) {
                currentState.setPlayerRank(bot.id, availableRanks[0]);
              }
            }, (index + 1) * 1000); // Stagger bot rank claims by 1 second each
          });
        }, 2000); // Wait 2 seconds after winner announcement
      } else {
        const nextTurn = getNextPlayerPosition(currentTurn, players.length);
        set({
          players: updatedPlayers,
          currentTurn: nextTurn,
          phase: 'playing',
          passingStates: [],
          selectedChit: null,
        });
      }
    },

    setPlayerRank: (playerId, rank) => {
      const { players, rankings } = get();
      const player = players.find(p => p.id === playerId);
      if (!player || rankings.find(r => r.id === playerId)) return;

      const rankedPlayer = { ...player, rank };
      const updatedRankings = [...rankings, rankedPlayer].sort((a, b) => (a.rank || 0) - (b.rank || 0));

      set({ rankings: updatedRankings });
    },

    makeBotMove: (playerId) => {
      const { players, currentTurn, phase } = get();
      const botPlayer = players.find(p => p.id === playerId);
      
      if (!botPlayer || botPlayer.position !== currentTurn || phase !== 'playing') {
        return;
      }

      // Bot strategy: prefer to keep chits of the same category
      const categoryCount: Record<string, { count: number; chits: Chit[] }> = {};
      botPlayer.chits.forEach(chit => {
        if (!categoryCount[chit.category]) {
          categoryCount[chit.category] = { count: 0, chits: [] };
        }
        categoryCount[chit.category].count++;
        categoryCount[chit.category].chits.push(chit);
      });

      // Find the category with the least chits to pass away
      let chitToPass = botPlayer.chits[0]; // fallback
      let minCount = 5;
      
      Object.entries(categoryCount).forEach(([category, data]) => {
        if (data.count < minCount) {
          minCount = data.count;
          chitToPass = data.chits[0];
        }
      });

      // Make the move after a short delay to simulate thinking
      setTimeout(() => {
        get().passChit(playerId, chitToPass.id);
      }, 1000 + Math.random() * 2000); // 1-3 second delay
    },

    resetGame: () => {
      const { players, id, joinCode } = get();
      const resetPlayers = players.map(player => ({
        ...player,
        chits: [],
        isReady: player.name.startsWith('Bot') ? true : false, // Keep bots ready
        rank: undefined,
      }));

      set({
        ...initialState,
        id,
        joinCode,
        players: resetPlayers,
        selectedChit: null,
        passingStates: [],
      });
    },
  }))
);
