import Swiper from './Swiper.js';
const serviceSwiper = new Swiper(document.getElementById("main-service-swiper"));
serviceSwiper.setNextBtn(document.querySelector(".main-service .swiper-button-next"));
serviceSwiper.setPrevBtn(document.querySelector(".main-service .swiper-button-prev"));
serviceSwiper.setNumOfMoving(9, 4);
serviceSwiper.setNumOfStaging(9, 4);

// const categorySwiper1 = new Swiper(document.querySelector("#main-info .announcement .category-swiper01 .category-swiper"));
// categorySwiper1.setNumOfMoving(4);
// categorySwiper1.setNumOfStaging(4);
// categorySwiper1.setNextBtn(document.querySelector("#main-info .announcement-body .swiper-button-next"));
// categorySwiper1.setPrevBtn(document.querySelector("#main-info .announcement-body .swiper-button-prev"));
// categorySwiper1.setAutoSlide(5000);
// categorySwiper1.setHoverEvent();

// const citizenSwiper = new Swiper(document.querySelector("#main-info .info-board-top .with-citizen .swiper"));
// citizenSwiper.setNextBtn(document.querySelector("#main-info .info-board-top .with-citizen .swiper-button-next"));
// citizenSwiper.setPrevBtn(document.querySelector("#main-info .info-board-top .with-citizen .swiper-button-prev"));
// citizenSwiper.setPlayBtn(document.querySelector("#main-info .info-board-top .with-citizen .swiper-button-play"));
// citizenSwiper.setAutoSlide(3000);
// citizenSwiper.setHoverEvent();