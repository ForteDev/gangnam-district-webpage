/*  Swiper Class 사용 설명서 

I) 변수 설명
    1. Swiper.swiperBox는 스와이프되는 <ul>요소에 지정되어야 한다.
    2. Swiper.numOfStaging은 화면에 나타난 (overflow:hidden으로 숨겨지지 않은) 요소의 개수를 의미한다.
    3. Swiper.numOfMoving은 스와이프 될때마다 움직이는 아이템의 개수를 의미한다.
    4. Swiper.itemWidth는 swiperBox의 자식인 <li>요소의 너비를 의미한다. 각 <li>들은 너비가 모두 동일해야 한다.

II) Swiper 객체 초기화 관련
    0. 요약) swiperBox: 반드시 설정해야 합니다. 
            numOfStaiging & numOfMoving: item이 하나씩 나타나고 움직이는 경우가 아니라면 설정하세요.
            prevBtn & nextBtn: 버튼이 존재하는 경우에만 설정하세요.
    
    1. 객체 생성자를 사용해 swiperBox를 초기화할 수 있다. (선택사항)
    1-1. 생성자를 사용해 초기화하지 않는다면 반드시 setSwiperBox()를 사용해 swiperBox를 초기화해야 한다. 그래야 스와이퍼 관련 속성 변수와 resize 이벤트 리스너가 등록된다.
    2. numOfStaging과 numOfMoving을 초기화해야 한다.(기본 설정값 1) -> 미설정시 item이 하나씩 slide됨
    2-1. 함수 setNumOfStaging()과 setNumOfMoving()을 사용해서 초기화해야 한다.
    2-2. 두 함수 모두 한 개의 인자만 보내면 numOfStaging과  NumOfMoving을 초기화한다.
        ex) setNumOfMoving(9) => numOfMoving = 9; (desktopMoving = null; mobMoving = null)
    2-3. 두 개의 인자를 보내면 첫번째 인자는 데스크탑을 두번째 인자는 모바일 값을 설정한다.
        ex) setNumOfMoving(9, 4) => desktopMoving = 9; mobMoving = 4;
    3. prev버튼과 next 버튼은 반드시 setPrevBtn() setNextBtn() 함수를 사용해서 초기화해야한다. 초기화시 자동으로 이벤트리스너가 등록된다.
*/


/* 추가해야 하는 기능
    2. autoSlide 기능 추가
    2-1. 마우스 호버시 slide 멈춤 / 마우스를 떼면 다시 autoPlay
    3. 비동기식 코드 실행 때문인지 몰라도 swiper 이전/다음 버튼이 이상동작하는 현상을 수정해야함.
    3-1. 콜백 함수에 대한 이해를 바탕으로 nextSlide()와 prevSlide() 함수 코드 재작성 필요.
    4. 스와이퍼 기능 (드래그 시 움직이는)
*/
class Swiper {
    // HTML 요소 객체 변수
    prevBtn = null;
    nextBtn = null;
    playBtn = null;
    swiperBox = null;
    
    // swiper 설정 관련 변수
    deskMoving = null;
    deskStaging = null;
    mobMoving = null;
    mobStaging = null;
    autoSlideTimer = null;

    numOfStaging = 1;
    numOfMoving = 1;
    currentIdx = 0;
    lastIdx = 0;
    itemNum = 0;
    itemWidth = 0;
    slideDuraition = 680;
    slideInterval = 3000;

    // 객체 함수 실행 관련 변수
    isLastSlide = false;
    setsMoblie = false;
    isAuto = false;
    setsHoverEvent = false;

    //생성자 
    constructor(){
        if(arguments.length == 1){
            this.setSwiperBox(arguments[0]);
        }
    }

    // 변수 설정 관련 함수
    setPrevBtn(prevBtn){
        this.prevBtn = prevBtn;
        this.prevBtn.addEventListener("click", this.handlePrevBtn);
    }
    setNextBtn(nextBtn){
        this.nextBtn = nextBtn;
        this.nextBtn.addEventListener("click", this.handleNextBtn);
    }
    setPlayBtn(playBtn){
        this.playBtn = playBtn;
        this.playBtn.addEventListener("click", this.handlePlayBtn);
    }
    setSwiperBox(swiperBox){
        this.swiperBox = swiperBox;
        this.itemNum = this.swiperBox.children.length;
        this.lastIdx = this.itemNum - 1;
        this.setItemWidth();
        window.addEventListener("resize", this.handleResize);
    }
    setItemWidth(){
        try{
            this.itemWidth = this.swiperBox.scrollWidth / this.itemNum;
        } catch(err){
            console.log("swiperBox의 너비가 정의되어 있지 않습니다.\n display:none;속성 때문에 정의되지 않은 것일 수 있습니다.");
        }
    }
    setNumOfMoving(){
        if(arguments.length == 1){
            this.numOfMoving = arguments[0];
        } else if(arguments.length == 0){
            console.log("ERROR: setNumOfMoving 함수에는 반드시 인자가 입력되어야 합니다.");
        } else {
            this.deskMoving = arguments[0];
            this.mobMoving = arguments[1];
            this.setsMoblie = true;
        }
        this.switchMedia(true);
    }
    setNumOfStaging(){
        if(arguments.length == 1){
            this.numOfStaging = arguments[0];
        } else if(arguments.length == 0){
            console.log("ERROR: setNumOfMoving 함수에는 반드시 인자가 입력되어야 합니다.");
        } else {
            this.deskStaging = arguments[0];
            this.mobStaging = arguments[1];
            this.setsMoblie = true;
        }
        this.switchMedia(true);
    }

    // 기능 구현 관련 함수
    setAutoSlide(slideInterval){
        if(arguments.length == 1){
            this.slideInterval = slideInterval;
        }
        this.autoSlideTimer = setInterval(() => { this.nextSlide() }, this.slideInterval);
        this.isAuto = true;
    }
    stopAutoSlide(){
        clearInterval(this.autoSlideTimer);
        this.isAuto = false;
    }
    resizeSwiper(){
        this.switchMedia();
        this.setItemWidth();
        this.placeSlide(this.currentIdx);
    }
    switchMedia(trigger){
        //모바일 설정이 되어 있는 경우에만 실행
        //trigger = true로 인자 전달시 조건문 무조건 실행
        if(this.mobMoving != null && this.mobStaging != null){ 
            try{
                if((!this.setsMoblie || trigger) && maxMoblieWidth > window.innerWidth){
                    this.setMobSwiper();
                } else if((this.setsMoblie || trigger) && maxMoblieWidth <= window.innerWidth){
                    this.setDesktopSwiper();
                }
            } catch(err) {
                console.log(err.name);
                console.log("maxMoblieWidth가 정의되어 있지 않습니다. maxMobileWidth를 전역변수로 설정하십시오.");
            }
        }
    }
    setMobSwiper(){
        // console.log("i am a Mobile");
        this.numOfMoving = this.mobMoving;
        this.numOfStaging = this.mobStaging;
        this.setsMoblie = true;
    }
    setDesktopSwiper(){
        // console.log("I am a PC");
        this.numOfMoving = this.deskMoving;
        this.numOfStaging = this.deskStaging;
        this.setsMoblie = false;
    }
    togglePlay(){
        if(this.isAuto){
            this.playBtn.classList.remove("playing");
            this.playBtn.classList.add("paused");
            this.stopAutoSlide();
        } else {
            this.playBtn.classList.remove("paused");
            this.playBtn.classList.add("playing");
            this.setAutoSlide();
        }
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
    handlePlayBtn = () => { this.togglePlay(); }
    handleHover = () => { }
}

const serviceSwiper = new Swiper(document.getElementById("main-service-swiper"));
serviceSwiper.setNextBtn(document.querySelector(".main-service .swiper-button-next"));
serviceSwiper.setPrevBtn(document.querySelector(".main-service .swiper-button-prev"));
serviceSwiper.setNumOfMoving(9, 4);
serviceSwiper.setNumOfStaging(9, 4);

const categorySwiper1 = new Swiper(document.querySelector("#main-info .announcement .category-swiper01 .category-swiper"));
categorySwiper1.setNumOfMoving(4);
categorySwiper1.setNumOfStaging(4);
categorySwiper1.setNextBtn(document.querySelector("#main-info .announcement-body .swiper-button-next"));
categorySwiper1.setPrevBtn(document.querySelector("#main-info .announcement-body .swiper-button-prev"));
categorySwiper1.setAutoSlide(5000);

const citizenSwiper = new Swiper(document.querySelector("#main-info .info-board-top .with-citizen .swiper"));
citizenSwiper.setNextBtn(document.querySelector("#main-info .info-board-top .with-citizen .swiper-button-next"));
citizenSwiper.setPrevBtn(document.querySelector("#main-info .info-board-top .with-citizen .swiper-button-prev"));
citizenSwiper.setPlayBtn(document.querySelector("#main-info .info-board-top .with-citizen .swiper-button-play"));
citizenSwiper.setAutoSlide(3000);