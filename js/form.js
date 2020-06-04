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
  var COMMENT_MAX_LENGTH = 140;
  var SCALE_INDEX_DEFAULT = 100;
  var PERCENT_DIVISOR = 100;
  var scaleIndex = SCALE_INDEX_DEFAULT;
  var scaleMinus = form.querySelector('.scale__control--smaller');
  var scalePlus = form.querySelector('.scale__control--bigger');
  var scaleValue = form.querySelector('.scale__control--value');
  var previewImage = form.querySelector('.img-upload__preview img');
  var effectsList = form.querySelector('.effects__list');

  // Ползунок
  var effectLevelHandler = form.querySelector('.effect-level__pin');
  var effectLevelDepth = form.querySelector('.effect-level__depth');
  var effectLevelLine = form.querySelector('.effect-level__line');
  var effectLevelBlock = form.querySelector('.effect-level');
  var effectLevelInput = form.querySelector('.effect-level__value');

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

  // Валидация хэштегов и комментария
  var commentInput = form.querySelector('.text__description');
  var tagsInput = form.querySelector('.text__hashtags');
  var TAGS_PATTERN = /[^#a-zA-Zа-яА-Я0-9\s]/g;

  var onPhotoUploadChange = function () {
    form.classList.remove('hidden');
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
    effectsList.removeEventListener('click', onEffectsListClick);
    effectLevelHandler.removeEventListener('mousedown', onEffectLevelHandlerMouseDown);
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

})();
