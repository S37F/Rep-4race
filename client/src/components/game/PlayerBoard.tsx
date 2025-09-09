import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, User, Clock } from 'lucide-react';
import { Player, Chit as ChitType } from '../../types/game';
import { Chit } from './Chit';
import { checkWinCondition } from '../../utils/gameLogic';
import { cn } from '@/lib/utils';

interface PlayerBoardProps {
  player: Player;
  isCurrentPlayer?: boolean;
  isCurrentTurn?: boolean;
  isWinner?: boolean;
  selectedChit?: string | null;
  onChitSelect?: (chitId: string) => void;
  onClaimRank?: (rank: number) => void;
  availableRanks?: number[];
  className?: string;
}

export function PlayerBoard({
  player,
  isCurrentPlayer = false,
  isCurrentTurn = false,
  isWinner = false,
  selectedChit,
  onChitSelect,
  onClaimRank,
  availableRanks = [],
  className
}: PlayerBoardProps) {
  const hasWinningHand = checkWinCondition(player.chits);
  const canClaimRank = !isWinner && !player.rank && availableRanks.length > 0;

  const getRankColor = (rank?: number) => {
    if (!rank) return '';
    switch (rank) {
      case 1: return 'bg-yellow-500 text-white';
      case 2: return 'bg-gray-400 text-white';
      case 3: return 'bg-amber-600 text-white';
      case 4: return 'bg-slate-500 text-white';
      default: return 'bg-gray-300';
    }
  };

  const getRankText = (rank?: number) => {
    if (!rank) return '';
    const suffixes = ['st', 'nd', 'rd', 'th'];
    return `${rank}${suffixes[rank - 1] || 'th'}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("relative", className)}
    >
      <Card 
        className={cn(
          "transition-all duration-300",
          isCurrentTurn && "ring-2 ring-blue-500 player-glow",
          isWinner && "ring-2 ring-yellow-500 winner-pulse",
          hasWinningHand && !isWinner && "ring-2 ring-green-500"
        )}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {isCurrentPlayer ? (
                  <User className="w-4 h-4 text-blue-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-300" />
                )}
                <span className={cn(
                  "font-medium",
                  isCurrentPlayer && "text-blue-600"
                )}>
                  {player.name}
                </span>
              </div>
              
              {isCurrentTurn && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="w-4 h-4 text-blue-500" />
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {player.rank && (
                <Badge className={getRankColor(player.rank)}>
                  {getRankText(player.rank)}
                </Badge>
              )}
              
              {isWinner && (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Crown className="w-5 h-5 text-yellow-500" />
                </motion.div>
              )}
              
              {!player.isReady && player.chits.length === 0 && (
                <Badge variant="outline">Waiting...</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Chits Display */}
          <div className="grid grid-cols-4 gap-2">
            <AnimatePresence mode="popLayout">
              {player.chits.map((chit, index) => (
                <motion.div
                  key={chit.id}
                  layout
                  initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0, rotateY: -180 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                >
                  {isCurrentPlayer ? (
                    // Show actual chits only for current player
                    <Chit
                      chit={chit}
                      size="sm"
                      isSelected={selectedChit === chit.id}
                      isSelectable={isCurrentTurn}
                      onClick={() => {
                        if (isCurrentTurn && onChitSelect) {
                          onChitSelect(chit.id);
                        }
                      }}
                    />
                  ) : (
                    // Show card backs for other players
                    <motion.div 
                      className="w-12 h-16 bg-gradient-to-br from-purple-500 to-pink-500 border-3 border-yellow-400 rounded-xl flex items-center justify-center shadow-lg sparkle"
                      animate={{ rotate: [0, 2, -2, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                    >
                      <div className="text-white text-xl font-bold">❓</div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Empty slots */}
            {Array.from({ length: 4 - player.chits.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="w-12 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
              >
                <div className="text-gray-400 text-xs">Empty</div>
              </div>
            ))}
          </div>

          {/* Category Summary - Only for current player */}
          {isCurrentPlayer && player.chits.length > 0 && (
            <div className="text-xs text-gray-600">
              <div className="flex flex-wrap gap-1">
                {Object.entries(
                  player.chits.reduce((acc, chit) => {
                    acc[chit.category] = (acc[chit.category] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([category, count]) => (
                  <Badge key={category} variant="outline" className="text-xs">
                    {category}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Card count for other players */}
          {!isCurrentPlayer && player.chits.length > 0 && (
            <div className="text-xs text-gray-600 text-center">
              <Badge variant="outline" className="text-xs">
                {player.chits.length} cards
              </Badge>
            </div>
          )}

          {/* Rank Claiming Buttons */}
          {canClaimRank && (
            <div className="flex flex-wrap gap-1">
              {availableRanks.map(rank => (
                <Button
                  key={rank}
                  size="sm"
                  variant="outline"
                  onClick={() => onClaimRank?.(rank)}
                  className="text-xs"
                >
                  Claim {getRankText(rank)}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
