# Zeus Slot Machine - BetAndYou

A mobile-optimized slot machine game built with React and PIXI.js, featuring Zeus-themed graphics and smooth reel animations.

## Features

- ✅ **5-Reel Slot Machine** with 3 visible rows
- ✅ **Smooth Animation** - Realistic reel spinning and sequential stopping
- ✅ **Win Detection** - Automatic win combination detection (30% win rate)
- ✅ **Popup Bonus** - Shows win amount and bonus information
- ✅ **Mobile Optimized** - Responsive design for mobile browsers
- ✅ **Beautiful Design** - Zeus-themed graphics with golden borders

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or similar port).

### Production Build

```bash
npm run build
npm run preview
```

## How It Works

### Game Flow

1. **Click Spin Button** - Reels start spinning
2. **Reels Spin** - All 5 reels spin simultaneously
3. **Sequential Stopping** - Reels stop one by one (500ms delay between each)
4. **Win Detection** - System checks for win combinations in center row
5. **Popup Display** - If win, popup appears with bonus information
6. **Claim Bonus** - Click "CLAIM NOW" to open deposit page

### Win Combinations

- **3 Matching Symbols** = 450% Deposit Bonus
- **4 Matching Symbols** = 600% Deposit Bonus
- **5 Matching Symbols** = 1000% Deposit Bonus

### Win Probability

- Win chance: 30% (adjustable in `SlotMachine.jsx`)
- Winning spins show 3 matching symbols in first 3 reels
- Non-winning spins show random symbols

## Project Structure

```
src/
  ├── App.jsx              # Main app component
  ├── App.css              # Styles
  ├── components/
  │   ├── SlotMachine.jsx  # Slot machine logic (PIXI.js)
  │   └── Popup.jsx        # Win popup component
  └── main.jsx             # Entry point

public/
  └── assets/
      ├── symbols/         # 10 symbol images
      ├── zeus.png         # Zeus character
      └── Background.png   # Background image
```

## Technical Details

### Technologies

- **React 18** - UI framework
- **PIXI.js 7** - 2D WebGL renderer for slot reels
- **Vite** - Build tool and dev server
- **CSS3** - Styling with responsive design

### Key Features

- **Hardware-Accelerated Rendering** - Uses WebGL via PIXI.js
- **Smooth Animations** - 60fps reel animations
- **Asset Loading** - Reliable texture loading with fallbacks
- **Responsive Design** - Mobile-first approach
- **Touch-Friendly** - Optimized for touch devices

## Customization

### Adjust Win Probability

Edit `src/components/SlotMachine.jsx`:

```javascript
// Change from 0.3 (30%) to your desired probability
const willWin = Math.random() < 0.3;
```

### Adjust Spin Speed

Edit `src/components/SlotMachine.jsx`:

```javascript
// Change spin speed (currently 18-26)
reelData.speed = 18 + Math.random() * 8;
```

### Adjust Stop Delay

Edit `src/components/SlotMachine.jsx`:

```javascript
// Change delay between reel stops (currently 500ms)
const stopDelay = reelIndex * 500 + 1500;
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **60fps** animation performance
- **Hardware-accelerated** rendering
- **Cached textures** for fast symbol display
- **Optimized assets** for mobile

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy

The `dist` folder contains the production build. Deploy to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Any static hosting service

### Environment Variables

No environment variables required for basic functionality.

## Troubleshooting

### Symbols Not Loading

1. Check that symbol files exist in `public/assets/symbols/`
2. Check browser console for errors
3. Verify file paths are correct
4. Clear browser cache

### Reels Not Spinning

1. Check browser console for errors
2. Verify PIXI.js is loaded correctly
3. Check that assets are loaded before spinning

### Popup Not Showing

1. Check that win combination is detected
2. Verify `onSpinComplete` callback is working
3. Check browser console for errors

## License

Private project for BetAndYou.

## Support

For issues or questions, check the console for error messages and verify all assets are loaded correctly.
