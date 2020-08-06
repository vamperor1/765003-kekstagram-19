'use strict';

(function () {
  // Изменение масштаба фото
  var SCALE_STEP = 25;
  var SCAL_MAX = 100;
  var SCALE_MIN = 25;
  var COMMENT_MAX_LENGTH = 140;
  var SCALE_INDEX_DEFAULT = 100;
  var PERCENT_DIVISOR = 100;

  // Ползунок
  var EFFECT_LEVEL_DEFAULT = 100;
  var EFFECT_LEVEL_RANGES = {
    CHROME: {
      MIN: 0,
      MAX: 1,
    },
    SEPIA: {
      MIN: 0,
      MAX: 1,
    },
    MARVIN: {
      MIN: 0,
      MAX: 100,
    },
    PHOBOS: {
      MIN: 0,
      MAX: 3,
    },
    HEAT: {
      MIN: 1,
      MAX: 3,
    },
  };

  // Открытие/закрытие формы редактирования фото
  var photoUpload = document.querySelector('#upload-file');
  var formOverlay = document.querySelector('.img-upload__overlay');
  var form = document.querySelector('.img-upload__form');
  var formCloseButton = formOverlay.querySelector('#upload-cancel');
  var body = document.querySelector('body');

  // Изменение масштаба фото
  var scaleIndex = SCALE_INDEX_DEFAULT;
  var scaleMinus = formOverlay.querySelector('.scale__control--smaller');
  var scalePlus = formOverlay.querySelector('.scale__control--bigger');
  var scaleValue = formOverlay.querySelector('.scale__control--value');
  var previewImage = formOverlay.querySelector('.img-upload__preview img');
  var effectsList = formOverlay.querySelector('.effects__list');

  // Ползунок
  var effectLevelHandler = formOverlay.querySelector('.effect-level__pin');
  var effectLevelDepth = formOverlay.querySelector('.effect-level__depth');
  var effectLevelLine = formOverlay.querySelector('.effect-level__line');
  var effectLevelBlock = formOverlay.querySelector('.effect-level');
  var effectLevelInput = formOverlay.querySelector('.effect-level__value');

  // Валидация хэштегов и комментария
  var commentInput = formOverlay.querySelector('.text__description');
  var tagsInput = formOverlay.querySelector('.text__hashtags');
  var TAGS_PATTERN = /[^#a-zA-Zа-яА-Я0-9\s]/g;

  // Загрузка изображения
  var succesModalTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorModalTemplate = document.querySelector('#error').content.querySelector('.error');
  var succesModal = succesModalTemplate.cloneNode(true);
  var errorModal = errorModalTemplate.cloneNode(true);
  var succesModalWindow = succesModal.querySelector('.success__inner');
  var errorModalWindow = errorModal.querySelector('.error__inner');
  var mainPageSection = document.querySelector('main');

  var onPhotoUploadChange = function () {
    formOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
    effectLevelBlock.classList.add('hidden');

    document.addEventListener('keydown', onFormEscPress);
    formCloseButton.addEventListener('click', onFormCloseButtonClick);
    scaleMinus.addEventListener('click', onScaleMinusclick);
    scalePlus.addEventListener('click', onScalePlusclick);
    effectsList.addEventListener('click', onEffectsListClick);
    effectLevelHandler.addEventListener('mousedown', onEffectLevelHandlerMouseDown);
    tagsInput.addEventListener('change', onTagsInputChange);
    commentInput.addEventListener('change', onCommentInput);
  };

  var closeForm = function () {
    formOverlay.classList.add('hidden');
    body.classList.remove('modal-open');
    photoUpload.value = '';
    scaleIndex = SCALE_INDEX_DEFAULT;
    previewImage.removeAttribute('style');
    previewImage.className = '';

    document.removeEventListener('keydown', onFormEscPress);
    formCloseButton.removeEventListener('click', onFormCloseButtonClick);
    scaleMinus.removeEventListener('click', onScaleMinusclick);
    scalePlus.removeEventListener('click', onScalePlusclick);
    effectsList.removeEventListener('click', onEffectsListClick);
    effectLevelHandler.removeEventListener('mousedown', onEffectLevelHandlerMouseDown);
    tagsInput.removeEventListener('change', onTagsInputChange);
    commentInput.removeEventListener('change', onCommentInput);
  };

  var onFormEscPress = function (evt) {
    if (evt.key === window.util.ESC_KEY && !(evt.target === tagsInput || evt.target === commentInput)) {
      closeForm();
      closeModalMsg();
    }
  };

  var onFormCloseButtonClick = function () {
    closeForm();
  };

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
    // scaleIndex = SCALE_INDEX_DEFAULT;
    if (evt.target.matches('.effects__preview')) {
      previewImage.removeAttribute('style');
      previewImage.className = '';
      effectLevelInput.value = EFFECT_LEVEL_DEFAULT;
      scaleValue.value = SCALE_INDEX_DEFAULT;

      if (evt.target.matches('.effects__preview--none')) {
        effectLevelBlock.classList.add('hidden');
      } else {
        effectLevelHandler.style.left = 100 + '%';
        effectLevelDepth.style.width = effectLevelHandler.style.left;
        effectLevelBlock.classList.remove('hidden');
        previewImage.classList.add(evt.target.classList.item(1));
      }
      // console.log(evt.target);
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
    if (commentInput.value.length > COMMENT_MAX_LENGTH) {
      commentInput.setCustomValidity('Длина комментария не может составлять больше 140 символов');
    } else {
      commentInput.setCustomValidity('');
    }
  };

  var onEffectLevelHandlerMouseDown = function (evt) {
    var effectLevelLimits = {
      min: 0,
      max: effectLevelLine.offsetWidth + effectLevelLine.offsetLeft - effectLevelHandler.offsetWidth,
    };
    evt.preventDefault();

    var startX = evt.clientX;

    var onEffectLevelHandlerMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftX = startX - moveEvt.clientX;
      var newLeft = effectLevelHandler.offsetLeft - shiftX;
      startX = moveEvt.clientX;
      if (newLeft < effectLevelLimits.min) {
        effectLevelHandler.style.left = effectLevelLimits.min;
      } else {
        if (newLeft > effectLevelLimits.max) {
          effectLevelHandler.style.left = effectLevelLimits.max;
        } else {
          effectLevelHandler.style.left = newLeft + 'px';
          effectLevelDepth.style.width = effectLevelHandler.style.left;
        }
      }

      var handlerPosition = Math.round(newLeft * 100 / effectLevelLimits.max);
      renderEffectDepth(handlerPosition);
      // console.log ('handlerPosition = ' + handlerPosition);
    };

    var onEffectLevelHandlerMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onEffectLevelHandlerMouseMove);
      document.removeEventListener('mouseup', onEffectLevelHandlerMouseUp);
    };
    document.addEventListener('mousemove', onEffectLevelHandlerMouseMove);
    document.addEventListener('mouseup', onEffectLevelHandlerMouseUp);
  };

  var getEffectPercent = function (effectMin, effectMax, handlerPosition) {
    var effectPercent = effectMin + (((effectMax - effectMin) / 100) * handlerPosition);
    return effectPercent;
  };

  var renderEffectDepth = function (handlerPosition) {
    var effectValue = 0;
    if (previewImage.classList.contains('effects__preview--chrome')) {
      effectValue = getEffectPercent(EFFECT_LEVEL_RANGES.CHROME.MIN, EFFECT_LEVEL_RANGES.CHROME.MAX, handlerPosition);
      previewImage.style.filter = 'grayscale' + '(' + effectValue + ')';
      // effectLevelInput.value = handlerPosition;
    } else {
      if (previewImage.classList.contains('effects__preview--sepia')) {
        effectValue = getEffectPercent(EFFECT_LEVEL_RANGES.SEPIA.MIN, EFFECT_LEVEL_RANGES.SEPIA.MAX, handlerPosition);
        previewImage.style.filter = 'sepia' + '(' + effectValue + ')';
      } else {
        if (previewImage.classList.contains('effects__preview--marvin')) {
          effectValue = getEffectPercent(EFFECT_LEVEL_RANGES.MARVIN.MIN, EFFECT_LEVEL_RANGES.MARVIN.MAX, handlerPosition);
          previewImage.style.filter = 'invert' + '(' + effectValue + '%)';
        } else {
          if (previewImage.classList.contains('effects__preview--phobos')) {
            effectValue = getEffectPercent(EFFECT_LEVEL_RANGES.PHOBOS.MIN, EFFECT_LEVEL_RANGES.PHOBOS.MAX, handlerPosition);
            previewImage.style.filter = 'blur' + '(' + Math.round(effectValue) + 'px)';
          } else {
            effectValue = getEffectPercent(EFFECT_LEVEL_RANGES.HEAT.MIN, EFFECT_LEVEL_RANGES.HEAT.MAX, handlerPosition);
            previewImage.style.filter = 'brightness' + '(' + effectValue + ')';
          }
        }
      }
    }
    effectLevelInput.value = handlerPosition;
  };

  photoUpload.addEventListener('change', onPhotoUploadChange);

  var renderModalMsg = function (succes) {
    if (succes) {
      mainPageSection.append(succesModal);
    } else {
      mainPageSection.append(errorModal);
    }
    document.addEventListener('keydown', onFormEscPress);
    document.addEventListener('click', onPageClick);
  };

  var onSucces = function () {
    closeForm();
    renderModalMsg(true);
  };

  var onError = function () {
    closeForm();
    renderModalMsg(false);
  };

  var closeModalMsg = function () {
    succesModal.remove();
    errorModal.remove();
    document.removeEventListener('keydown', onFormEscPress);
    document.removeEventListener('click', onPageClick);
  };

  var onPageClick = function (evt) {
    if (evt.target !== succesModalWindow || evt.target === errorModalWindow) {
      closeModalMsg();
    }
  };

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.upload(new FormData(form), onSucces, onError);
  });

  /*
  var renderSuccesModal = function () {
    mainPageSection.append(succesModal);
    document.addEventListener('keydown', onModalEscPress);
    document.addEventListener('click', onPageClick);
  };

  var onModalEscPress = function (evt) {
    if (evt.key === window.util.ESC_KEY) {
      closeSuccesModal();
    }
  };

  var onPageClick = function (evt) {
    var succesModalCloseBtn = mainPageSection.querySelector('.success__button');
    if (evt.target === succesModal || evt.target === succesModalCloseBtn) {
      closeSuccesModal();
    }
    console.log(evt.target);
  };

  var closeSuccesModal = function () {
    succesModal.remove();
    document.removeEventListener('keydown', onModalEscPress);
    document.removeEventListener('click', onPageClick);
  };

  var onSucces = function () {
    closeForm();
    renderSuccesModal();
  };

  var onError = function () {
    console.log('onError');
  };

  form.addEventListener('submit', function (evt) {
    window.upload(new FormData(form), onSucces, onError);
    evt.preventDefault();
  });
  */
})();
