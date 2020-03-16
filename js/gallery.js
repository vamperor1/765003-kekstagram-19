'use strict';

(function () {
  var usersPhotoTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var fragment = document.createDocumentFragment();

  var renderUsersPhotos = function () {
    window.data.getUsersPhotosData();
    for (var i = 0; i < window.data.usersPhotosData.length; i++) {
      var userPhoto = usersPhotoTemplate.cloneNode(true);

      userPhoto.querySelector('.picture__img').setAttribute('src', window.data.usersPhotosData[i].url);
      userPhoto.querySelector('.picture__likes').textContent = window.data.usersPhotosData[i].likes;
      userPhoto.querySelector('.picture__comments').textContent = window.data.usersPhotosData[i].comments.length;
      userPhoto.setAttribute('data-id', i);

      fragment.appendChild(userPhoto);
    }
    document.querySelector('.pictures').appendChild(fragment);
  };

  renderUsersPhotos();
})();
