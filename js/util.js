'use strict';
(function () {
  window.util = {
    ESC_KEY: 'Escape',
    ENTER_KEY: 'Enter',
    getRandomInRange: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
  };
})();
