'use strict';

(function () {
  // var MAX_USERS_PHOTOS = 25;
  var usersPhotoTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var filter = document.querySelector('.img-filters');
  var fragment = document.createDocumentFragment();

  // var renderUsersPhotos = function () {
  //   window.data.getUsersPhotosData();
  //   for (var i = 0; i < window.data.usersPhotosData.length; i++) {
  //     var userPhoto = usersPhotoTemplate.cloneNode(true);

  //     userPhoto.querySelector('.picture__img').setAttribute('src', window.data.usersPhotosData[i].url);
  //     userPhoto.querySelector('.picture__likes').textContent = window.data.usersPhotosData[i].likes;
  //     userPhoto.querySelector('.picture__comments').textContent = window.data.usersPhotosData[i].comments.length;
  //     userPhoto.setAttribute('data-id', i);

  //     fragment.appendChild(userPhoto);
  //   }
  //   document.querySelector('.pictures').appendChild(fragment);
  // };

  // renderUsersPhotos();

  var setPhotoID = function (servData) {
    servData.forEach(function (it, index) {
      it.id = index;
    });
  };

  window.renderUsersPhotos = function (photos) {
    // window.data.getUsersPhotosData();
    for (var i = 0; i < photos.length; i++) {
      var userPhoto = usersPhotoTemplate.cloneNode(true);

      userPhoto.querySelector('.picture__img').setAttribute('src', photos[i].url);
      userPhoto.querySelector('.picture__likes').textContent = photos[i].likes;
      userPhoto.querySelector('.picture__comments').textContent = photos[i].comments.length;
      userPhoto.setAttribute('data-id', photos[i].id);

      fragment.appendChild(userPhoto);
    }
    document.querySelector('.pictures').appendChild(fragment);
  };

  var onSucces = function (data) {
    window.servData = data.slice();
    setPhotoID(window.servData);
    window.renderUsersPhotos(window.servData);
    filter.classList.remove('img-filters--inactive');
  };

  var onError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.load(onSucces, onError);
})();
