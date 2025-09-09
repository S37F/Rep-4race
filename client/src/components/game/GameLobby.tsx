import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Copy, Check, Play, UserPlus, Bot, ArrowLeft } from 'lucide-react';
import { useGameStore } from '../../lib/stores/useGameStore';
import { useMultiplayerStore } from '../../lib/stores/useMultiplayerStore';
import { toast } from 'sonner';

interface GameLobbyProps {
  onBackToMenu: () => void;
}

export function GameLobby({ onBackToMenu }: GameLobbyProps) {
  const {
    players,
    joinCode,
    phase,
    startGame,
    setPlayerReady,
    addBotPlayer,
    removePlayer,
  } = useGameStore();

  const { currentPlayerId, syncGameState } = useMultiplayerStore();

  const [copied, setCopied] = useState(false);
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const allReady = players.length >= 2 && players.every(p => p.isReady);
  const canStart = allReady && players.length >= 2;

  const copyJoinCode = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      toast.success('Join code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy join code');
    }
  };

  const handleToggleReady = async () => {
    if (!currentPlayer) return;
    
    setPlayerReady(currentPlayer.id, !currentPlayer.isReady);
    await syncGameState(useGameStore.getState());
  };

  const handleStartGame = async () => {
    if (!canStart) return;
    
    startGame();
    await syncGameState(useGameStore.getState());
  };

  const handleAddBot = async () => {
    if (players.length >= 4) return;
    
    addBotPlayer();
    await syncGameState(useGameStore.getState());
    toast.success('Bot player added!');
  };

  const handleRemovePlayer = async (playerId: string) => {
    removePlayer(playerId);
    await syncGameState(useGameStore.getState());
  };

  const handleBackToMenu = () => {
    onBackToMenu();
  };

  if (phase !== 'lobby') {
    return null;
  }

  return (
    <div className="min-h-screen colorful-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Game Info Card */}
        <Card className="kid-card sparkle border-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-3xl font-bold">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToMenu}
                className="flex items-center gap-2 bg-gradient-to-r from-red-400 to-pink-400 text-white hover:from-red-500 hover:to-pink-500 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                🔙 Back
              </Button>
              <span className="flex-1 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent fun-bounce">
                🎮 Game Lobby 🎯
              </span>
              <div className="w-20"></div> {/* Spacer for centering */}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Join Code */}
            <div className="text-center space-y-3">
              <Label className="text-lg font-medium">Share this code with friends:</Label>
              <div className="flex items-center justify-center gap-3">
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-6 py-3">
                  <span className="text-2xl font-mono font-bold tracking-wider">
                    {joinCode}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyJoinCode}
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            {/* Player Count */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Users className="w-5 h-5" />
                <span>{players.length}/4 Players</span>
              </div>
              {players.length < 4 && (
                <p className="text-sm text-gray-500 mt-2">
                  Waiting for more players to join...
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Players List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-medium ${
                      player.name.startsWith('Bot') ? 'bg-purple-500' : 'bg-blue-500'
                    }`}>
                      {player.name.startsWith('Bot') ? <Bot className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className="font-medium">
                      {player.name}
                      {player.id === currentPlayerId && (
                        <span className="text-blue-600 ml-2">(You)</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={player.isReady ? "default" : "outline"}
                      className={player.isReady ? "bg-green-500" : ""}
                    >
                      {player.isReady ? "Ready" : "Not Ready"}
                    </Badge>
                    
                    {player.name.startsWith('Bot') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemovePlayer(player.id)}
                        className="text-red-600 hover:text-red-700 px-2"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: 4 - players.length }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 rounded-lg opacity-50"
                >
                  <div className="w-8 h-8 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center text-sm">
                    {players.length + index + 1}
                  </div>
                  <span className="text-gray-500">Waiting for player...</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {currentPlayer && (
                <Button
                  onClick={handleToggleReady}
                  variant={currentPlayer.isReady ? "outline" : "default"}
                  className="w-full"
                  size="lg"
                >
                  {currentPlayer.isReady ? "Not Ready" : "Ready to Play"}
                </Button>
              )}
              
              {players.length < 4 && (
                <Button
                  onClick={handleAddBot}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Add Bot Player
                </Button>
              )}
              
              {canStart && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Button
                    onClick={handleStartGame}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Game
                  </Button>
                </motion.div>
              )}
              
              {!canStart && players.length >= 2 && (
                <p className="text-center text-sm text-gray-600">
                  All players must be ready to start the game
                </p>
              )}
              
              {players.length < 2 && (
                <p className="text-center text-sm text-gray-600">
                  Need at least 2 players to start the game
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
