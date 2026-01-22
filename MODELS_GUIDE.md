# Getting Models for Character Controller

## The Error Fix
The `capsuleGeometry` error has been fixed by using `cylinderGeometry` instead, which is more universally supported.

## Getting the "Animated Uncle Pete" Model

### Option 1: Inspect the Demo Site (Recommended)
1. Open https://character-control.vercel.app/ in Chrome/Firefox
2. Open DevTools (F12)
3. Go to **Network** tab
4. Filter by "glb" or "gltf"
5. Refresh the page
6. Look for model files being loaded (usually named something like `uncle-pete.glb`, `character.glb`, etc.)
7. Right-click the file → "Copy link address"
8. Download it:
   ```bash
   wget <copied-url> -O public/models/uncle-pete.glb
   ```
   Or use curl:
   ```bash
   curl <copied-url> -o public/models/uncle-pete.glb
   ```

### Option 2: Contact Kay Lousberg
- The model is credited to @KayLousberg
- Check their website/store: https://kaylousberg.itch.io/
- They have character packs available (some free, some paid)
- Contact them for licensing information

### Option 3: Use Free Alternatives

#### Mixamo (Free, by Adobe)
1. Go to https://www.mixamo.com/
2. Download a free character (rigged and animated)
3. Download animations: Idle, Walk, Run, Jump
4. Export as GLB format
5. Place in `public/models/`

#### KayKit Character Pack (Free tier available)
- https://kaylousberg.itch.io/kaykit-adventurers
- Free version includes 5 characters
- CC0 licensed (free for commercial use)
- Includes GLTF/GLB formats

#### Other Free Sources
- **Sketchfab**: Filter by "Downloadable" and "Free"
- **CGTrader**: Free models section
- **OpenGameArt**: Free game assets

## Required Animations

Your model must have these animations (exact names):
- `Idle`
- `Walk`
- `Run`
- `Jump_Start`
- `Jump_Idle`
- `Jump_Land`
- `Fall`

Optional animations:
- `Action1` (Wave)
- `Action2` (Dance)
- `Action3` (Cheer)
- `Action4` (Attack)

## After Getting the Model

1. Place the `.glb` file in `public/models/uncle-pete.glb`
2. In `src/modules/courtyard/Courtyard.js`:
   - Uncomment the `CharacterModel` import
   - Uncomment the `<EcctrlAnimation>` block
   - Set `animated={true}` in `<Ecctrl>` props
   - Verify animation names match your model

## Quick Test with Mixamo

1. Go to https://www.mixamo.com/
2. Choose a character (e.g., "Remy" or "Y Bot")
3. Download the character as GLB
4. Download these animations and attach to character:
   - Idle
   - Walking
   - Running
   - Jump
5. Export as GLB with animations
6. Place in `public/models/character.glb`
7. Update the code to use your model
