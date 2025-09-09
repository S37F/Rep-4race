import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// For development/demo purposes, we'll use a simple in-memory store
// In production, this would be replaced with actual Supabase calls
class MockSupabaseService {
  private games = new Map<string, any>();
  private subscribers = new Map<string, Set<(data: any) => void>>();

  async createGame(gameData: any) {
    this.games.set(gameData.id, gameData);
    return { data: gameData, error: null };
  }

  async getGame(gameId: string) {
    const game = this.games.get(gameId);
    return { data: game || null, error: game ? null : { message: 'Game not found' } };
  }

  async updateGame(gameId: string, updates: any) {
    const game = this.games.get(gameId);
    if (game) {
      const updatedGame = { ...game, ...updates };
      this.games.set(gameId, updatedGame);
      this.notifySubscribers(gameId, updatedGame);
      return { data: updatedGame, error: null };
    }
    return { data: null, error: { message: 'Game not found' } };
  }

  subscribe(gameId: string, callback: (data: any) => void) {
    if (!this.subscribers.has(gameId)) {
      this.subscribers.set(gameId, new Set());
    }
    this.subscribers.get(gameId)!.add(callback);

    return {
      unsubscribe: () => {
        this.subscribers.get(gameId)?.delete(callback);
      }
    };
  }

  private notifySubscribers(gameId: string, data: any) {
    const subscribers = this.subscribers.get(gameId);
    if (subscribers) {
      subscribers.forEach(callback => callback(data));
    }
  }
}

export const mockSupabase = new MockSupabaseService();
