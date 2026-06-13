// ════════════════════════════════════════════════════════════════
//  Interactive 3D hero — a "living cluster" of glowing nodes/pods.
//  Three.js (CDN). Degrades gracefully if WebGL/CDN unavailable.
// ════════════════════════════════════════════════════════════════
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("hero3d");
if (canvas) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  try {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 2.6, 9);
    camera.lookAt(0, 0, 0);

    // lights
    scene.add(new THREE.AmbientLight(0x6677aa, 0.7));
    const key = new THREE.PointLight(0x22d3ee, 80, 50);
    key.position.set(6, 8, 6);
    scene.add(key);
    const fill = new THREE.PointLight(0x6366f1, 60, 50);
    fill.position.set(-7, -3, 4);
    scene.add(fill);

    // grid of cubes (the "cluster")
    const GRID = window.innerWidth < 600 ? 7 : 10;
    const GAP = 0.62;
    const count = GRID * GRID;
    const geo = new THREE.BoxGeometry(0.34, 0.34, 0.34);
    const mat = new THREE.MeshStandardMaterial({ metalness: 0.4, roughness: 0.25, emissiveIntensity: 0.6 });
    const mesh = new THREE.InstancedMesh(geo, mat, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const dummy = new THREE.Object3D();
    const colorA = new THREE.Color(0x6366f1); // indigo
    const colorB = new THREE.Color(0x22d3ee); // cyan
    const tmp = new THREE.Color();
    const half = (GRID - 1) / 2;
    const cells = [];

    let i = 0;
    for (let x = 0; x < GRID; x++) {
      for (let z = 0; z < GRID; z++) {
        const px = (x - half) * GAP;
        const pz = (z - half) * GAP;
        cells.push({ px, pz, phase: (x + z) * 0.35 });
        const t = (x + z) / (2 * (GRID - 1));
        tmp.copy(colorA).lerp(colorB, t);
        mesh.setColorAt(i, tmp);
        i++;
      }
    }
    mat.emissive = new THREE.Color(0x12203a);

    const group = new THREE.Group();
    group.add(mesh);
    scene.add(group);
    group.rotation.x = -0.5;
    group.rotation.y = 0.5;

    // mouse parallax
    let targetRX = -0.5, targetRY = 0.5;
    window.addEventListener("pointermove", (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetRY = 0.5 + nx * 0.5;
      targetRX = -0.5 + ny * 0.3;
    });

    function resize() {
      const w = canvas.clientWidth || canvas.parentElement.clientWidth;
      const h = canvas.clientHeight || canvas.parentElement.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    function setMatrices(time) {
      for (let k = 0; k < count; k++) {
        const c = cells[k];
        const y = Math.sin(time * 1.4 + c.phase) * 0.32;
        const s = 0.85 + (Math.sin(time * 1.4 + c.phase) + 1) * 0.18;
        dummy.position.set(c.px, y, c.pz);
        dummy.scale.set(s, s, s);
        dummy.rotation.set(0, time * 0.2 + c.phase, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(k, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    const clock = new THREE.Clock();
    function animate() {
      const time = reduceMotion ? 0.5 : clock.getElapsedTime();
      setMatrices(time);
      group.rotation.x += (targetRX - group.rotation.x) * 0.05;
      group.rotation.y += (targetRY - group.rotation.y) * 0.05;
      renderer.render(scene, camera);
      if (!reduceMotion) requestAnimationFrame(animate);
    }

    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    animate();
    if (reduceMotion) { setMatrices(0.5); renderer.render(scene, camera); }
  } catch (err) {
    // WebGL unavailable — leave the gradient hero as-is
    canvas.style.display = "none";
  }
}
