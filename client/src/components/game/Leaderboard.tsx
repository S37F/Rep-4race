import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Crown, Medal, Award, RotateCcw } from 'lucide-react';
import { GameHistory } from '../../types/game';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

export function Leaderboard() {
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);

  useEffect(() => {
    const history = getLocalStorage('fourrace-game-history') || [];
    setGameHistory(history);
  }, []);

  const clearHistory = () => {
    setLocalStorage('fourrace-game-history', []);
    setGameHistory([]);
  };

  const getRankIcon = (rank?: number) => {
    switch (rank) {
      case 1: return <Crown className="w-4 h-4 text-yellow-500" />;
      case 2: return <Medal className="w-4 h-4 text-gray-400" />;
      case 3: return <Trophy className="w-4 h-4 text-amber-600" />;
      case 4: return <Award className="w-4 h-4 text-slate-500" />;
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

  const getPlayerStats = () => {
    const stats: Record<string, { wins: number; games: number; totalRank: number }> = {};
    
    gameHistory.forEach(game => {
      game.rankings.forEach(player => {
        if (!stats[player.name]) {
          stats[player.name] = { wins: 0, games: 0, totalRank: 0 };
        }
        stats[player.name].games++;
        stats[player.name].totalRank += player.rank || 4;
        if (player.rank === 1) {
          stats[player.name].wins++;
        }
      });
    });

    return Object.entries(stats)
      .map(([name, data]) => ({
        name,
        ...data,
        winRate: data.games > 0 ? (data.wins / data.games) * 100 : 0,
        avgRank: data.games > 0 ? data.totalRank / data.games : 4,
      }))
      .sort((a, b) => b.winRate - a.winRate || a.avgRank - b.avgRank);
  };

  const playerStats = getPlayerStats();

  if (gameHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No games played yet. Complete your first game to see the leaderboard!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Player Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Player Statistics
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Clear History
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {playerStats.map((player, index) => (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-sm font-medium">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm text-gray-600">
                      {player.wins} wins • {player.games} games
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">
                    {player.winRate.toFixed(1)}% win rate
                  </div>
                  <div className="text-sm text-gray-600">
                    Avg rank: {player.avgRank.toFixed(1)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Game History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gameHistory.slice(0, 10).map((game, index) => (
              <motion.div
                key={game.gameId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {new Date(game.finishedAt).toLocaleDateString()} at{' '}
                    {new Date(game.finishedAt).toLocaleTimeString()}
                  </div>
                  <Badge variant="outline">
                    {game.rankings.length} players
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {game.rankings
                    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
                    .map((player) => (
                      <div
                        key={`${game.gameId}-${player.id}`}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        {getRankIcon(player.rank)}
                        <span className="text-sm font-medium">{player.name}</span>
                        <Badge className={`ml-auto ${getRankColor(player.rank)} text-xs`}>
                          {player.rank === 1 ? '1st' : 
                           player.rank === 2 ? '2nd' : 
                           player.rank === 3 ? '3rd' : '4th'}
                        </Badge>
                      </div>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
