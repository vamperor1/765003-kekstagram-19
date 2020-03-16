'use strict';

(function () {
  // Открытие/закрытие формы редактирования фото
  var photoUpload = document.querySelector('#upload-file');
  var form = document.querySelector('.img-upload__overlay');
  var formCloseButton = form.querySelector('#upload-cancel');
  var body = document.querySelector('body');

  // Изменение масштаба фото
  var SCALE_STEP = 25;
  var SCAL_MAX = 100;
  var SCALE_MIN = 25;
  var SCALE_INDEX_DEFAULT = 100;
  var PERCENT_DIVISOR = 100;
  var scaleIndex = SCALE_INDEX_DEFAULT;
  var scaleMinus = form.querySelector('.scale__control--smaller');
  var scalePlus = form.querySelector('.scale__control--bigger');
  var scaleValue = form.querySelector('.scale__control--value');
  var previewImage = form.querySelector('.img-upload__preview img');
  var effectsList = form.querySelector('.effects__list');

  // Валидация хэштегов и комментария
  var commentInput = form.querySelector('.text__description');
  var tagsInput = form.querySelector('.text__hashtags');
  var TAGS_PATTERN = /[^#a-zA-Zа-яА-Я0-9\s]/g;

  var onPhotoUploadChange = function () {
    form.classList.remove('hidden');
    body.classList.add('modal-open');

    document.addEventListener('keydown', onFormEscPress);
    formCloseButton.addEventListener('click', onFormCloseButtonClick);
    scaleMinus.addEventListener('click', onScaleMinusclick);
    scalePlus.addEventListener('click', onScalePlusclick);
    effectsList.addEventListener('click', onEffectsListClick);
    tagsInput.addEventListener('change', onTagsInputChange);
    commentInput.addEventListener('change', onCommentInput);
  };

  var closeForm = function () {
    form.classList.add('hidden');
    body.classList.remove('modal-open');
    photoUpload.value = '';
    scaleIndex = SCALE_INDEX_DEFAULT;
    previewImage.removeAttribute('style');
    previewImage.className = '';

    document.removeEventListener('keydown', onFormEscPress);
    formCloseButton.removeEventListener('click', onFormCloseButtonClick);
    scaleMinus.removeEventListener('click', onScaleMinusclick);
    scalePlus.removeEventListener('click', onScalePlusclick);
    tagsInput.removeEventListener('change', onTagsInputChange);
    commentInput.removeEventListener('change', onCommentInput);
  };

  var onFormEscPress = function (evt) {
    if (evt.key === window.util.ESC_KEY && !(evt.target === tagsInput || evt.target === commentInput)) {
      closeForm();
    }
  };

  var onFormCloseButtonClick = function () {
    closeForm();
  };

  photoUpload.addEventListener('change', onPhotoUploadChange);

  var setPreviewImageScale = function () {
    scaleValue.value = scaleIndex + '%';
    previewImage.style.transform = 'scale' + '(' + scaleIndex / PERCENT_DIVISOR + ')';
  };

  var onScalePlusclick = function () {
    if (scaleIndex < SCAL_MAX) {
      scaleIndex += SCALE_STEP;
      setPreviewImageScale();
    }
  };

  var onScaleMinusclick = function () {
    if (scaleIndex > SCALE_MIN) {
      scaleIndex -= SCALE_STEP;
      setPreviewImageScale();
    }
  };

  var onEffectsListClick = function (evt) {
    if (evt.target.matches('.effects__preview')) {
      previewImage.className = '';
      previewImage.classList.add(evt.target.classList.item(1));
    }
  };

  var validateTagsInputPattern = function () {
    if (TAGS_PATTERN.test(tagsInput.value)) {
      tagsInput.setCustomValidity('Хэштег может содержать только знак "#", буквы и цифры');
    } else {
      tagsInput.setCustomValidity('');
    }
  };

  var validateTags = function () {
    var lowerCaseTags = tagsInput.value.toLocaleLowerCase();
    var tags = lowerCaseTags.split(' ');

    for (var i = 0; i < tags.length; i++) {
      var tagsClone = tags.slice(0);
      tagsClone.splice(i, 1);

      if (tags[i].indexOf('#') !== 0) {
        tagsInput.setCustomValidity('Хэштег должен начинаться со знака "#"');
      } else {
        if (tags[i].match(/[#]/g).length > 1) {
          tagsInput.setCustomValidity('Хэштеги должны разделяться пробелом');
        } else {
          if (tags[i].length === 1) {
            tagsInput.setCustomValidity('Хэштег не может состоять только из знака "#"');
          } else {
            if (tags[i].length > 20) {
              tagsInput.setCustomValidity('Максимальная длина одного хэш-тега не более 20 символов');
            } else {
              if (tags.length > 5) {
                tagsInput.setCustomValidity('Максимальная количество хэш-тегов не более 5');
              } else {
                if (tagsClone.includes(tags[i])) {
                  tagsInput.setCustomValidity('Хэш-тег не должен повторяться');
                } else {
                  tagsInput.setCustomValidity('');
                }
              }
            }
          }
        }
      }
    }
  };

  var onTagsInputChange = function () {
    validateTagsInputPattern();
    validateTags();
  };

  var onCommentInput = function () {
    if (commentInput.value.length > 140) {
      commentInput.setCustomValidity('Длина комментария не может составлять больше 140 символов');
    } else {
      commentInput.setCustomValidity('');
    }
  };
})();
