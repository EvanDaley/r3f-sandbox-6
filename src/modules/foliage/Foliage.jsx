import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

/**
 * Foliage component for rendering instanced leaves/foliage
 * Converted from raw Three.js to React Three Fiber
 * 
 * @param {Array} references - Array of Object3D references for instance positions
 * @param {string} colorA - First color (hex string)
 * @param {string} colorB - Second color (hex string) 
 * @param {boolean} seeThrough - Enable see-through effect around camera/vehicle
 */
export default function Foliage({ references = [], colorA = '#ffffff', colorB = '#888888', seeThrough = false }) {
  const meshRef = useRef()
  const materialRef = useRef()
  const { camera } = useThree()
  
  // Load foliage texture (SDF texture for alpha)
  const foliageTexture = useTexture('./textures/foliageSDF.png')
  
  useEffect(() => {
    if (foliageTexture) {
      foliageTexture.flipY = false
    }
  }, [foliageTexture])
  
  // Create geometry with multiple planes
  const geometry = useMemo(() => {
    const count = 80
    const planes = []
    
    // Simple seeded random function
    let seed = 12345
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    
    for (let i = 0; i < count; i++) {
      const plane = new THREE.PlaneGeometry(0.8, 0.8)
      
      // Position using spherical coordinates
      const spherical = new THREE.Spherical(
        1 - Math.pow(rng(), 3),
        Math.PI * 2 * rng(),
        Math.PI * rng()
      )
      const position = new THREE.Vector3().setFromSpherical(spherical)
      
      plane.rotateZ(rng() * 9999)
      plane.rotateY(0)
      plane.translate(position.x, position.y, position.z)
      
      // Normal
      const normal = position.clone().normalize()
      const normalArray = new Float32Array(12)
      for (let j = 0; j < 4; j++) {
        const j3 = j * 3
        const pos = new THREE.Vector3(
          plane.attributes.position.array[j3],
          plane.attributes.position.array[j3 + 1],
          plane.attributes.position.array[j3 + 2]
        )
        const mixedNormal = pos.lerp(normal, 0.85)
        normalArray[j3] = mixedNormal.x
        normalArray[j3 + 1] = mixedNormal.y
        normalArray[j3 + 2] = mixedNormal.z
      }
      plane.setAttribute('normal', new THREE.BufferAttribute(normalArray, 3))
      planes.push(plane)
    }
    
    return mergeGeometries(planes)
  }, [])
  
  // Create material with custom shader for SDF texture
  const material = useMemo(() => {
    if (!foliageTexture) return null
    
    // Configure texture
    foliageTexture.flipY = false
    
    // Custom shader material matching reference implementation
    // Reference: alpha = texture.r - threshold (line 125)
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: foliageTexture },
        color: { value: new THREE.Color(colorA) },
        threshold: { value: 0.3 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform vec3 color;
        uniform float threshold;
        varying vec2 vUv;
        
        void main() {
          vec4 texColor = texture2D(map, vUv);
          // SDF is stored in red channel - match reference: alpha = texture.r - threshold
          float alpha = texColor.r - threshold;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    
    materialRef.current = mat
    return mat
  }, [colorA, colorB, foliageTexture])
  
  // Set up instanced matrices from references
  const instanceCount = references.length
  const instanceMatrices = useMemo(() => {
    if (!references.length) return null
    
    const matrices = []
    
    references.forEach((ref) => {
      const size = ref.scale?.x || ref.scale || 1
      const object = new THREE.Object3D()
      
      // Rotate randomly but facing camera
      const angle = Math.PI * 2 * Math.random()
      object.up.set(Math.sin(angle), Math.cos(angle), 0)
      
      // Get camera direction
      if (camera) {
        const cameraPos = new THREE.Vector3()
        camera.getWorldPosition(cameraPos)
        const refPos = ref.position || ref.getWorldPosition?.(new THREE.Vector3()) || new THREE.Vector3()
        const towardCamera = cameraPos.sub(refPos).normalize()
        object.lookAt(object.position.clone().add(towardCamera))
      }
      
      object.position.copy(ref.position || (ref.getWorldPosition?.(new THREE.Vector3()) || new THREE.Vector3()))
      object.scale.setScalar(size)
      object.updateMatrix()
      
      matrices.push(object.matrix.clone())
    })
    
    return matrices
  }, [references, camera])
  
  // Update instance matrices
  useEffect(() => {
    if (!meshRef.current || !instanceMatrices) return
    
    const mesh = meshRef.current
    mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage)
    
    instanceMatrices.forEach((matrix, i) => {
      mesh.setMatrixAt(i, matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [instanceMatrices])
  
  // Update material colors based on lighting (matching reference)
  useFrame((state) => {
    if (!materialRef.current || !materialRef.current.uniforms) return
    
    // Match reference: mix colors based on light direction
    // Reference uses: mixStrength = normalWorld.dot(lightDirection).smoothstep(0, 1)
    const lightDir = new THREE.Vector3(0, 1, 0.5).normalize()
    const dot = Math.max(0, Math.min(1, lightDir.y)) // Clamp like smoothstep
    const mixedColor = new THREE.Color(colorA).lerp(new THREE.Color(colorB), 1 - dot)
    materialRef.current.uniforms.color.value.copy(mixedColor)
  })
  
  if (!instanceMatrices || instanceCount === 0 || !material) return null
  
  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, instanceCount]}
      frustumCulled={false}
      receiveShadow
      castShadow
      renderOrder={1} // Render after opaque objects
    />
  )
}
