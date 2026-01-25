# Foliage Module

This module contains React Three Fiber components for rendering trees and foliage, converted from the reference project's raw Three.js implementation.

## Components

### `Trees`
Main component for rendering instanced trees with bodies and foliage.

**Props:**
- `name` (string): Name of tree type (for debugging)
- `visualModelPath` (string): Path to visual GLB model containing tree body and leaves meshes
- `referencesModelPath` (string): Path to references GLB model containing tree positions/transforms
- `colorA` (string): First color for leaves (hex string, default: '#ffffff')
- `colorB` (string): Second color for leaves (hex string, default: '#888888')
- `seeThrough` (boolean): Enable see-through effect for leaves (default: false)

### `Foliage`
Component for rendering instanced foliage/leaves using SDF textures.

**Props:**
- `references` (Array): Array of Object3D references for instance positions
- `colorA` (string): First color (hex string, default: '#ffffff')
- `colorB` (string): Second color (hex string, default: '#888888')
- `seeThrough` (boolean): Enable see-through effect around camera/vehicle (default: false)

### Convenience Components

- `BirchTrees` - Pre-configured birch trees
- `OakTrees` - Pre-configured oak trees  
- `CherryTrees` - Pre-configured cherry trees with see-through enabled

## Usage Example

```jsx
import { BirchTrees, OakTrees, CherryTrees } from './modules/foliage'

function MyScene() {
  return (
    <>
      <BirchTrees />
      <OakTrees />
      <CherryTrees />
    </>
  )
}
```

Or use the base `Trees` component with custom paths:

```jsx
import { Trees } from './modules/foliage'

function MyScene() {
  return (
    <Trees
      name="Custom Tree"
      visualModelPath="/models/trees/custom/customVisual.glb"
      referencesModelPath="/models/trees/custom/customReferences.glb"
      colorA="#ff0000"
      colorB="#00ff00"
    />
  )
}
```

## Model Requirements

### Visual Model
The visual GLB model should contain:
- Meshes named starting with `treeLeaves` for foliage
- A mesh named starting with `treeBody` for the tree trunk/branches

### References Model
The references GLB model should contain:
- Object3D children representing tree positions and transforms in the scene

## Assets

Tree models are located in:
- `/public/models/trees/birchTrees/`
- `/public/models/trees/oakTrees/`
- `/public/models/trees/cherryTrees/`

Foliage texture:
- `/public/textures/foliageSDF.png`

## Notes

- The original reference project used Three.js WebGPU with TSL (Three Shading Language)
- This R3F version uses standard Three.js materials (MeshStandardMaterial)
- Some advanced shader features from the original (like advanced see-through effects) are simplified
- The components use instanced rendering for performance
