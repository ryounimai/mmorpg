import * as THREE from 'three';

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.health = 100;
        this.maxHealth = 100;
        
        const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0.5, 0);
        this.mesh.castShadow = true;
        this.scene.add(this.mesh);

        this.setupControls();
    }

    setupControls() {
        this.moveSpeed = 0.2;
        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    update() {
        const forward = new THREE.Vector3();
        this.mesh.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, this.mesh.up);

        if (this.keys['KeyW']) this.mesh.position.addScaledVector(forward, this.moveSpeed);
        if (this.keys['KeyS']) this.mesh.position.addScaledVector(forward, -this.moveSpeed);
        if (this.keys['KeyA']) this.mesh.position.addScaledVector(right, -this.moveSpeed);
        if (this.keys['KeyD']) this.mesh.position.addScaledVector(right, this.moveSpeed);
        
        // Simple camera follow
        const cameraTarget = new THREE.Vector3();
        cameraTarget.copy(this.mesh.position);
        cameraTarget.y += 8;
        cameraTarget.z += 15;
        
        window.game.renderer.camera.position.lerp(cameraTarget, 0.05);
        window.game.renderer.camera.lookAt(this.mesh.position);
    }
}