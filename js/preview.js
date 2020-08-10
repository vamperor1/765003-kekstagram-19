'use strict';

(function () {
  var COMMENTS_STEP = 5;
  var COMMENTS_RANGE = {
    start: 0,
    end: 5
  };
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCloseBtn = bigPicture.querySelector('.big-picture__cancel');
  var commentTemplate = bigPicture.querySelector('.social__comment');
  var commentsList = bigPicture.querySelector('.social__comments');
  var fragment = document.createDocumentFragment();
  var picturesContainer = document.querySelector('.pictures');
  var body = document.querySelector('body');
  var commentsLoaderBtn = bigPicture.querySelector('.comments-loader');
  var commentsID = [];

  var onSucces = function (picture) {
    var renderComments = function (pictureID) {
      var commentsAmount = picture[pictureID].comments.length;
      if (commentsAmount) {
        var commentsBlock = picture[pictureID].comments.slice(COMMENTS_RANGE.start, COMMENTS_RANGE.end);
        for (var i = 0; i < commentsBlock.length; i++) {
          var comment = commentTemplate.cloneNode(true);
          var commentAuthor = comment.querySelector('.social__comment .social__picture');
          var commentText = comment.querySelector('.social__text');

          commentAuthor.src = commentsBlock[i].avatar;
          commentAuthor.alt = commentsBlock[i].name;
          commentText.textContent = commentsBlock[i].message;

          fragment.appendChild(comment);
        }
        commentsList.appendChild(fragment);
        bigPicture.querySelector('.comments-current').textContent = bigPicture.querySelectorAll('.social__comment').length;

        if (commentsAmount >= COMMENTS_RANGE.end) {
          COMMENTS_RANGE.start += COMMENTS_STEP;
          COMMENTS_RANGE.end += COMMENTS_STEP;
        } else {
          commentsLoaderBtn.classList.add('hidden');
        }
      }
    };

    // commentsLoaderBtn.addEventListener

    // var renderComments = function (pictureID) {
    //   var commentsAmount = picture[pictureID].comments.length;
    //   if (commentsAmount) {
    //     for (var i = 0; i < commentsAmount; i++) {
    //       var comment = commentTemplate.cloneNode(true);
    //       var commentAuthor = comment.querySelector('.social__comment .social__picture');
    //       var commentText = comment.querySelector('.social__text');

    //       commentAuthor.src = picture[pictureID].comments[i].avatar;
    //       commentAuthor.alt = picture[pictureID].comments[i].name;
    //       commentText.textContent = picture[pictureID].comments[i].message;

    //       fragment.appendChild(comment);
    //     }
    //     commentsList.innerHTML = '';
    //     commentsList.appendChild(fragment);
    //   } else {
    //     commentsList.innerHTML = '';
    //   }
    // };

    var renderPhotoAttributes = function (pictureID) {
      bigPicture.querySelector('.big-picture__img img').src = picture[pictureID].url;
      bigPicture.querySelector('.likes-count').textContent = picture[pictureID].likes;
      bigPicture.querySelector('.comments-count').textContent = picture[pictureID].comments.length;
      bigPicture.querySelector('.social__caption').textContent = picture[pictureID].description;
      renderComments(pictureID);
      bigPicture.querySelector('.comments-current').textContent = bigPicture.querySelectorAll('.social__comment').length;
    };

    var onCommentsLoaderClick = function () {
      renderComments(commentsID);
    };

    var onPictureClick = function (evt) {
      var pictureClick = evt.target.closest('.pictures .picture');

      if (pictureClick) {
        var pictureID = pictureClick.getAttribute('data-id');
        commentsID = pictureID;
        commentsList.innerHTML = '';

        renderPhotoAttributes(pictureID);
        bigPicture.classList.remove('hidden');
        body.classList.add('modal-open');
        bigPictureCloseBtn.addEventListener('click', onbigPictureCloseBtnClick);
        document.addEventListener('keydown', onFormEscPress);
        commentsLoaderBtn.addEventListener('click', onCommentsLoaderClick);
      }
    };


    var closeBigPicture = function () {
      bigPicture.classList.add('hidden');
      body.classList.remove('modal-open');
      commentsLoaderBtn.classList.remove('hidden');
      COMMENTS_RANGE.start = 0;
      COMMENTS_RANGE.end = 5;
      bigPictureCloseBtn.removeEventListener('click', onbigPictureCloseBtnClick);
      document.removeEventListener('keydown', onFormEscPress);
      commentsLoaderBtn.removeEventListener('click', onCommentsLoaderClick);
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

    // bigPicture.querySelector('.social__comment-count').classList.add('hidden');
    // bigPicture.querySelector('.comments-loader').classList.add('hidden');

  };
  // document.querySelector('body').classList.add('modal-open');
  window.load(onSucces);
})();
