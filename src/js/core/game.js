import { Renderer } from './renderer.js';
import { World } from './world.js';
import { Player } from '../entities/player.js';
import { NPC } from '../entities/npc.js';
import { UIManager } from '../ui/ui-manager.js';

export class Game {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.renderer = new Renderer();
        this.world = new World(this.renderer.scene);
        this.player = new Player(this.renderer.scene);
        this.npcs = [];
        this.uiManager = new UIManager();
        
        // Buat game instance global untuk akses mudah (untuk demo)
        window.game = this;

        this.initNPCs();
    }

    initNPCs() {
        // Buat beberapa NPC di posisi berbeda
        this.npcs.push(new NPC(this.renderer.scene, 'goblin_01', new THREE.Vector3(-5, 0, -5), this.apiKey, this.uiManager));
        this.npcs.push(new NPC(this.renderer.scene, 'goblin_02', new THREE.Vector3(5, 0, -8), this.apiKey, this.uiManager));
        this.npcs.push(new NPC(this.renderer.scene, 'skeleton_01', new THREE.Vector3(0, 0, -10), this.apiKey, this.uiManager));
    }

    start() {
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update entitas
        this.player.update();
        this.npcs.forEach(npc => npc.update());
        
        // Update UI (contoh: health bar statis)
        this.uiManager.updatePlayerHealth((this.player.health / this.player.maxHealth) * 100);

        // Render scene
        this.renderer.render();
    }
}
