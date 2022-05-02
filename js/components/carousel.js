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
        this.previousNext = true;
        this.dots = true;

        this.init();
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
           ||this.data.list.length === 0){
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
            if(Number.isInteger(this.settings.size.mobile)//ar naturalus skaicius
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
    }
    listHTML(){
        let HTML = '';

        let copyCount = 0;
        for (const key in this.size){
            if(copyCount < this.size[key]){
                copyCount = this.size[key];
                console.log(copyCount)
            }
        }
        console.log(copyCount) //// cia taisyti
        const list = [
            ...this.data.list.slice(-copyCount),
            ...this.data.list,
            ...this.data.list.slice(0, copyCount)
        ];
        for (const item of list){
            const card = new this.cardClass(this.data.srcFolder, item);
            HTML += `<div class="item">${card.render()}</div>`
        }
        const width = list.length / this.size.desktop * 100;
        const trans = 100 / list.length * this.size.desktop;
        return `<div class="list-view">
                    <div class="list" 
                        style="width:${width}% 
                            transform:translateX(calc(${trans}%))">
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
                            <i class="dot  active fa-solid fa-circle"></i>
                            <i class="dot fa-solid fa-circle"></i>
                            <i class="dot fa-solid fa-circle"></i>
                            <i class="dot fa-solid fa-circle"></i>
                            <i class="dot fa-solid fa-circle"></i>
                            <i class="dot fa-solid fa-circle"></i>
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
    
}

export { Carousel }