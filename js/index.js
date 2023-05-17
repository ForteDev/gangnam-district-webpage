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
    slideDuraition = 680;

    isLastSlide = false;

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
        if(this.isLastSlide){
            for(let i = 0; i < this.numOfStaging; i++){
                this.swiperBox.appendChild(this.swiperBox.children[0]);
            }
            this.placeSlide(this.currentIdx - this.numOfMoving);
            
            setTimeout(()=>{ 
                this.moveSlide(this.lastIdx - this.numOfStaging + 1);
            },20);
            
            setTimeout(()=>{
                for(let i = 0; i < this.numOfStaging; i++){
                    this.swiperBox.prepend(this.swiperBox.children[this.lastIdx]);
                }
                this.placeSlide(0);
            }, this.slideDuraition);
            this.currentIdx = 0;
            this.isLastSlide = false;
            return;
        } else if(targetIdx + this.numOfStaging > this.lastIdx){
            targetIdx = this.lastIdx - this.numOfStaging + 1;
            this.isLastSlide = true;
        } 
        this.moveSlide(targetIdx);
        this.currentIdx = targetIdx;
    }
    
    prevSlide(){
        let targetIdx = this.currentIdx - this.numOfMoving;
        if(this.isLastSlide){
            targetIdx = this.currentIdx - this.itemNum % this.numOfMoving; // 14 - 22 % 9 = 10
            this.isLastSlide = false;
        }else if(targetIdx < 0){
            for(let i = 0; i < this.numOfStaging; i++){
                this.swiperBox.prepend(this.swiperBox.children[this.lastIdx]);
            }
            this.placeSlide(this.numOfStaging);
            setTimeout(() => {
                this.moveSlide(0);
            }, 20);
            
            setTimeout(() => {
                for(let i = 0; i < this.numOfStaging; i++){
                    this.swiperBox.append(this.swiperBox.children[0]);
                }
                this.placeSlide(this.lastIdx - this.numOfStaging + 1);
            }, this.slideDuraition);
            this.currentIdx = this.lastIdx - this.numOfStaging + 1;
            this.isLastSlide = true;
            return;
        }
        this.moveSlide(targetIdx);
        this.currentIdx = targetIdx;
    }

    moveSlide(targetIdx){
        this.swiperBox.style.left = `${-this.itemWidth * targetIdx}px`
    }

    //placeSlide는 애니메이션이 없이 슬라이드 움직임.
    placeSlide(targetIdx){
        this.swiperBox.classList.remove("slidable");
        this.swiperBox.style.left = `${-this.itemWidth * targetIdx}px`
        setTimeout(() => {
            this.swiperBox.classList.add("slidable");    
        }, 10);
    }

    // 핸들러 모음
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
window.addEventListener("resize", setIndexHandlers);
window.addEventListener("load", setIndexHandlers);

function setIndexHandlers(){ //Main 핸들러 다른 핸들러 설정을 담당
    const windowWidth = window.innerWidth;
    if(windowWidth <= maxMoblieWidth){ // 모바일 기기 전용 이벤트 리스너
        serviceSwiper.numOfMoving = 4;
        serviceSwiper.numOfStaging = 4;

        if(existsDesktopListener){ // 데스크탑 이벤트 리스너 삭제

        }
        if(!existsMobileListener){ // 모바일 이벤트 리스너 추가

        }
    } else { // 데스크탑 기기 전용 이벤트 리스너
        serviceSwiper.numOfMoving = 9;
        serviceSwiper.numOfStaging = 9;
        if(existsMobileListener){ // 모바일 이벤트 리스너 삭제

        }
        if(!existsDesktopListener){ // 데스크탑 이벤트 리스너 추가

        }
    }
}