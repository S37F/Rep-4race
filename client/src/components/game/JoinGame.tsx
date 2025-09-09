import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { useMultiplayerStore } from '../../lib/stores/useMultiplayerStore';
import { useGameStore } from '../../lib/stores/useGameStore';
import { toast } from 'sonner';

interface JoinGameProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function JoinGame({ onBack, onSuccess }: JoinGameProps) {
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const { joinGame, isLoading, error } = useMultiplayerStore();

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinCode.trim()) {
      toast.error('Please enter a join code');
      return;
    }

    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    const gameId = await joinGame(joinCode.trim().toUpperCase(), playerName.trim());
    
    if (gameId) {
      toast.success('Joined game successfully!');
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
              <UserPlus className="w-6 h-6" />
              Join Game
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleJoinGame} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="joinCode">Game Code</Label>
                <Input
                  id="joinCode"
                  type="text"
                  placeholder="Enter game code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="text-center text-lg font-mono tracking-wider"
                  required
                />
              </div>

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
                  disabled={isLoading || !joinCode.trim() || !playerName.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Joining Game...
                    </div>
                  ) : (
                    'Join Game'
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

            <div className="text-center text-sm text-gray-600">
              <p>Enter the 6-digit code shared by the game host</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
