import { Carousel } from "./components/carousel.js";
import { FirstCarouselCard } from "./components/first.js";
import { TestimonialCard } from "./components/testimonial.js";
import { firstCarouselData } from "./data/first-carousel-data.js";


 new Carousel('#first_carousel', FirstCarouselCard, firstCarouselData, {
    size: {
        mobile: 1,
        tablet: 3,
        desktop: 2,
    },
    previousNext:true,
    dots: true,
});
