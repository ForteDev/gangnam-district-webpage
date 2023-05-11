class Swiper {
    prevBtn = null;
    nextBtn = null;
    swiperBox = null;
    
    numOfStaging = 9;
    numOfMoving = 9;
    currentIdx = 0;
    numOfItems = 0;
    
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
        this.numOfItems = this.swiperBox.children.length;
    }

    nextSlide(){
        const targetIdx = this.currentIdx + this.numOfMoving;
        console.log(targetIdx);
        if(targetIdx > this.numOfItems - 1){

        }
    }

    prevSlide(){
        const targetIdx = this.currentIdx - this.numOfMoving;
        console.log(targetIdx);
        if(targetIdx < 0){
            console.log("마지막항목으로");
        }
    }

    handleNextBtn = () => { this.nextSlide(); }
    handlePrevBtn = () => { this.prevSlide(); }
}

const serviceSwiper = new Swiper(document.getElementById("main-service-swiper"));
serviceSwiper.setNextBtn(document.querySelector(".main-service .swiper-button-next"));
serviceSwiper.setPrevBtn(document.querySelector(".main-service .swiper-button-prev"));

serviceSwiper.nextBtn.addEventListener("click", serviceSwiper.handleNextBtn);
serviceSwiper.prevBtn.addEventListener("click", serviceSwiper.handlePrevBtn);