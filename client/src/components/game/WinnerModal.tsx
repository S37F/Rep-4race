import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Trophy, Medal, Award } from 'lucide-react';
import { useGameStore } from '../../lib/stores/useGameStore';
import { useMultiplayerStore } from '../../lib/stores/useMultiplayerStore';

export function WinnerModal() {
  const { winner, rankings, phase, resetGame } = useGameStore();
  const { syncGameState } = useMultiplayerStore();

  const isOpen = phase === 'finished' && !!winner;

  const getRankIcon = (rank?: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Trophy className="w-6 h-6 text-amber-600" />;
      case 4: return <Award className="w-6 h-6 text-slate-500" />;
      default: return null;
    }
  };

  const getRankColor = (rank?: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-500 text-white';
      case 2: return 'bg-gray-400 text-white';
      case 3: return 'bg-amber-600 text-white';
      case 4: return 'bg-slate-500 text-white';
      default: return 'bg-gray-300';
    }
  };

  const handleNewGame = async () => {
    resetGame();
    await syncGameState(useGameStore.getState());
  };

  if (!winner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            🎉 Game Finished! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Winner Celebration */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                className="flex justify-center mb-3"
              >
                <Crown className="w-12 h-12" />
              </motion.div>
              <h2 className="text-xl font-bold mb-2">Winner!</h2>
              <p className="text-lg">{winner.name}</p>
              <p className="text-sm opacity-90 mt-2">
                Collected all {winner.chits[0]?.category} chits!
              </p>
            </div>
          </motion.div>

          {/* Final Rankings */}
          {rankings.length > 1 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-center">Final Rankings</h3>
              <div className="space-y-2">
                {rankings
                  .sort((a, b) => (a.rank || 0) - (b.rank || 0))
                  .map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getRankIcon(player.rank)}
                        <span className="font-medium">{player.name}</span>
                      </div>
                      <Badge className={getRankColor(player.rank)}>
                        {player.rank === 1 ? '1st' : 
                         player.rank === 2 ? '2nd' : 
                         player.rank === 3 ? '3rd' : '4th'} Place
                      </Badge>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleNewGame}
              className="flex-1"
              size="lg"
            >
              New Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
