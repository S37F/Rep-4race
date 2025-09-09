import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Chit as ChitType } from '../../types/game';
import { getCategoryColor } from '../../utils/gameLogic';
import { cn } from '@/lib/utils';

interface ChitProps {
  chit: ChitType;
  isSelected?: boolean;
  isSelectable?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Chit({ 
  chit, 
  isSelected = false, 
  isSelectable = false, 
  onClick,
  size = 'md',
  className 
}: ChitProps) {
  const sizeClasses = {
    sm: 'w-12 h-16 text-xs',
    md: 'w-16 h-20 text-sm',
    lg: 'w-20 h-24 text-base'
  };

  const emojiSizes = {
    sm: 'text-lg',
    md: 'text-2xl', 
    lg: 'text-3xl'
  };

  return (
    <motion.div
      whileHover={isSelectable ? { scale: 1.05, y: -4 } : {}}
      whileTap={isSelectable ? { scale: 0.95 } : {}}
      animate={isSelected ? { y: -8, scale: 1.1 } : { y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn("cursor-pointer", className)}
      onClick={onClick}
    >
      <Card 
        className={cn(
          "relative flex flex-col items-center justify-center p-2 border-2 transition-all duration-200",
          sizeClasses[size],
          getCategoryColor(chit.category),
          isSelected && "ring-2 ring-blue-500 ring-offset-2 shadow-lg",
          isSelectable && "hover:shadow-md",
          !isSelectable && "cursor-default"
        )}
      >
        <div className={cn("mb-1", emojiSizes[size])}>
          {chit.emoji}
        </div>
        <div className="text-center font-medium leading-tight">
          {chit.name}
        </div>
        
        {isSelected && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
