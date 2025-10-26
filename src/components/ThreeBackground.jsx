import React, { useState, useEffect } from 'react'

export default function ThreeBackground(){
  const [Loaded, setLoaded] = useState(null)
  useEffect(()=>{
    let mounted = true
    ;(async ()=>{
      try{
        const r3f = await import('@react-three/fiber')
        const drei = await import('@react-three/drei')
        if(!mounted) return
        const Canvas = r3f.Canvas
        const { MeshDistortMaterial, Sphere } = drei
        const Comp = ()=> (
          <Canvas className="absolute inset-0 z-0">
            <ambientLight intensity={0.6} />
            <pointLight position={[10,10,10]} />
            <Sphere args={[3,64,64]} scale={2}>
              <MeshDistortMaterial color="#05fbd7" attach="material" distort={0.6} speed={1.2} />
            </Sphere>
          </Canvas>
        )
        setLoaded(()=>Comp)
      }catch(e){ setLoaded(()=>null) }
    })()
    return ()=>{ mounted=false }
  },[])
  return Loaded ? <Loaded/> : <div className="absolute inset-0 z-0 bg-cosmic" />
}
