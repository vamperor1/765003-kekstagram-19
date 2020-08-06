'use strict';

(function () {
  var URL = 'https://javascript.pages.academy/kekstagram';
  var StatusCode = {
    OK: 200
  };

  window.upload = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });

    xhr.open('POST', URL);
    xhr.send(data);
  };
})();
