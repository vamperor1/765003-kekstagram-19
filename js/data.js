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

  var LIKES_AMOUNT = {
    MIN: 15,
    MAX: 200,
  };

  var COMMENTS_AMOUNT = {
    MIN: 0,
    MAX: 3,
  };

  var COMMENTS_AUTHORS = ['Вася', 'Петя', 'Коля', 'Таня', 'Юля', 'Наташа'];
  var USER_PHOTOS_AMOUNT = 25;
  var usersPhotosData = [];

  var getUserPhotoData = function (i) {
    var userPhotoData = {
      url: 'photos/' + i + '.jpg',
      description: 'Описание фотографии',
      likes: window.util.getRandomInRange(LIKES_AMOUNT.MIN, LIKES_AMOUNT.MAX),
      comments: [],
    };

    for (var j = 0; j < window.util.getRandomInRange(COMMENTS_AMOUNT.MIN, COMMENTS_AMOUNT.MAX); j++) {
      var comment = {
        avatar: 'img/avatar-' + window.util.getRandomInRange(1, 6) + '.svg',
        message: MESSAGE_EXAMPLES[window.util.getRandomInRange(0, MESSAGE_EXAMPLES.length - 1)],
        name: COMMENTS_AUTHORS[window.util.getRandomInRange(0, COMMENTS_AUTHORS.length - 1)],
      };
      userPhotoData.comments.push(comment);
    }
    usersPhotosData.push(userPhotoData);
  };

  var getUsersPhotosData = function () {
    for (var i = 1; i <= USER_PHOTOS_AMOUNT; i++) {
      getUserPhotoData(i);
    }
  };

  window.data = {
    usersPhotosData: usersPhotosData,
    getUsersPhotosData: getUsersPhotosData,
  };
})();
