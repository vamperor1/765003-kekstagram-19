'use strict';

(function () {
  var MESSAGE_EXAMPLES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
  ];
  var COMMENTS_AUTHORS = ['Вася', 'Петя', 'Коля', 'Таня', 'Юля', 'Наташа'];
  var USER_PHOTOS_AMOUNT = 25;
  // var usersPhotosData = [];
  var usersPhotoTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var fragment = document.createDocumentFragment();
  window.data = {
    usersPhotosData: [],
  };

  var getUserPhotoData = function (i) {
    var userPhotoData = {
      url: 'photos/' + i + '.jpg',
      description: 'Описание фотографии',
      likes: window.util.getRandomInRange(15, 200),
      comments: [],
    };

    for (var j = 0; j < window.util.getRandomInRange(1, 3); j++) {
      var comment = {
        avatar: 'img/avatar-' + window.util.getRandomInRange(1, 6) + '.svg',
        message: MESSAGE_EXAMPLES[window.util.getRandomInRange(0, MESSAGE_EXAMPLES.length - 1)],
        name: COMMENTS_AUTHORS[window.util.getRandomInRange(0, COMMENTS_AUTHORS.length - 1)],
      };
      userPhotoData.comments.push(comment);
    }
    window.data.usersPhotosData.push(userPhotoData);
  };

  var getUsersPhotosData = function () {
    for (var i = 1; i <= USER_PHOTOS_AMOUNT; i++) {
      getUserPhotoData(i);
    }
  };

  var renderUsersPhotos = function () {
    getUsersPhotosData();
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
