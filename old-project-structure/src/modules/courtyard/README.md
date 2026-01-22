# Character Controller Scene

This scene replicates the [Ecctrl Floating Character Controller Demo](https://character-control.vercel.app/) by Andrew Chen.

## Features Implemented

✅ Grid floor with visual grid lines  
✅ Text overlay with control instructions  
✅ Keyboard controls (WASD/Arrow keys, Shift, Space)  
✅ Joystick controls for mobile/touch devices  
✅ Physics-based character movement  
✅ Floating character controller  
✅ Multiple test platforms/obstacles  
✅ 3D text in scene  
✅ Proper lighting and shadows  
✅ Environment preset  

## Adding the Animated Uncle Pete Model

To add the "Animated Uncle Pete" character model by @KayLousberg:

1. **Get the model:**
   - The model is credited to @KayLousberg
   - You may need to contact the artist or check the ecctrl GitHub repository for model resources
   - The model should be in GLB/GLTF format

2. **Place the model:**
   - Put the model file in `public/models/uncle-pete.glb`

3. **Update Courtyard.js:**
   - Uncomment the `CharacterModel` import at the top
   - Uncomment the `<EcctrlAnimation>` block inside `<Ecctrl>`
   - Set `animated={true}` in the `<Ecctrl>` props
   - Remove or comment out the fallback capsule mesh

4. **Verify animations:**
   The model must have these animations with exact names:
   - `Idle`
   - `Walk`
   - `Run`
   - `Jump_Start`
   - `Jump_Idle`
   - `Jump_Land`
   - `Fall`

## Controls

- **WASD / Arrow Keys** - Move character
- **Shift** - Run/Sprint
- **Space** - Jump
- **Mouse** - Rotate camera (in FixedCamera mode)

## Customization

You can adjust character behavior by modifying props in the `<Ecctrl>` component:
- `maxVelLimit` - Maximum movement speed
- `jumpVel` - Jump height/velocity
- `floatHeight` - How high the character floats above ground
- `springK` / `dampingC` - Floating physics parameters
- `camInitDis`, `camMaxDis`, `camMinDis` - Camera distance settings
