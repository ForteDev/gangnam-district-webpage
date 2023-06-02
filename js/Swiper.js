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
    2. 스와이퍼 기능 (드래그 시 움직이는)
    3. autoSlide 진행 게이지 제작
*/
class Slider {
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
    setsMobile = false;
    isAuto = false;
    setsHoverEvent = false;
    clickEventBlocked = false;

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
        this.swiperBox.classList.add("slidable");
        
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
            this.setsMobile = true;
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
            this.setsMobile = true;
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
    setHoverEvent(){
        this.swiperBox.addEventListener("mouseover", this.handleMouseOver);
        this.swiperBox.addEventListener("mouseleave", this.handleMouseLeave);
    }
    mouseOver(){
        if(this.isAuto){
            clearInterval(this.autoSlideTimer);
        }
    }
    mouseLeave(){
        if(this.isAuto){
            this.setAutoSlide();
        }
    }  
    /* 
    preventClick(): function 
        애니메이션 진행중 next&prev 버튼의 클릭 이벤트를 막는 함수. 
        slideduration + 45ms 동안 클릭 이벤트를 막음. 
        cf) 45ms는 prevSlide() nextSlide() 함수 최대 소요 시간이 slideduration + 45ms이기 때문에 결정한 숫자.
    */
    preventClick(){
        this.clickEventBlocked = true;
        new Promise((resolve) => {
            setTimeout(()=>{
                resolve();
            }, this.slideDuraition + 45);
        })
        .then(() => {
            this.clickEventBlocked = false;
        });
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
                if((!this.setsMobile || trigger) && maxMoblieWidth > window.innerWidth){
                    this.setMobSwiper();
                } else if((this.setsMobile || trigger) && maxMoblieWidth <= window.innerWidth){
                    this.setDesktopSwiper();
                }
            } catch(err) {
                console.log(err.name);
                console.log("maxMoblieWidth가 정의되어 있지 않습니다. maxMobileWidth를 전역변수로 설정하십시오.");
            }
        }
    }
    setMobSwiper(){
        this.numOfMoving = this.mobMoving;
        this.numOfStaging = this.mobStaging;
        this.setsMobile = true;
    }
    setDesktopSwiper(){
        this.numOfMoving = this.deskMoving;
        this.numOfStaging = this.deskStaging;
        this.setsMobile = false;
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
        // 슬라이드 애니메이션 실행 도중에 클릭하는 이벤트 무시.
        if(this.clickEventBlocked){
            return;
        } else {
            this.preventClick();
        }
        
        let targetIdx = this.currentIdx + this.numOfMoving;
        
        if(this.isLastSlide){
            // [마지막 슬라이드에서의 첫 페이지로의 전환 효과]
            for(let i = 0; i < this.numOfStaging; i++){
                this.swiperBox.appendChild(this.swiperBox.children[0]);
            }
            this.placeSlide(this.currentIdx - this.numOfMoving)
            .then(() => {
                    this.moveSlide(this.lastIdx - this.numOfStaging + 1);
                    setTimeout(() => {
                        for(let i = 0; i < this.numOfStaging; i++){
                            this.swiperBox.prepend(this.swiperBox.children[this.lastIdx]);
                        }
                        this.placeSlide(0);
                        this.isLastSlide = false;
                    }, this.slideDuraition);
                });
            return;
        } else if(targetIdx + this.numOfStaging > this.lastIdx){
            targetIdx = this.lastIdx - this.numOfStaging + 1;
            this.isLastSlide = true;
        }
        this.moveSlide(targetIdx);
    }
    prevSlide(){
        // 슬라이드 애니메이션 실행 도중에 클릭하는 이벤트 무시.
        if(this.clickEventBlocked){
            return;
        } else {
            this.preventClick();
        }

        let targetIdx = this.currentIdx - this.numOfMoving;

        if(this.isLastSlide){
            if(this.itemNum % this.numOfMoving != 0){
                targetIdx = this.currentIdx - this.itemNum % this.numOfMoving; 
            }
            this.isLastSlide = false;
        }else if(targetIdx < 0){
            // [첫 슬라이드에서의 마지막 페이지로의 전환 효과]
            for(let i = 0; i < this.numOfStaging; i++){
                this.swiperBox.prepend(this.swiperBox.children[this.lastIdx]);
            }
            this.placeSlide(this.numOfStaging)
            .then(() => {
                this.moveSlide(0);
                setTimeout(() => {
                    for(let i = 0; i < this.numOfStaging; i++){
                        this.swiperBox.append(this.swiperBox.children[0]);
                    }
                    this.placeSlide(this.lastIdx - this.numOfStaging + 1);
                    this.isLastSlide = true;
                }, this.slideDuraition);
            })
            return;
        }
        this.moveSlide(targetIdx);
    }

    moveSlide(targetIdx){
        this.swiperBox.style.left = `${-this.itemWidth * targetIdx}px`
        this.currentIdx = targetIdx;
    }
    //placeSlide는 애니메이션이 없이 슬라이드 움직임.
    placeSlide(targetIdx){
        this.swiperBox.classList.remove("slidable");
        this.swiperBox.style.left = `${-this.itemWidth * targetIdx}px`
        return new Promise((resolve) => {
            setTimeout(() => {
                this.swiperBox.classList.add("slidable");    
                this.currentIdx = targetIdx;
                resolve();
            }, 15);
        });
    }
   
    // 핸들러 모음
    handleNextBtn = () => { this.nextSlide(); }
    handlePrevBtn = () => { this.prevSlide(); }
    handleResize = () => { this.resizeSwiper(); }
    handlePlayBtn = () => { this.togglePlay(); }
    handleMouseOver = () => { this.mouseOver(); }
    handleMouseLeave = () => { this.mouseLeave(); }
}

class Swiper extends Slider{
    originX = 0;

    setSwiperBox(swiperBox){
        super.setSwiperBox(swiperBox);
        this.swiperBox.addEventListener("mousedown", this.handleMouseDown);
    }
    swipeSlide(event){
        console.log("hello");
        this.swiperBox.classList.remove("slidable");
        this.originX = event.pageX;

        // let diffX = 0;
        this.swiperBox.addEventListener("mousemove", this.handleMouseMove);

        function hello() {
            console.log("hello");
        }
        // this.swiperBox.onmouseup = function(){
        //     this.swiperBox.removeEventListener("mousemove", onMouseMove);
        //     let slideWidth = itemWidth * numOfStaging;
        //     if(diffX > slideWidth / 2){
        //         this.nextSlide();
        //     } else if(diffX < -slideWidth / 2){
        //         this.prevSlide();
            // }
            // this.swiperBox.classList.add("slidable");
            // this.swiperBox.onmouseup = null;
        // }
    }

    onMouseMove(event){
        this.moveAt(event.pageX);
    }

    moveAt(pageX){
        diffX = this.originX - pageX;
        this.swiperBox.style.left = -diffX + 'px';
    }
    handleMouseDown = (event) => { this.swipeSlide(event); console.log("Hl");}
    handleMouseMove = (event) => { this.onMouseMove(event); console.log("Hl");}
}

export { Slider, Swiper };