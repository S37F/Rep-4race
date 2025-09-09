import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, RotateCcw, Users, Clock, Bot, ArrowLeft } from 'lucide-react';
import { PlayerBoard } from './PlayerBoard';
import { WinnerModal } from './WinnerModal';
import { useGameStore } from '../../lib/stores/useGameStore';
import { useMultiplayerStore } from '../../lib/stores/useMultiplayerStore';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  onBackToMenu: () => void;
}

export function GameBoard({ onBackToMenu }: GameBoardProps) {
  const {
    players,
    currentTurn,
    phase,
    winner,
    rankings,
    selectedChit,
    id,
    joinCode,
    setSelectedChit,
    passChit,
    setPlayerRank,
    resetGame,
    makeBotMove,
  } = useGameStore();

  const { currentPlayerId, syncGameState } = useMultiplayerStore();

  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const isCurrentPlayerTurn = currentPlayer?.position === currentTurn;
  const currentTurnPlayer = players.find(p => p.position === currentTurn);
  
  const availableRanks = [2, 3, 4].filter(rank => 
    !rankings.find(r => r.rank === rank)
  );

  // Trigger bot moves automatically
  useEffect(() => {
    if (phase === 'playing' && currentTurnPlayer?.name.startsWith('Bot')) {
      // Add a small delay before bot makes a move
      const timer = setTimeout(() => {
        makeBotMove(currentTurnPlayer.id);
      }, 1500); // 1.5 second delay
      
      return () => clearTimeout(timer);
    }
  }, [phase, currentTurnPlayer, makeBotMove]);

  const handlePassChit = async () => {
    if (!selectedChit || !currentPlayer) return;
    
    passChit(currentPlayer.id, selectedChit);
    setSelectedChit(null);
    
    // Sync with multiplayer
    await syncGameState(useGameStore.getState());
  };

  const handleClaimRank = async (playerId: string, rank: number) => {
    setPlayerRank(playerId, rank);
    await syncGameState(useGameStore.getState());
  };

  const handleResetGame = async () => {
    resetGame();
    await syncGameState(useGameStore.getState());
  };

  if (players.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-gray-600">
              Loading game...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen colorful-bg p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Game Header */}
        <Card className="kid-card rainbow-border p-1">
          <div className="bg-white rounded-lg p-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.h1 
                  className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent fun-bounce"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎮 FourRace
                </motion.h1>
                <Badge className="text-sm bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold">
                  🎯 Game: {joinCode}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBackToMenu}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Menu
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {players.length}/4 Players
                </div>
                
                {phase === 'playing' && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    {currentTurnPlayer?.name.startsWith('Bot') ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                    {players[currentTurn]?.name}'s Turn
                    {currentTurnPlayer?.name.startsWith('Bot') && (
                      <span className="text-purple-600">(AI Thinking...)</span>
                    )}
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetGame}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </CardTitle>
          </div>
        </Card>

        {/* Current Player's Actions */}
        {phase === 'playing' && isCurrentPlayerTurn && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-purple-300 sparkle">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <motion.h2 
                    className="text-xl font-bold text-purple-800 fun-bounce"
                    animate={{ rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  >
                    🎯 Your Turn! Select a card to pass! 🔄
                  </motion.h2>
                  
                  {selectedChit && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      <Button
                        onClick={handlePassChit}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg border-0 text-lg"
                        size="lg"
                      >
                        🚀 Pass Selected Card
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Game Phase Status */}
        <div className="text-center">
          {phase === 'lobby' && (
            <Badge className="text-sm px-4 py-2">
              Waiting for players to join...
            </Badge>
          )}
          {phase === 'passing' && (
            <Badge className="text-sm px-4 py-2 bg-yellow-500">
              Passing chits...
            </Badge>
          )}
          {phase === 'finished' && (
            <Badge className="text-sm px-4 py-2 bg-green-500">
              Game Finished!
            </Badge>
          )}
        </div>

        {/* Players Grid */}
        <div className={cn(
          "grid gap-6",
          players.length <= 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4"
        )}>
          <AnimatePresence mode="popLayout">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
              >
                <PlayerBoard
                  player={player}
                  isCurrentPlayer={player.id === currentPlayerId}
                  isCurrentTurn={player.position === currentTurn}
                  isWinner={winner?.id === player.id}
                  selectedChit={selectedChit}
                  onChitSelect={setSelectedChit}
                  onClaimRank={(rank) => handleClaimRank(player.id, rank)}
                  availableRanks={availableRanks}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Game Status */}
        {phase !== 'lobby' && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  Turn: {currentTurn + 1} | Phase: {phase}
                </div>
                <div>
                  {rankings.length > 0 && `Rankings: ${rankings.length}/4 assigned`}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Winner Modal */}
      <WinnerModal />
    </div>
  );
}
