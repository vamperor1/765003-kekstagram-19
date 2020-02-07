'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var commentsList = bigPicture.querySelector('.social__comments');
  var fragment = document.createDocumentFragment();

  var renderComments = function () {
    for (var i = 0; i < window.data.usersPhotosData[0].comments.length; i++) {
      var comment = bigPicture.querySelector('.social__comment').cloneNode(true);
      var commentAuthor = comment.querySelector('.social__picture');
      var commentText = comment.querySelector('.social__text');
      commentAuthor.setAttribute('src', window.data.usersPhotosData[0].comments[i].avatar);
      commentAuthor.setAttribute('alt', window.data.usersPhotosData[0].comments[i].name);
      commentText.textContent = window.data.usersPhotosData[0].comments[i].message;

      fragment.appendChild(comment);
    }
    commentsList.innerHTML = '';
    commentsList.appendChild(fragment);
  };

  var renderPhotoAttributes = function () {
    bigPicture.classList.remove('hidden');
    bigPicture.querySelector('.big-picture__img img').setAttribute('src', window.data.usersPhotosData[0].url);
    bigPicture.querySelector('.likes-count').textContent = window.data.usersPhotosData[0].likes;
    bigPicture.querySelector('.comments-count').textContent = window.data.usersPhotosData[0].comments.length;
    bigPicture.querySelector('.social__caption').textContent = window.data.usersPhotosData[0].description;

    renderComments();
  };

  renderPhotoAttributes();

  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');
  document.querySelector('body').classList.add('modal-open');

})();
