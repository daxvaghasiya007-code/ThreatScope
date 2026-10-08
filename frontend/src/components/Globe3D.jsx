import React, { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";

// 1. HELPER: CONVERT LAT/LON TO 3D POSITION
const calcPosFromLatLonRad = (lat, lon, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
};

// 2. LOADING COMPONENT
const Loader = () => (
    <Html center>
        <div className="flex items-center gap-2 bg-black/90 px-4 py-2 rounded border border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.4)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">Initializing Globe...</span>
        </div>
    </Html>
);

// 3. SINGLE TARGET MARKER WITH REVERSE GEOCODING
const TargetMarker = ({ targetLoc }) => {
    const [locationName, setLocationName] = useState("Locating...");

    // Dynamically fetch accurate real-world name if parent only passed lat/lon
    useEffect(() => {
        let isMounted = true;
        if (!targetLoc) return;

        // 1. Prioritize pre-defined names if they exist
        const providedName = targetLoc.city || targetLoc.location || targetLoc.region || targetLoc.country || targetLoc.name;
        if (providedName) {
            setLocationName(providedName);
            return;
        }

        // 2. If only coordinates exist, reverse geocode to get actual worldwide city/state
        if (targetLoc.lat !== undefined && targetLoc.lon !== undefined) {
            setLocationName("Scanning Coordinates...");
            
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${targetLoc.lat}&lon=${targetLoc.lon}&zoom=10`)
                .then(res => res.json())
                .then(data => {
                    if (isMounted && data && data.address) {
                        const accurateName = data.address.city || data.address.town || data.address.state || data.address.country || "Secure Target";
                        setLocationName(accurateName);
                    } else if (isMounted) {
                        setLocationName("Secure Target");
                    }
                })
                .catch(() => {
                    if (isMounted) setLocationName("Secure Target");
                });
        }

        return () => { isMounted = false; };
    }, [targetLoc]);

    const pos = useMemo(() => {
        if (!targetLoc || targetLoc.lat === undefined || targetLoc.lon === undefined) return null;
        return calcPosFromLatLonRad(targetLoc.lat, targetLoc.lon, 2.52);
    }, [targetLoc]);

    const glowRef = useRef();

    useFrame(({ clock }) => {
        if (glowRef.current) {
            const scale = 1 + Math.sin(clock.elapsedTime * 4) * 0.2;
            glowRef.current.scale.set(scale, scale, scale);
        }
    });

    if (!pos) return null;

    return (
        <group position={pos}>
            {/* Core Pin */}
            <mesh>
                <sphereGeometry args={[0.025, 16, 16]} />
                <meshBasicMaterial color="#00ffff" />
            </mesh>

            {/* Pulsing Aura */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.4} />
            </mesh>

            {/* Stylized UI Label */}
            <Html center style={{ pointerEvents: "none" }}>
                <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(0, 255, 255, 0.5)',
                    backdropFilter: 'blur(6px)',
                    color: '#00ffff',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginTop: '28px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 0 10px rgba(0,255,255,0.2)'
                }}>
                    {locationName}
                </div>
            </Html>
        </group>
    );
};

// 4. EARTH MESH & ROTATION LOGIC
const Earth = ({ targetLoc }) => {
    const earthRef = useRef();

    // High-Res Textures
    const [colorMap, normalMap, specularMap] = useLoader(TextureLoader, [
        "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg",
        "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg",
        "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg"
    ]);

    // Smooth Camera Rotation to target coordinates
    useFrame(() => {
        if (!earthRef.current) return;

        if (targetLoc && targetLoc.lat !== undefined && targetLoc.lon !== undefined) {
            const targetLonRad = targetLoc.lon * (Math.PI / 180);
            const targetLatRad = targetLoc.lat * (Math.PI / 180);

            const desiredY = -targetLonRad - Math.PI / 2;
            const desiredX = targetLatRad;

            // Lerp towards the target
            earthRef.current.rotation.y += (desiredY - earthRef.current.rotation.y) * 0.05;
            earthRef.current.rotation.x += (desiredX - earthRef.current.rotation.x) * 0.05;
        } else {
            // Idle Spin if no target
            earthRef.current.rotation.y += 0.0015;
        }
    });

    return (
        <group ref={earthRef}>
            {/* Base Earth Sphere */}
            <mesh>
                <sphereGeometry args={[2.5, 64, 64]} />
                <meshPhongMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    specularMap={specularMap}
                    specular={new THREE.Color(0x333333)}
                    shininess={15}
                />
            </mesh>

            {/* Renders one marker for the searched location */}
            <TargetMarker targetLoc={targetLoc} />
        </group>
    );
};

// 5. MAIN WRAPPER
export default function Globe3D({ targetLoc }) {
    return (
        <div className="h-full w-full absolute inset-0 z-0 bg-black overflow-hidden select-none">
            <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }}>
                <ambientLight intensity={1.2} />
                <pointLight position={[20, 10, 10]} intensity={5.0} />
                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

                <Suspense fallback={<Loader />}>
                    <Earth targetLoc={targetLoc} />
                </Suspense>

                <OrbitControls
                    enableZoom={true}       
                    enablePan={false}
                    enableRotate={false}    
                    autoRotate={false}
                    minDistance={3}
                    maxDistance={9}
                />
            </Canvas>
        </div>
    );
}