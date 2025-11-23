import * as THREE from 'three';
import { AIController } from '../ai/ai-controller.js';

export class NPC {
    constructor(scene, id, position, apiKey, uiManager) {
        this.scene = scene;
        this.id = id;
        this.apiKey = apiKey;
        this.uiManager = uiManager;

        this.health = 100;
        this.maxHealth = 100;
        this.isThinking = false;
        this.lastDecisionTime = 0;
        this.decisionInterval = 3000; // 3 detik

        // Visual representation
        const geometry = new THREE.ConeGeometry(0.5, 1.5, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0xff4500 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.mesh.position.y = 0.75; // Setengah tinggi cone
        this.mesh.castShadow = true;
        this.scene.add(this.mesh);

        this.aiController = new AIController(this.apiKey);
    }

    async update() {
        const now = Date.now();
        if (!this.isThinking && now - this.lastDecisionTime > this.decisionInterval) {
            this.isThinking = true;
            this.uiManager.updateNPCStatus(`NPC ${this.id}: Berpikir...`);
            
            const gameState = this.getGameState();
            const action = await this.aiController.getAction(gameState);
            
            this.executeAction(action);
            this.lastDecisionTime = now;
            this.isThinking = false;
        }
    }

    getGameState() {
        // NOTE: Dalam aplikasi nyata, Anda akan mengumpulkan data dinamis.
        // Ini adalah contoh statis untuk demonstrasi.
        const playerPos = window.game.player.mesh.position;
        return {
            npc: { id: this.id, position: this.mesh.position, health: this.health },
            player: { position: playerPos, health: window.game.player.health },
            environment: { timeOfDay: 'day', weather: 'clear' }
        };
    }

    executeAction(action) {
        console.log(`NPC ${this.id} menerima aksi:`, action);
        this.uiManager.updateNPCStatus(`NPC ${this.id}: Aksi -> ${action.action}`);
        
        switch (action.action) {
            case 'MOVE_TO':
                this.moveTo(action.destination);
                break;
            case 'ATTACK':
                this.attack(action.targetId);
                break;
            case 'IDLE':
                this.playIdleAnimation();
                break;
            default:
                console.warn(`Aksi tidak dikenal: ${action.action}`);
        }
    }
    
    moveTo(destination) {
        // Gunakan Anime.js untuk animasi pergerakan yang halus
        anime({
            targets: this.mesh.position,
            x: destination.x,
            y: destination.y,
            z: destination.z,
            duration: 2000,
            easing: 'easeInOutQuad'
        });
    }

    attack(targetId) {
        // Logika serangan sederhana: berputar dan bergerak maju
        anime({
            targets: this.mesh.rotation,
            y: '+=6.28', // 360 derajat
            duration: 500,
            easing: 'easeOutSine',
            complete: () => {
                // Reset rotasi
                this.mesh.rotation.y = 0;
            }
        });
    }

    playIdleAnimation() {
        anime({
            targets: this.mesh.scale,
            y: [1, 1.1, 1],
            duration: 1000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
        });
    }
}
