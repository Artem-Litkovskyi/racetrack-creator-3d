import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type Props = {
    vertices: number[]; // [x,y,z,x,y,z...]
    indices: number[];  // triangle indices
    width?: number;
    height?: number;
};

export function MeshPreview({ vertices, indices, width = 400, height = 300 }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const materialRef = useRef<THREE.MeshPhongMaterial | null>(null);

    const [showWireframe, setShowWireframe] = useState(true);

    useEffect(() => {
        if (!containerRef.current) return;

        const styles = getComputedStyle(containerRef.current);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(styles.getPropertyValue('--preview-background-color').trim());

        // =========================================================
        // Camera
        // =========================================================

        const camera = new THREE.PerspectiveCamera(
            45,
            width / height,
            0.01,
            10000
        );

        // =========================================================
        // Renderer
        // =========================================================

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
        });

        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);

        containerRef.current.appendChild(renderer.domElement);

        // =========================================================
        // Lights
        // =========================================================

        const ambientLight = new THREE.AmbientLight(
            styles.getPropertyValue('--preview-ambient-light-color').trim(),
            parseFloat(styles.getPropertyValue('--preview-ambient-light-intensity').trim())
        );

        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(
            styles.getPropertyValue('--preview-dir-light-color').trim(),
            parseFloat(styles.getPropertyValue('--preview-dir-light-intensity').trim())
        );

        dirLight.position.set(10, 20, 10);
        scene.add(dirLight);

        // =========================================================
        // Geometry
        // =========================================================

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(vertices, 3)
        );

        geometry.setIndex(indices);

        geometry.computeVertexNormals();

        geometry.computeBoundingBox();
        const bbox = geometry.boundingBox!;

        const center = new THREE.Vector3();
        bbox.getCenter(center);
        geometry.translate(
            -center.x,
            -center.y,
            -center.z
        );

        const material = new THREE.MeshPhongMaterial({
            color: styles.getPropertyValue('--preview-mesh-color').trim(),
            wireframe: showWireframe,
        });

        materialRef.current = material;

        const mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);

        // =========================================================
        // Fit camera to curve bounds
        // =========================================================

        const size = new THREE.Vector2(
            bbox.max.x - bbox.min.x,
            bbox.max.z - bbox.min.z
        );

        const diagonal = size.length();

        const fovHorizontalRad = camera.fov * camera.aspect * (Math.PI / 180);
        const distance = diagonal / (2 * Math.tan(fovHorizontalRad / 2));

        camera.position.set(
            0,
            distance * 0.75,
            distance
        );

        camera.lookAt(0, 0, distance * 0.07);

        // =========================================================
        // Animation
        // =========================================================

        let animationFrameId = 0;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            mesh.rotation.y += 0.003;

            renderer.render(scene, camera);
        };

        animate();

        // =========================================================
        // Cleanup
        // =========================================================

        return () => {
            cancelAnimationFrame(animationFrameId);

            geometry.dispose();
            material.dispose();

            renderer.dispose();

            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(
                    renderer.domElement
                );
            }
        };
    }, [
        vertices,
        indices,
        width,
        height
    ]);

    useEffect(() => {
        if (!materialRef.current) return;
        materialRef.current.wireframe = showWireframe;
    }, [showWireframe]);

    return (
        <div
            ref={containerRef}
            className='mesh-preview'
            style={{
                width,
                height,
            }}
        >
            <span>3D Preview</span>
            <div className='show-wireframe'>
                <input
                    type='checkbox'
                    id='show-wireframe'
                    name='show-wireframe'
                    checked={showWireframe}
                    onChange={(e) => setShowWireframe(e.target.checked)}
                />

                <label htmlFor='show-wireframe'>
                    show wireframe
                </label>
            </div>
        </div>
    );
}