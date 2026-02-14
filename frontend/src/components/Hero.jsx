import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import "./Hero.css";
import { useNavigate } from "react-router-dom";


function Hero() {
  const mountRef = useRef(null);
  const sceneRef = useRef();
  const rendererRef = useRef();
  const composerRef = useRef();
  const particlesRef = useRef();
  const chartRef = useRef();

  const navigate = useNavigate();   // ✅ correct place

  
  const [pieRotation, setPieRotation] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    

    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const composer = new EffectComposer(renderer);
    composerRef.current = composer;

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.0, 0.4, 0.85
    );
    composer.addPass(bloomPass);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 12000;
    const posArray = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      posArray[i3] = (Math.random() - 0.5) * 35;
      posArray[i3 + 1] = (Math.random() - 0.5) * 35;
      posArray[i3 + 2] = (Math.random() - 0.5) * 35;
      
      velocities[i3] = (Math.random() - 0.5) * 0.012;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.012;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.012;
      
      sizes[i] = Math.random() * 0.02 + 0.006;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.016,
      color: 0x44d8ff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particleMaterial);
    particlesRef.current = particlesMesh;
    scene.add(particlesMesh);

    let time = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      const positions = particlesMesh.geometry.attributes.position.array;
      const velocitiesArray = particlesMesh.geometry.attributes.velocity.array;
      
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        positions[i3] += velocitiesArray[i3];
        positions[i3 + 1] += velocitiesArray[i3 + 1];
        positions[i3 + 2] += velocitiesArray[i3 + 2];
        
        if (Math.abs(positions[i3]) > 18) velocitiesArray[i3] *= -0.92;
        if (Math.abs(positions[i3 + 1]) > 18) velocitiesArray[i3 + 1] *= -0.92;
        if (Math.abs(positions[i3 + 2]) > 18) velocitiesArray[i3 + 2] *= -0.92;
        
        positions[i3 + 1] += Math.sin(time * 2 + i * 0.01) * 0.004;
      }
      
      particlesMesh.geometry.attributes.position.needsUpdate = true;
      particlesMesh.rotation.y += 0.0005;
      
      setPieRotation((prev) => (prev + 0.004) % (Math.PI * 2));
      
      composer.render();
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <section className="hero">
      <div className="three-canvas" ref={mountRef}></div>
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>

      <motion.div 
        className="hero-content"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="badge">🚀 AI-Powered Burnout Prevention</div>
        
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          <span className="gradient-text">AI Burnout</span>
          <br />
          <span className="title-stroke">Risk Analyzer</span>
        </motion.h1>

        <motion.p 
          className="hero-subtext"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
        >
          Enterprise-grade ML platform predicting employee burnout with 98.7% accuracy 
          using behavioral analytics, risk modeling & real-time insights.
        </motion.p>

        <motion.div 
          className="cta-buttons"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
        <motion.button 
  className="hero-btn primary"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => navigate("/analysis")}
>
  Start Free Analysis
</motion.button>

        </motion.div>
      </motion.div>

      <motion.div 
        className="chart-container"
        initial={{ opacity: 0, scale: 0.8, x: 60 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <div className="donut-chart" style={{ transform: `rotate(${pieRotation}rad)` }}>
          {/* SATURN RINGS - SMOKY DUST WINGS */}
          <div className="saturn-ring ring-1"></div>
          <div className="saturn-ring ring-2"></div>
          <div className="saturn-ring ring-3"></div>
          
          <div className="pie-circle"></div>

          <div className="pie-label workload">Workload</div>
          <div className="pie-label deadlines">Deadlines</div>
          <div className="pie-label management">Management</div>
          <div className="pie-label worklife">Work-Life</div>

          <div className="chart-center">
            <div className="center-glow"></div>
            <span>AI</span>
            <div className="center-label">Stress Model</div>
          </div>
        </div>
      </motion.div>

      <motion.div 

      >
        <span></span>
      </motion.div>
    </section>
  );
}

export default Hero;
