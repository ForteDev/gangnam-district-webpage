/*  Swiper Class 사용 설명서 

I) 변수 설명
    1. Swiper.swiperBox는 스와이프되는 <ul>요소에 지정되어야 한다.
    2. Swiper.numOfStaging은 화면에 나타난 (overflow:hidden으로 숨겨지지 않은) 요소의 개수를 의미한다.
    3. Swiper.numOfMoving은 스와이프 될때마다 움직이는 아이템의 개수를 의미한다.
    4. Swiper.itemWidth는 swiperBox의 자식인 <li>요소의 너비를 의미한다. 각 <li>들은 너비가 모두 동일해야 한다.

II) Swiper 객체 초기화 관련
    1. 객체 생성자를 사용해 swiperBox를 초기화할 수 있다. (선택사항)
    1-1. 생성자를 사용해 초기화하지 않는다면 반드시 setSwiperBox()를 사용해 swiperBox를 초기화해야 한다. 그래야 스와이퍼 관련 속성 변수와 resize 이벤트 리스너가 등록된다.
    2. 객체 사용자는 반드시 swiperBox와 numOfStaging과 numOfMoving을 초기화해야 한다.(기본 설정값 0)
    3. prev버튼과 next 버튼은 반드시 setPrecBtn() setNextBtn() 함수를 사용해서 초기화해야한다. 초기화시 자동으로 이벤트리스너가 등록된다.
*/


class Swiper {
    // HTML 요소 객체 변수
    prevBtn = null;
    nextBtn = null;
    swiperBox = null;
    
    // swiper 설정 관련 변수
    numOfStaging = 0;
    numOfMoving = 0;
    currentIdx = 0;
    lastIdx = 0;
    itemNum = 0;
    itemWidth = 0;
    slideDuraition = 680;

    // 객체 함수 실행 관련 변수
    isLastSlide = false;
    setsMobile = false;

    //생성자 
    constructor(){
        if(arguments.length == 1){
            this.setSwiperBox(arguments[0]);
        }
    }

    setPrevBtn(prevBtn){
        this.prevBtn = prevBtn;
        this.prevBtn.addEventListener("click", this.handlePrevBtn);
    }
    setNextBtn(nextBtn){
        this.nextBtn = nextBtn;
        this.nextBtn.addEventListener("click", this.handleNextBtn);

    }
    setSwiperBox(swiperBox){
        this.swiperBox = swiperBox;
        this.itemNum = this.swiperBox.children.length;
        this.lastIdx = this.itemNum - 1;
        this.setItemWidth();
        window.addEventListener("resize", this.handleResize);
    }
    setItemWidth(){
        this.itemWidth = this.swiperBox.children[0].getClientRects()[0].width;
    }
    resizeSwiper(){
        this.setItemWidth();
        this.placeSlide(this.currentIdx);
        try{
            if(!this.setsMobile && maxMoblieWidth > window.innerWidth){
                this.setMobSwiper();
            } else if(this.setsMobile && maxMoblieWidth <= window.innerWidth){
                this.setDesktopSwiper();
            }
        } catch(err) {
            console.log(err.name);
            console.log("maxMoblieWidth가 정의되어 있지 않습니다. maxMobileWidth를 전역변수로 설정하십시오.");
        }
    }

    setMobSwiper(){
        console.log("Hi");
        this.setsMobile = true;
    }

    setDesktopSwiper(){
        console.log("i am PC");
        this.setsMobile = false;
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
            if(this.itemNum % this.numOfMoving == 0){
                targetIdx = this.currentIdx - this.numOfMoving;
            } else {
                targetIdx = this.currentIdx - this.itemNum % this.numOfMoving; 
            }
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
serviceSwiper.numOfMoving = 9;
serviceSwiper.numOfStaging = 9;


// window.addEventListener("resize", setIndexHandlers);
// window.addEventListener("load", setIndexHandlers);

// const categorySwiper1 = new Swiper(document.querySelector("#main-info .announcement .category-swiper01 .category-swiper"));
// categorySwiper1.numOfMoving = 4;
// categorySwiper1.numOfStaging = 4;
// categorySwiper1.setNextBtn(document.querySelector("#main-info .announcement-body .swiper-button-next"));
// categorySwiper1.setPrevBtn(document.querySelector("#main-info .announcement-body .swiper-button-prev"));

// categorySwiper1.nextBtn.addEventListener("click", categorySwiper1.handleNextBtn);
// categorySwiper1.prevBtn.addEventListener("click", categorySwiper1.handlePrevBtn);

// function setIndexHandlers(){ //Main 핸들러 다른 핸들러 설정을 담당
//     const windowWidth = window.innerWidth;
//     if(windowWidth <= maxMoblieWidth){ // 모바일 기기 전용 이벤트 리스너
//         serviceSwiper.numOfMoving = 4;
//         serviceSwiper.numOfStaging = 4;

//         if(existsDesktopListener){ // 데스크탑 이벤트 리스너 삭제

//         }
//         if(!existsMobileListener){ // 모바일 이벤트 리스너 추가

//         }
//     } else { // 데스크탑 기기 전용 이벤트 리스너
//         serviceSwiper.numOfMoving = 9;
//         serviceSwiper.numOfStaging = 9;
//         if(existsMobileListener){ // 모바일 이벤트 리스너 삭제

//         }
//         if(!existsDesktopListener){ // 데스크탑 이벤트 리스너 추가

//         }
//     }
// }