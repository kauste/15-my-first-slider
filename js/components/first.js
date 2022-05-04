class FirstCarouselCard {
    constructor (folder, data){
        this.folder = folder;
        this.data = data;
    }
    
    isValidFolder(){
        return typeof this.folder === 'string' && this.folder !== '';
    }
    isValidData(){
        if(typeof this.data !== 'object'
        || this.data === null
        || Array.isArray(this.data)
        || typeof this.data.src !== 'string'
        || this.data.src === ''
        || typeof this.data.alt !== 'string'
        || this.data.alt === ''){
            return false
        }
        return true;
    }
    render () {
        return `<img src="${this.folder + this.data.src}" alt="${this.data.alt}" class ="first-carousel-card">`
    }
}

export { FirstCarouselCard }