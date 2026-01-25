// Export tree components
export { default as Trees } from './Trees.jsx'
export { default as Foliage } from './Foliage.jsx'

// Convenience components for specific tree types
import Trees from './Trees.jsx'

export function BirchTrees(props) {
  return (
    <Trees
      name="Birch Tree"
      visualModelPath="./models/trees/birchTrees/birchTreesVisual.glb"
      referencesModelPath="./models/trees/birchTrees/birchTreesReferences.glb"
      colorA="#ff4f2b"
      colorB="#ff903f"
      {...props}
    />
  )
}

export function OakTrees(props) {
  return (
    <Trees
      name="Oak Tree"
      visualModelPath="./models/trees/oakTrees/oakTreesVisual.glb"
      referencesModelPath="./models/trees/oakTrees/oakTreesReferences.glb"
      colorA="#b4b536"
      colorB="#d8cf3b"
      {...props}
    />
  )
}

export function CherryTrees(props) {
  return (
    <Trees
      name="Cherry Tree"
      visualModelPath="./models/trees/cherryTrees/cherryTreesVisual.glb"
      referencesModelPath="./models/trees/cherryTrees/cherryTreesReferences.glb"
      colorA="#ff6d6d"
      colorB="#ff9990"
      seeThrough={true}
      {...props}
    />
  )
}
