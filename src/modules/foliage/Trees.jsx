import { useRef, useMemo, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import Foliage from './Foliage.jsx'

/**
 * Trees component for rendering instanced trees
 * Converted from raw Three.js to React Three Fiber
 * 
 * @param {string} name - Name of tree type (for debugging)
 * @param {string} visualModelPath - Path to visual GLB model
 * @param {string} referencesModelPath - Path to references GLB model  
 * @param {string} colorA - First color for leaves (hex string)
 * @param {string} colorB - Second color for leaves (hex string)
 * @param {boolean} seeThrough - Enable see-through effect for leaves
 */
export default function Trees({
  name = 'Tree',
  visualModelPath,
  referencesModelPath,
  colorA = '#ffffff',
  colorB = '#888888',
  seeThrough = false
}) {
  const bodiesRef = useRef()
  
  // Load models (KTX2 loader is configured globally in index.jsx)
  const visualModel = useGLTF(visualModelPath)
  const referencesModel = useGLTF(referencesModelPath)
  
  // Extract model parts (leaves and body)
  const modelParts = useMemo(() => {
    const parts = {
      leaves: [],
      body: null
    }
    
    if (!visualModel?.scene) {
      console.warn(`[Trees ${name}] Visual model not loaded:`, visualModelPath)
      return parts
    }
    
    visualModel.scene.traverse((child) => {
      if (child.isMesh) {
        if (child.name.startsWith('treeLeaves')) {
          parts.leaves.push(child)
        } else if (child.name.startsWith('treeBody')) {
          parts.body = child
        }
      }
    })
    
    if (!parts.body) {
      console.warn(`[Trees ${name}] No treeBody mesh found in visual model`)
    }
    if (parts.leaves.length === 0) {
      console.warn(`[Trees ${name}] No treeLeaves meshes found in visual model`)
    }
    
    return parts
  }, [visualModel, name, visualModelPath])
  
  // Get references from references model - match reference implementation
  const references = useMemo(() => {
    if (!referencesModel?.scene) {
      console.warn(`[Trees ${name}] References model not loaded:`, referencesModelPath)
      return []
    }
    
    // Match reference: use scene.children directly (line 22: this.references = references)
    // The references are passed as scene.children from World.js line 69-71
    const refs = []
    
    // Update scene matrix world first
    referencesModel.scene.updateMatrixWorld(true)
    
    // Get direct children (not all descendants)
    referencesModel.scene.children.forEach((child) => {
      if (child.isObject3D) {
        // Update matrices
        child.updateMatrix()
        child.updateMatrixWorld(true)
        refs.push(child)
      }
    })
    
    if (refs.length === 0) {
      console.warn(`[Trees ${name}] No reference objects found in references model`)
    } else {
      console.log(`[Trees ${name}] Found ${refs.length} tree references`)
    }
    
    return refs
  }, [referencesModel, name, referencesModelPath])
  
  // Set up instanced mesh for tree bodies
  const bodyGeometry = useMemo(() => {
    if (!modelParts.body) return null
    return modelParts.body.geometry
  }, [modelParts.body])
  
  const bodyMaterial = useMemo(() => {
    if (!modelParts.body) return null
    
    // Clone the material from the body mesh
    const originalMat = modelParts.body.material
    if (Array.isArray(originalMat)) {
      return originalMat[0].clone()
    }
    return originalMat.clone()
  }, [modelParts.body])
  
  // Set up instance matrices for bodies - match reference line 61
  useEffect(() => {
    if (!bodiesRef.current || !references.length || !bodyGeometry || !bodyMaterial) return
    
    const mesh = bodiesRef.current
    mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage)
    
    // Match reference: use ref.matrix (not matrixWorld) for bodies
    references.forEach((ref, i) => {
      // Ensure matrix is updated
      ref.updateMatrix()
      mesh.setMatrixAt(i, ref.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [references, bodyGeometry, bodyMaterial])
  
  // Create foliage references (combining tree references with leaf meshes)
  const foliageReferences = useMemo(() => {
    if (!references.length || !modelParts.leaves.length) return []
    
    const foliageRefs = []
    
    references.forEach((treeRef) => {
      // Ensure matrixWorld is updated
      if (treeRef.parent) {
        treeRef.parent.updateMatrixWorld(true)
      }
      treeRef.updateMatrixWorld(true)
      
      modelParts.leaves.forEach((leaves) => {
        // Update leaf matrix world
        if (leaves.parent) {
          leaves.parent.updateMatrixWorld(true)
        }
        leaves.updateMatrixWorld(true)
        
        const finalMatrix = leaves.matrixWorld.clone().premultiply(treeRef.matrixWorld)
        const reference = new THREE.Object3D()
        reference.applyMatrix4(finalMatrix)
        foliageRefs.push(reference)
      })
    })
    
    return foliageRefs
  }, [references, modelParts.leaves])
  
  if (!bodyGeometry || !bodyMaterial || !references.length) {
    return null
  }
  
  return (
    <group>
      {/* Instanced tree bodies */}
      <instancedMesh
        ref={bodiesRef}
        args={[bodyGeometry, bodyMaterial, references.length]}
        castShadow
        receiveShadow
      />
      
      {/* Foliage (leaves) */}
      {foliageReferences.length > 0 && (
        <Foliage
          references={foliageReferences}
          colorA={colorA}
          colorB={colorB}
          seeThrough={seeThrough}
        />
      )}
    </group>
  )
}
