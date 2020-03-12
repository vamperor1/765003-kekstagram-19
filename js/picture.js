'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCloseBtn = bigPicture.querySelector('.big-picture__cancel');
  var commentsList = bigPicture.querySelector('.social__comments');
  var fragment = document.createDocumentFragment();
  var picturesContainer = document.querySelector('.pictures');
  var body = document.querySelector('body');

  var renderComments = function (pictureID) {
    var commentsAmount = window.data.usersPhotosData[pictureID].comments.length;
    if (commentsAmount) {
      for (var i = 0; i < commentsAmount; i++) {
        var comment = bigPicture.querySelector('.social__comment').cloneNode(true);
        var commentAuthor = comment.querySelector('.social__comment .social__picture');
        var commentText = comment.querySelector('.social__text');
        commentAuthor.setAttribute('src', window.data.usersPhotosData[pictureID].comments[i].avatar);
        commentAuthor.setAttribute('alt', window.data.usersPhotosData[pictureID].comments[i].name);
        commentText.textContent = window.data.usersPhotosData[pictureID].comments[i].message;

        fragment.appendChild(comment);
      }
      commentsList.innerHTML = '';
      commentsList.appendChild(fragment);
    } else {
      commentsList.innerHTML = '';
    }
  };

  var renderPhotoAttributes = function (pictureID) {
    bigPicture.querySelector('.big-picture__img img').src = window.data.usersPhotosData[pictureID].url;
    bigPicture.querySelector('.likes-count').textContent = window.data.usersPhotosData[pictureID].likes;
    bigPicture.querySelector('.comments-count').textContent = window.data.usersPhotosData[pictureID].comments.length;
    bigPicture.querySelector('.social__caption').textContent = window.data.usersPhotosData[pictureID].description;

    renderComments(pictureID);
  };

  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    body.classList.remove('modal-open');
    bigPictureCloseBtn.removeEventListener('click', onbigPictureCloseBtnClick);
    document.removeEventListener('keydown', onFormEscPress);
  };

  var onPictureClick = function (evt) {
    var pictureClick = evt.target.closest('.pictures .picture');

    if (pictureClick) {
      var pictureID = pictureClick.getAttribute('data-id');
      renderPhotoAttributes(pictureID);
      bigPicture.classList.remove('hidden');
      body.classList.add('modal-open');

      bigPictureCloseBtn.addEventListener('click', onbigPictureCloseBtnClick);
      document.addEventListener('keydown', onFormEscPress);
    }
  };

  var onbigPictureCloseBtnClick = function () {
    closeBigPicture();
  };

  var onFormEscPress = function (evt) {
    if (evt.key === window.util.ESC_KEY) {
      closeBigPicture();
    }
  };

  picturesContainer.addEventListener('click', onPictureClick);

  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');
  // document.querySelector('body').classList.add('modal-open');


})();
