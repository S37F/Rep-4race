import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gamepad2, Users, ArrowLeft } from 'lucide-react';
import { useMultiplayerStore } from '../../lib/stores/useMultiplayerStore';
import { useGameStore } from '../../lib/stores/useGameStore';
import { toast } from 'sonner';

interface CreateGameProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateGame({ onBack, onSuccess }: CreateGameProps) {
  const [playerName, setPlayerName] = useState('');
  const { createGame, isLoading, error } = useMultiplayerStore();
  const { initializeGame } = useGameStore();

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    const result = await createGame(playerName.trim());
    
    if (result) {
      const { gameId, joinCode } = result;
      
      // Initialize the game store
      initializeGame([{
        id: useMultiplayerStore.getState().currentPlayerId!,
        name: playerName.trim(),
        chits: [],
        position: 0,
        isReady: false,
      }], gameId, joinCode);
      
      toast.success('Game created successfully!');
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
              <Gamepad2 className="w-6 h-6" />
              Create New Game
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleCreateGame} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="playerName">Your Name</Label>
                <Input
                  id="playerName"
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={20}
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading || !playerName.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Game...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Create Game
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="w-full"
                  size="lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </form>

            <div className="text-center text-sm text-gray-600 space-y-2">
              <p>Game Rules:</p>
              <ul className="text-xs space-y-1">
                <li>• 2-4 players maximum</li>
                <li>• Collect 4 chits of the same category to win</li>
                <li>• Pass chits clockwise each turn</li>
                <li>• First to complete a set wins!</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
