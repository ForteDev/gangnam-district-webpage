class Swiper {
    prevBtn = null;
    nextBtn = null;
    swiperBox = null;
    
    numOfStaging = 9;
    numOfMoving = 9;
    currentIdx = 0;
    lastIdx = 0;
    itemNum = 0;
    itemWidth = 0;

    constructor(){
        if(arguments.length == 1){
            this.setSwiperBox(arguments[0]);
        }
    }

    setPrevBtn(prevBtn){
        this.prevBtn = prevBtn;
    }
    setNextBtn(nextBtn){
        this.nextBtn = nextBtn;
    }
    setSwiperBox(swiperBox){
        this.swiperBox = swiperBox;
        this.itemNum = this.swiperBox.children.length;
        this.lastIdx = this.itemNum - 1;
        this.setItemWidth();
    }
    setItemWidth(){
        this.itemWidth = this.swiperBox.children[0].getClientRects()[0].width;
    }
    resizeSwiper(){
        this.setItemWidth();
        this.placeSlide(this.currentIdx);
    }
    nextSlide(){
        let targetIdx = this.currentIdx + this.numOfMoving;
        if(targetIdx + this.numOfStaging > this.lastIdx){
            targetIdx = this.lastIdx - this.numOfStaging + 1;
        }
        this.moveSlide(targetIdx);
        this.currentIdx = targetIdx;
    }
    prevSlide(){
        let targetIdx = this.currentIdx - this.numOfMoving;
        if(targetIdx < 0){
            targetIdx = 0;
        }
        this.moveSlide(targetIdx);
        this.currentIdx = targetIdx;
    }

    moveSlide(targetIdx){
        this.swiperBox.style.left = `${-this.itemWidth * targetIdx}px`
    }
    //placeSlide는 애니메이션이 없음.
    placeSlide(targetIdx){
        this.swiperBox.classList.remove("slidable");
        this.swiperBox.style.left = `${-this.itemWidth * targetIdx}px`
        setTimeout(() => {
            this.swiperBox.classList.add("slidable");    
        }, 10);
    }
    handleNextBtn = () => { this.nextSlide(); }
    handlePrevBtn = () => { this.prevSlide(); }
    handleResize = () => { this.resizeSwiper(); }
}

const serviceSwiper = new Swiper(document.getElementById("main-service-swiper"));
serviceSwiper.setNextBtn(document.querySelector(".main-service .swiper-button-next"));
serviceSwiper.setPrevBtn(document.querySelector(".main-service .swiper-button-prev"));

serviceSwiper.nextBtn.addEventListener("click", serviceSwiper.handleNextBtn);
serviceSwiper.prevBtn.addEventListener("click", serviceSwiper.handlePrevBtn);
window.addEventListener("resize", serviceSwiper.handleResize);