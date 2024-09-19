import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import '../../Style/SolarSystem.css'; // Ensure this file contains appropriate styles

const SolarSystem: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const controls = new OrbitControls(camera, renderer.domElement);

    // Load and set the background image
    const loader = new THREE.TextureLoader();
    const backgroundTexture = loader.load('path_to_generated_image.png'); // Replace with the actual path to the generated image
    scene.background = backgroundTexture;

    // Adding stars in the background
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    const starVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = THREE.MathUtils.randFloatSpread(200);
      const y = THREE.MathUtils.randFloatSpread(200);
      const z = THREE.MathUtils.randFloatSpread(200);
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Sun
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Planets and Orbits
    const planetGeometries = [
      { size: 1, color: 0xaaaaaa, distance: 8 },
      { size: 1.2, color: 0xff5733, distance: 12 },
      { size: 1.5, color: 0x0080ff, distance: 16 },
      { size: 1.3, color: 0xa52a2a, distance: 20 },
      { size: 2.5, color: 0xffa500, distance: 25 },
      { size: 2.2, color: 0xf0e68c, distance: 30 },
      { size: 1.8, color: 0xadd8e6, distance: 35 },
      { size: 1.7, color: 0xee82ee, distance: 40 },
    ];

    const planets = planetGeometries.map(({ size, color, distance }) => {
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.x = distance;
      scene.add(planet);

      // Create Orbit
      const orbitGeometry = new THREE.RingGeometry(distance - 0.05, distance + 0.1, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);

      return { planet, distance };
    });

    // Shooting Stars (Modified Asteroid Belt)
    const asteroidGroup = new THREE.Group();
    for (let i = 0; i < 100; i++) {
      const asteroidGeometry = new THREE.SphereGeometry(0.2, 12, 12);
      const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
      const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
      asteroid.position.set(
        THREE.MathUtils.randFloatSpread(50),
        THREE.MathUtils.randFloatSpread(50),
        THREE.MathUtils.randFloatSpread(50),
      );
      asteroid.velocity = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(0.2),
        THREE.MathUtils.randFloatSpread(0.2),
        THREE.MathUtils.randFloatSpread(0.2)
      );
      asteroidGroup.add(asteroid);
    }
    scene.add(asteroidGroup);

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the sun
      sun.rotation.y += 0.005;

      // Rotate planets around the sun
      planets.forEach(({ planet, distance }, index) => {
        const angle = Date.now() * 0.001 + index;
        planet.position.x = Math.cos(angle) * distance;
        planet.position.z = Math.sin(angle) * distance;
      });

      // Update shooting stars
      asteroidGroup.children.forEach((asteroid: any) => {
        asteroid.position.add(asteroid.velocity);
        // Reset position if it goes out of bounds to simulate shooting effect
        if (Math.abs(asteroid.position.x) > 50 || Math.abs(asteroid.position.y) > 50 || Math.abs(asteroid.position.z) > 50) {
          asteroid.position.set(
            THREE.MathUtils.randFloatSpread(50),
            THREE.MathUtils.randFloatSpread(50),
            THREE.MathUtils.randFloatSpread(50),
          );
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="SolarSystem"></div>;
};

export default SolarSystem;
