class Carousel {
    constructor(selector, cardClass, data, settings) {
        this.selector = selector;
        this.cardClass = cardClass;
        this.data = data;
        this.settings = settings;
        this.carouselDOM = null;
        
        this.size = {
            mobile: 1,
            tablet: 2,
            desktop: 3,
        },

        this.currentSize;

        this.previousNext = true;
        this.dots = true;

        this.originalListSize = this.data.list.length;
        this.currentVisibilityIndex = 0;
        this.copyCount = 0;
        this.listSize = 0;
        this.isAnimationInAction = false;
        this.animationDurationMs = 1000;
        this.resizeWindow();
        this.init();
    }
    resizeWindow(){
        window.addEventListener('resize', () => {
            if((window.innerWidth >= 960 && this.currentSize == this.size.desktop)
                || ((window.innerWidth >= 496 && window.innerWidth < 960) && this.currentSize == this.size.tablet)
                || (window.innerWidth < 496 && this.currentSize == this.size.mobile)){
                return;
            }
            this.init();
        })
    }
    init () {
        if(!this.isValidSelector()){
            return [true, 'Neteisingas selector'];
        };
        if(!this.isValidData()){
            return [true, 'Neteisingi duomenys'];
        }
        if(!this.findTargetElememt()) {
            return [true, 'Pagal pateikta selecor, nepavyko rasti elemento'];
        }
        this.updateDefatltSettings();

        this.render();
        this.action();
    }

    isValidSelector(){
        if (typeof this.selector !== 'string'
            || this.selector === ''){
            return false 
        };
        return true; //vietoj viso sito galima: typeof this.selector === string || this.selector !== ''
    }

    isValidData() {
        if(!this.isObj(this.data)
           || !Array.isArray(this.data.list)
           || this.originalListSize === 0){
            return false;
        }
        return true;
    }

    findTargetElememt() {
        this.carouselDOM = document.querySelector(this.selector);
        return !!this.carouselDOM;
    }

    isObj(obj){
        if(typeof obj !== 'object'
        || obj === null
        || Array.isArray(obj)){
            return false;
        }
        return true;
    }
 
    updateDefatltSettings(){
        if(!this.isObj(this.settings)){
            return false;
        }
        if(this.isObj(this.settings.size)){
            if(Number.isInteger(this.size.mobile)//ar naturalus skaicius
               && this.settings.size.mobile > 0){ 
                this.size.mobile = this.settings.size.mobile;
            }
            if(Number.isInteger(this.settings.size.tablet)//ar naturalus skaicius
               && this.settings.size.tablet > 0){ 
                this.size.tablet = this.settings.size.tablet;
            }
            if(Number.isInteger(this.settings.size.desktop)//ar naturalus skaicius
               && this.settings.size.desktop > 0){ 
                this.size.desktop = this.settings.size.desktop;
            }
        }

        if(typeof this.settings.previousNext === 'boolean') {
            this.previousNext = this.settings.previousNext;
        }
        if(typeof this.settings.dots === 'boolean') {
            this.dots = this.settings.dots;
        }

        if(window.innerWidth >= 960){
            this.currentSize = this.size.desktop;
        }
        else if(window.innerWidth >= 496){
            this.currentSize = this.size.tablet;
        }
        else {
            this.currentSize = this.size.mobile;
        }
    }
    listHTML(){
        let HTML = '';

        for (const key in this.size){
            if(this.currentSize == this.size[key]){
                this.copyCount = this.size[key];
            }
        }      
        
        const list = [
            ...this.data.list.slice(-this.copyCount),
            ...this.data.list,
            ...this.data.list.slice(0, this.copyCount)
        ];


        const itemWidth = 100 / this.currentSize;
        for (const item of list){
            const card = new this.cardClass(this.data.srcFolder, item);
            if(card.isValidData() && card.isValidFolder()){
                HTML += `<div class="item" style="width:${itemWidth}%; display:flex; justify-content:center">${card.render()}</div>`
            }
        }

        this.listSize = list.length;

        const width = list.length / this.currentSize * 100; // nepamirsti, kad listo ilgis priklauso nuo kopijų, o kopiju kiekis priklauso nuo to, kiek daugiausiai bus matoma ekrane
        this.currentVisibilityIndex = this.currentSize;
        const trans = 100 / list.length * this.currentVisibilityIndex;
        console.log(this.currentVisibilityIndex, 'list.length: '+ list.length, 'this.copyCount: '+ this.copyCount)

        return `<div class="list-view">
                    <div class="list" 
                        style="width:${width}%; 
                            transform:translateX(calc(-${trans}%))">
                        ${HTML}
                    </div>
                </div>`
    }

    actionsHTML(){
        if (!this.previousNext && !this.dots){
            return '';
        }
        let leftAngleHTML = '';
        let rightAngleHTML = '';
        let dotsHTML = '';

        if(this.previousNext){
            leftAngleHTML = '<i class="fa-solid fa-angle-left"></i>';
            rightAngleHTML = '<i class="fa-solid fa-angle-right"></i>';
        }
        
        if(this.dots) {
            dotsHTML = `<div class="dots">
                            <i class="dot fa-solid fa-circle"></i>
                            ${`<i class="dot fa-solid fa-circle"></i>`.repeat(this.originalListSize - 1)}
                        </div>`
        }
        return `<div class="buttons">
                    ${leftAngleHTML}
                    ${dotsHTML}
                    ${rightAngleHTML}
                </div>`
        
    }
    render () {
        const HTML = this.listHTML() + this.actionsHTML();
        this.carouselDOM.innerHTML = HTML; // galima tiesiog HTML isistatyti
    }
    action () {
       const listDOM = this.carouselDOM.querySelector('.list');
       const nextDOM = this.carouselDOM.querySelector('.fa-angle-right');
       const previousDOM = this.carouselDOM.querySelector('.fa-angle-left');
       const dotsDOM = this.carouselDOM.querySelectorAll('.dot');
    //    this.currentVisibilityIndex = this.originalListSize + this.copyCount;

       nextDOM.addEventListener('click', () => {
           if(!this.isAnimationInAction) {
                this.currentVisibilityIndex++;
                const trans = - 100 / this.listSize * this.currentVisibilityIndex;
                listDOM.style.transform = `translateX(${trans}%)`;
                if (this.currentVisibilityIndex === this.originalListSize + this.copyCount){
                    setTimeout(() => {
                        listDOM.style.transition = `all 0s`;
                        this.currentVisibilityIndex = this.copyCount;
                        const trans = - 100 / this.listSize * this.currentVisibilityIndex;
                        listDOM.style.transform = `translateX(${trans}%)`;
                        setTimeout(() => {
                            listDOM.style.transition = `all 1s`;
                        }, 16)
                    }, this.animationDurationMs)
                } 
            }
           this.isAnimationInAction = true;

           setTimeout(() => {
            this.isAnimationInAction = false;
           }, this.animationDurationMs)
       })

       previousDOM.addEventListener('click', () => {
        if(this.currentVisibilityIndex === 0) {
            setTimeout(() => {
                listDOM.style.transition = `all 0s`;
                this.currentVisibilityIndex = this.listSize - 2 * this.copyCount;
                const trans = 100 / this.listSize * this.currentVisibilityIndex;
                listDOM.style.transform =`translateX(-${trans}%)`;
                setTimeout(() => {
                    listDOM.style.transition = `all 0.5s linear`;
                }, 16)
            }, this.animationDurationMs)
        } else {
            this.currentVisibilityIndex--;
            const trans = 100 / this.listSize * this.currentVisibilityIndex;
            listDOM.style.transform =`translateX(-${trans}%)`
        }
        this.isAnimationInAction = true;

        setTimeout(() => {
         this.isAnimationInAction = false;
        }, this.animationDurationMs)
       })

       for (let i = 0; i < dotsDOM.length; i++) {
            const dot = dotsDOM[i];
            dot.addEventListener('click', () => {
                
                dotsDOM.forEach(d => {
                    d.classList.remove('active');
                });
                dot.classList.add('active');

                const trans = 100 / this.listSize * (i + this.currentSize);
                listDOM.style.transition = 'all 0s';
                listDOM.style.transform = `translateX(-${trans}%)`;
                this.currentVisibilityIndex = i + this.currentSize;
                setTimeout(() => {
                    listDOM.style.transition = 'all 1s';
                }, 16)
            })
        }
    }
}

export { Carousel }
