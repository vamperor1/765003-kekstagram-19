'use strict';

(function () {
  var filtersForm = document.querySelector('.img-filters__form');
  // var filterButtons = filtersForm.querySelectorAll('.img-filters__button');

  var setActiveFilterBtn = function (evt) {
    var currentActiveBtn = filtersForm.querySelector('.img-filters__button--active');
    if (evt.target !== currentActiveBtn) {
      currentActiveBtn.classList.remove('img-filters__button--active');
      evt.target.classList.add('img-filters__button--active');
    }
    // if (evt.target.matches('.img-filters__button')) {
    //   Array.from(filterButtons).forEach(function (it) {
    //     it.classList.remove('img-filters__button--active');
    //   });
    //   evt.target.classList.add('img-filters__button--active');
    // }
  };

  var clearGallery = function () {
    var currentGallery = document.querySelectorAll('.picture');
    Array.from(currentGallery).map(function (it) {
      it.remove();
    });
  };

  var setDefaultGallery = window.debounce(function () {
    clearGallery();
    window.renderUsersPhotos(window.servData);
  });

  var randomizePhotos = window.debounce(function () {
    clearGallery();
    var randomPhotos = [];

    while (randomPhotos.length < 10) {
      var currentIndex = window.util.getRandomInRange(0, window.servData.length - 1);
      console.log(currentIndex);
      if (randomPhotos.indexOf(window.servData[currentIndex]) < 0) {
        randomPhotos.push(window.servData[currentIndex]);
      }
    }
    console.log(randomPhotos);

    window.renderUsersPhotos(randomPhotos);
  });

  var setPopularPhotos = window.debounce(function () {
    clearGallery();

    var popularPhotos = window.servData.slice().
    sort(function (first, second) {
      if (first.comments.length < second.comments.length) {
        return 1;
      } else if (first.comments.length > second.comments.length) {
        return -1;
      } else {
        return 0;
      }
    });
    console.log(popularPhotos);
    window.renderUsersPhotos(popularPhotos);
  });

  filtersForm.addEventListener('click', function (evt) {
    setActiveFilterBtn(evt);

    if (evt.target.matches('#filter-default')) {
      setDefaultGallery();
    } else if (evt.target.matches('#filter-random')) {
      randomizePhotos();
    } else if (evt.target.matches('#filter-discussed')) {
      setPopularPhotos();
    }
  });

})();

