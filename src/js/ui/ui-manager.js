import $ from 'jquery';

export class UIManager {
    showApiKeyModal() {
        $('#api-key-modal').removeClass('hidden');
    }

    hideApiKeyModal() {
        $('#api-key-modal').addClass('hidden');
    }

    showGameUI() {
        $('#game-ui').removeClass('hidden');
    }

    updatePlayerHealth(percentage) {
        $('#player-health-bar').css('width', `${percentage}%`);
        if (percentage > 60) {
            $('#player-health-bar').removeClass('bg-yellow-500 bg-red-500').addClass('bg-green-500');
        } else if (percentage > 30) {
            $('#player-health-bar').removeClass('bg-green-500 bg-red-500').addClass('bg-yellow-500');
        } else {
            $('#player-health-bar').removeClass('bg-green-500 bg-yellow-500').addClass('bg-red-500');
        }
    }

    updateNPCStatus(statusText) {
        $('#npc-status').text(statusText);
    }
}
