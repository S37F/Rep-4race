# 🎮 FourRace

A vibrant, kid-friendly multiplayer card-passing game built with React! Collect 4 cards of the same category to win in this exciting race to the finish line.

![FourRace Game](https://img.shields.io/badge/Game-FourRace-purple?style=for-the-badge&logo=gamepad2)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan?style=for-the-badge&logo=tailwindcss)

## 🎯 Game Overview

FourRace is an engaging multiplayer game where 2-4 players compete to be the first to collect 4 cards of the same category. Players take turns passing cards clockwise, creating a strategic and fun experience perfect for kids and families!

### 🏆 Game Categories
- 🍎 **Fruits**: Apple, Banana, Orange, Grapes
- 🚗 **Cars**: Sedan, SUV, Sports Car, Truck
- 🦁 **Animals**: Lion, Elephant, Tiger, Bear
- 🔴 **Colors**: Red, Blue, Green, Yellow

## ✨ Features

### 🎨 Kid-Friendly Design
- **Vibrant animated backgrounds** with shifting rainbow gradients
- **Colorful gradient buttons** with hover animations
- **Fun emojis** throughout the interface (🎮🎯🚀🏆)
- **Bouncing and rotating animations** for interactive elements
- **Rainbow borders** and sparkle effects
- **Playful card designs** with bright gradients

### 🎲 Game Features
- **Multiplayer Support**: 2-4 players per game
- **AI Bot Players**: Add computer opponents for practice
- **Real-time Gameplay**: Live game state synchronization
- **Turn-based System**: Clockwise card passing mechanics
- **Ranking System**: Claim 2nd, 3rd, and 4th place after winner
- **Game Statistics**: Track wins, games played, and performance
- **Responsive Design**: Works on desktop and mobile devices

### 🤖 Smart AI Bots
- **3 Bot Characters**: Bot Alice, Bot Bob, Bot Charlie
- **Intelligent Strategy**: Bots keep cards they have more of
- **Realistic Timing**: 1-3 second "thinking" delays
- **Auto Rank Claiming**: Bots automatically claim remaining ranks

### 🎪 Interactive Elements
- **Hidden Card System**: Other players' cards show as colorful "?" backs
- **Smooth Animations**: Framer Motion powered transitions
- **Visual Feedback**: Glowing effects for current turn
- **Loading States**: Engaging loading animations
- **Toast Notifications**: Fun success/error messages

## 🚀 Quick Start

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd fourrace
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5000` to start playing!

## 🎮 How to Play

### 🎯 Objective
Be the first player to collect 4 cards of the same category (Fruits, Cars, Animals, or Colors)!

### 📝 Game Rules

1. **Setup**: Each player starts with 4 random cards
2. **Turns**: Players take turns in clockwise order
3. **Passing**: On your turn, select 1 card to pass to the next player
4. **Winning**: First player to get 4 cards of the same category wins!
5. **Rankings**: After someone wins, remaining players can claim 2nd, 3rd, 4th place

### 🎯 Game Flow

1. **Create or Join Game**: Use a 6-digit join code to play with friends
2. **Add Players**: Up to 4 players (including AI bots)
3. **Ready Up**: All players mark themselves as ready
4. **Play**: Take turns passing cards clockwise
5. **Win**: Collect 4 matching cards to claim victory!

### 🤖 Playing with Bots

- Click "Add Bot Player" in the game lobby
- Bots are automatically ready to play
- Remove bots with the "Remove" button if needed
- Bots will play automatically on their turns

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for utility-first styling
- **shadcn/ui** component library
- **Framer Motion** for animations
- **Zustand** for state management
- **TanStack React Query** for server state

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **RESTful API** endpoints

### Database & Storage
- **Drizzle ORM** for database operations
- **PostgreSQL** (Neon Database) for production
- **Local Storage** for game history and preferences

### Real-time Features
- **Supabase** for multiplayer synchronization
- **Mock Service** fallback for development

## 🎨 Design System

### Color Palette
- **Primary**: Purple to Pink gradients
- **Secondary**: Blue to Cyan gradients  
- **Accent**: Yellow to Orange gradients
- **Success**: Green to Emerald gradients
- **Card Categories**: Bright, distinct gradients for each type

### Animations
- **Bouncing elements** for playful interaction
- **Rotating icons** for visual interest
- **Gradient shifts** for dynamic backgrounds
- **Scale animations** on hover/tap
- **Sparkle effects** for magical feeling

## 📁 Project Structure

```
fourrace/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── game/     # Game-specific components
│   │   │   └── ui/       # Reusable UI components
│   │   ├── lib/          # Utilities and stores
│   │   │   └── stores/   # Zustand state stores
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Helper functions
├── server/               # Backend Express server
├── shared/              # Shared types and schemas
└── README.md           # This file
```

## 🎯 Game Components

### Core Components
- **App.tsx**: Main application router
- **GameBoard.tsx**: Main game interface
- **GameLobby.tsx**: Pre-game player management
- **PlayerBoard.tsx**: Individual player display
- **Chit.tsx**: Individual card component
- **WinnerModal.tsx**: End game celebration

### UI Components
- **Button**: Colorful gradient buttons
- **Card**: Kid-friendly card containers
- **Badge**: Status indicators
- **Dialog**: Modal overlays
- **Toast**: Notification system

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
DATABASE_URL=your_database_url
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Build**: Vercel auto-detects the configuration
3. **Add Environment Variables**: Set up your environment variables
4. **Deploy**: Automatic deployment on every push

### Manual Deployment

1. **Build the project**
```bash
npm run build
```

2. **Deploy the `dist` folder** to your hosting provider

## 🎮 Game Strategy Tips

### For Players
- **Watch opponents**: Notice which cards they're keeping
- **Plan ahead**: Think about what you want to collect
- **Be flexible**: Sometimes change strategy mid-game
- **Use bots**: Practice against AI to improve your skills

### For Parents
- **Educational**: Helps with categorization and strategy
- **Social**: Encourages turn-taking and patience
- **Screen time**: Engaging but not overwhelming
- **Family fun**: Perfect for family game nights

## 🐛 Troubleshooting

### Common Issues

**Game won't start**
- Make sure all players are marked as "Ready"
- Need at least 2 players to start

**Cards not showing**
- Refresh the page if cards appear stuck
- Check your internet connection

**Join code not working**
- Make sure you're entering the correct 6-digit code
- Code is case-sensitive (use UPPERCASE)

### Performance Tips
- **Close other browser tabs** for better performance
- **Use modern browsers** (Chrome, Firefox, Safari, Edge)
- **Stable internet** for multiplayer synchronization

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b amazing-feature`
3. **Make your changes**: Add your awesome improvements
4. **Commit changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin amazing-feature`
6. **Open a Pull Request**: Describe your changes

### Development Guidelines
- **Follow TypeScript best practices**
- **Use existing component patterns**
- **Maintain kid-friendly design**
- **Add tests for new features**
- **Update documentation**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- **shadcn/ui** for beautiful component library
- **Framer Motion** for smooth animations
- **TailwindCSS** for utility-first styling
- **Lucide React** for amazing icons
- **Supabase** for real-time capabilities

## 📞 Support

Having trouble? We're here to help!

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this README for answers
- **Community**: Join our discussions

---

<div align="center">

**🎮 Made with ❤️ for kids and families everywhere! 🎮**

**Have fun playing FourRace! 🏆**

</div>
