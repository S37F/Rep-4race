import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Users, Trophy, Plus, UserPlus } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { CreateGame } from '@/components/game/CreateGame';
import { JoinGame } from '@/components/game/JoinGame';
import { GameLobby } from '@/components/game/GameLobby';
import { GameBoard } from '@/components/game/GameBoard';
import { Leaderboard } from '@/components/game/Leaderboard';
import { useGameStore } from '@/lib/stores/useGameStore';
import { useMultiplayerStore } from '@/lib/stores/useMultiplayerStore';

type AppState = 'menu' | 'create' | 'join' | 'lobby' | 'game' | 'leaderboard';

function App() {
  const [appState, setAppState] = useState<AppState>('menu');
  const { phase, id: gameId } = useGameStore();
  const { isConnected, subscribeToGame, leaveGame } = useMultiplayerStore();

  // Set up real-time sync when connected to a game
  useEffect(() => {
    if (isConnected && gameId) {
      const unsubscribe = subscribeToGame(gameId, (gameState) => {
        // Update local game state with remote changes
        useGameStore.setState(gameState);
      });

      return unsubscribe;
    }
  }, [isConnected, gameId, subscribeToGame]);

  // Handle state transitions based on game phase
  useEffect(() => {
    if (isConnected) {
      if (phase === 'lobby') {
        setAppState('lobby');
      } else if (phase === 'playing' || phase === 'passing' || phase === 'finished') {
        setAppState('game');
      }
    }
  }, [phase, isConnected]);

  const handleBackToMenu = () => {
    // Clean up game state and disconnect
    leaveGame();
    useGameStore.setState({
      players: [],
      currentTurn: 0,
      phase: 'lobby',
      rankings: [],
      winner: undefined,
      selectedChit: null,
      passingStates: [],
      id: '',
      joinCode: '',
      createdAt: new Date().toISOString(),
    });
    setAppState('menu');
  };

  const renderContent = () => {
    switch (appState) {
      case 'create':
        return (
          <CreateGame
            onBack={() => setAppState('menu')}
            onSuccess={() => setAppState('lobby')}
          />
        );
        
      case 'join':
        return (
          <JoinGame
            onBack={() => setAppState('menu')}
            onSuccess={() => setAppState('lobby')}
          />
        );
        
      case 'lobby':
        return <GameLobby onBackToMenu={() => handleBackToMenu()} />;
        
      case 'game':
        return <GameBoard onBackToMenu={() => handleBackToMenu()} />;
        
      case 'leaderboard':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Game Statistics</h1>
                <Button
                  variant="outline"
                  onClick={() => setAppState('menu')}
                >
                  Back to Menu
                </Button>
              </div>
              <Leaderboard />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="min-h-screen colorful-bg flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-full max-w-md"
            >
              <Card className="kid-card sparkle border-4">
                <CardHeader>
                  <CardTitle className="text-center text-4xl font-bold flex items-center justify-center gap-3 fun-bounce">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Gamepad2 className="w-10 h-10 text-purple-600" />
                    </motion.div>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      FourRace
                    </span>
                  </CardTitle>
                  <p className="text-center text-purple-700 text-lg font-medium">
                    🎯 Collect 4 items of the same type to win! 🏆
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => setAppState('create')}
                        size="lg"
                        className="w-full flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg border-0"
                      >
                        <Plus className="w-6 h-6" />
                        🎮 Create New Game
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => setAppState('join')}
                        size="lg"
                        className="w-full flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 rounded-xl shadow-lg border-0"
                      >
                        <UserPlus className="w-6 h-6" />
                        👥 Join Game
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => setAppState('leaderboard')}
                        size="lg"
                        className="w-full flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg border-0"
                      >
                        <Trophy className="w-6 h-6" />
                        🏆 Leaderboard
                      </Button>
                    </motion.div>
                  </div>

                  <div className="mt-6 space-y-3 text-sm bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl">
                    <h3 className="font-bold text-purple-800 text-center text-lg">🎲 How to Play:</h3>
                    <ul className="space-y-2 text-sm text-purple-700">
                      <li className="flex items-center gap-2">👥 <strong>2-4 players</strong> take turns</li>
                      <li className="flex items-center gap-2">🎴 Each player starts with <strong>4 random cards</strong></li>
                      <li className="flex items-center gap-2">🔄 Pass <strong>1 card clockwise</strong> each turn</li>
                      <li className="flex items-center gap-2">🎯 First to collect <strong>4 cards of the same type</strong> wins!</li>
                      <li className="flex items-center gap-2">🥈 Other players can claim <strong>2nd, 3rd, 4th place</strong></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={appState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
