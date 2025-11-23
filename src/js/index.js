import '../assets/css/input.css';
import 'animate.css';

import $ from 'jquery';
window.jQuery = $;

import * as THREE from 'three';

import { Game } from './core/game.js';
import { UIManager } from './ui/ui-manager.js';

 $(document).ready(() => {
    const uiManager = new UIManager();
    uiManager.showApiKeyModal();

    $('#start-game-btn').on('click', () => {
        const apiKey = $('#api-key-input').val();
        if (!apiKey) {
            alert('API Key tidak boleh kosong!');
            return;
        }
        uiManager.hideApiKeyModal();
        uiManager.showGameUI();
        
        const game = new Game(apiKey);
        game.start();
    });
});
