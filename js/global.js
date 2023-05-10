const weatherSlider = document.querySelector("#weather-slider .slider");

const languageMenu = document.querySelector("#header .header-top .header-menu .language");

const sitesNav = document.getElementById("relatedsites-nav");
const siteMenuList = document.querySelectorAll("#relatedsites-nav .relatedsites-item");
let openedSiteMenu = null;

const globalnav = document.getElementById("globalnav")
const globalnavMenuList = document.querySelectorAll("#globalnav .globalnav-menu .globalnav-menu-list");
let openedGlobalMenu = null;

const globalnavLevel3 = document.querySelectorAll("#globalnav .globalnav-menu-list .globalnav-submenu-list .globalnav-level3");
let openedGlobalnavLevel3 = null;

const menuBtn = document.getElementById("menuBtn");
const headerTop = document.querySelector("header .header-top");

const maxMoblieWidth = 1080;
let existsMobileListener = false;
let existsDesktopListener = false;

window.addEventListener("load", setHandlers);
window.addEventListener("resize", setHandlers);
/* 이벤트 핸들러 모음 */
function setHandlers(){ //Main 핸들러 다른 핸들러 설정을 담당
    const windowWidth = window.innerWidth;
    if(windowWidth <= maxMoblieWidth){ // 모바일 기기 전용 이벤트 리스너
        if(existsDesktopListener){ // 데스크탑 이벤트 리스너 삭제
            siteMenuList.forEach(li => { li.children[0].removeEventListener("mouseover", openSiteMenu)});
            siteMenuList.forEach(li => li.removeEventListener("mouseleave", closeSiteMenu));
            globalnavMenuList.forEach(li => li.children[0].removeEventListener("mouseover", openGlobalnav));
            globalnavMenuList.forEach(li => li.removeEventListener("mouseleave", closeGlobalnav));
            existsDesktopListener = false;
        }
        if(!existsMobileListener){ // 모바일 이벤트 리스너 추가
            globalnavMenuList[0].classList.add("globalnav-menu-open");
            openedGlobalMenu = globalnavMenuList[0];

            globalnavMenuList.forEach(li => li.children[0].addEventListener("click", openGlobalnav));
            menuBtn.addEventListener("click", toggleMobileNav);
            siteMenuList.forEach(li => { li.children[0].addEventListener("click", openMobileSiteMenu)});
            globalnavLevel3.forEach(ul => {
                if(ul.children.length == 1){
                    ul.parentElement.classList.add("globalnav-level3-onlychild");
                } else {
                    ul.parentElement.children[0].addEventListener("click", openGlobalnavLevel3);
                    ul.myHeight = getHeight(ul);
                }
            });
            existsMobileListener = true;
        }
    } else { // 데스크탑 기기 전용 이벤트 리스너
        if(existsMobileListener){ // 모바일 이벤트 리스너 삭제
            openedGlobalMenu.classList.remove("globalnav-menu-open")
            openedGlobalMenu = null; 

            menuBtn.removeEventListener("click", toggleMobileNav);
            globalnavMenuList.forEach(li => li.children[0].removeEventListener("click", openGlobalnav));
            siteMenuList.forEach(li => { li.children[0].removeEventListener("click", openMobileSiteMenu)});
            globalnavLevel3.forEach(ul => {
                if(ul.children.length == 1){
                    ul.parentElement.classList.remove("globalnav-level3-onlychild");
                } else {
                    ul.parentElement.children[0].removeEventListener("click", openGlobalnavLevel3);
                }
            });
            existsMobileListener = false;
        }
        if(!existsDesktopListener){ // 데스크탑 이벤트 리스너 추가
            siteMenuList.forEach(li => {
                if(li.children[1] != undefined){
                    li.children[1].myHeight = getHeight(li.children[1]);
                }
                li.children[0].addEventListener("mouseover", openSiteMenu);
            });
            siteMenuList.forEach(li => li.addEventListener("mouseleave", closeSiteMenu));
            globalnavMenuList.forEach(li => li.children[0].addEventListener("mouseover", openGlobalnav));
            globalnavMenuList.forEach(li => li.addEventListener("mouseleave", closeGlobalnav));
            existsDesktopListener = true
        }
    }
}

/* 공용: 날씨 슬라이더 */
let weatherInfoTimer = setInterval(() => {
    slideWeatherInfo();
}, 5000);

function slideWeatherInfo(){
    weatherSlider.classList.add("sliding");
    setTimeout(()=>{
        weatherSlider.appendChild(weatherSlider.children[0]);
        weatherSlider.classList.remove("sliding");
    }, 500);
}

/* onclick: 언어선택 버튼 */
function ToggleLanguage(){
    languageMenu.classList.toggle("active");
}

/* onclick: 모바일 글로벌 네비 or 패밀리 사이트 선택 버튼 */
let activatedNav = globalnav;
const navButtonContainer = document.querySelector("#header .header-top .nav-select-buttons");

function activateGlobalNav(){
    if(activatedNav != globalnav){
        activatedNav.classList.remove("active");
        globalnav.classList.add("active");
        activatedNav = globalnav;
        navButtonContainer.classList.add("globalnav-active");
        navButtonContainer.classList.remove("relatedsites-nav-active");
    }
}
function activateSitesNav(){
    if(activatedNav != sitesNav){
        activatedNav.classList.remove("active");
        sitesNav.classList.add("active");
        activatedNav = sitesNav;
        navButtonContainer.classList.add("relatedsites-nav-active");
        navButtonContainer.classList.remove("globalnav-active");
    }
}

/* 데스크탑: 패밀리 사이트 메뉴 설정 시작 */
function getHeight(element){
    element.style.height = 'auto';
    const height = element.offsetHeight + "px";
    element.style.height = '';
    return height;
}

function openSiteMenu(){
    const thisList  = this.parentElement;
    thisList.classList.add("relatedsites-item-open");
    if(thisList.children[1] != undefined){
        thisList.children[1].style.height = thisList.children[1].myHeight;
    }
}

function closeSiteMenu(){
    this.classList.remove("relatedsites-item-open");
    if(this.children[1] != undefined){
        this.children[1].style.height = '0';
    }
}

/* 모바일: 패밀리 사이트 메뉴 설정 */
function openMobileSiteMenu(){
    const thisList  = this.parentElement;
    if(openedSiteMenu != null){
        openedSiteMenu.classList.remove("relatedsites-item-open");
    }
    thisList.classList.add("relatedsites-item-open");
    openedSiteMenu = thisList;
}

/* 데스크탑 & 모바일: 글로벌 네비게이션 설정 */
function openGlobalnav(){
    if(openedGlobalMenu != null){
        openedGlobalMenu.classList.remove("globalnav-menu-open");
    }
    this.parentElement.classList.add("globalnav-menu-open");
    globalnavLevel3.forEach(ul => ul.myHeight = getHeight(ul));
    openedGlobalMenu = this.parentElement;
}
function closeGlobalnav(){
    if(openedGlobalMenu != null){
        openedGlobalMenu.classList.remove("globalnav-menu-open");
    }
}
/* 모바일: 글로벌 네비 level3 설정 */ 
function openGlobalnavLevel3(){
    const target = this.parentElement.children[1];
    if(openedGlobalnavLevel3 != null){
        openedGlobalnavLevel3.style.height = "0px";
        openedGlobalnavLevel3.parentElement.classList.remove("globalnav-level3-open");
    } 
    if(openedGlobalnavLevel3 == target){
        openedGlobalnavLevel3 = null;
    } else {
        target.style.height = target.myHeight;
        openedGlobalnavLevel3 = target;
        target.parentElement.classList.add("globalnav-level3-open");
    } 
}

/* 모바일: 메뉴 버튼 설정 */
function toggleMobileNav(){
    document.body.classList.toggle("mobile-globalnav-open");
    headerTop.classList.toggle("header-top-open");
    menuBtn.classList.toggle("active");
}