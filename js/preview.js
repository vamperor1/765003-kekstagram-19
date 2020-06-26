'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCloseBtn = bigPicture.querySelector('.big-picture__cancel');
  var commentTemplate = bigPicture.querySelector('.social__comment');
  var commentsList = bigPicture.querySelector('.social__comments');
  var fragment = document.createDocumentFragment();
  var picturesContainer = document.querySelector('.pictures');
  var body = document.querySelector('body');

  var onSucces = function (picture) {
    var renderComments = function (pictureID) {
      var commentsAmount = picture[pictureID].comments.length;
      if (commentsAmount) {
        for (var i = 0; i < commentsAmount; i++) {
          var comment = commentTemplate.cloneNode(true);
          var commentAuthor = comment.querySelector('.social__comment .social__picture');
          var commentText = comment.querySelector('.social__text');

          commentAuthor.src = picture[pictureID].comments[i].avatar;
          commentAuthor.alt = picture[pictureID].comments[i].name;
          commentText.textContent = picture[pictureID].comments[i].message;

          fragment.appendChild(comment);
        }
        commentsList.innerHTML = '';
        commentsList.appendChild(fragment);
      } else {
        commentsList.innerHTML = '';
      }
    };

    var renderPhotoAttributes = function (pictureID) {
      bigPicture.querySelector('.big-picture__img img').src = picture[pictureID].url;
      bigPicture.querySelector('.likes-count').textContent = picture[pictureID].likes;
      bigPicture.querySelector('.comments-count').textContent = picture[pictureID].comments.length;
      bigPicture.querySelector('.social__caption').textContent = picture[pictureID].description;

      renderComments(pictureID);
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


    var closeBigPicture = function () {
      bigPicture.classList.add('hidden');
      body.classList.remove('modal-open');
      bigPictureCloseBtn.removeEventListener('click', onbigPictureCloseBtnClick);
      document.removeEventListener('keydown', onFormEscPress);
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

  };
  // document.querySelector('body').classList.add('modal-open');
  window.load(onSucces);
})();
