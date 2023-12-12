import "react-responsive-carousel/lib/styles/carousel.min.css"; // Estilos del carrusel
import { Carousel } from 'react-responsive-carousel';
import image1 from '/home/vladimir/Cotizador/front-end/src/image/HC logo .png';
import image2 from '/home/vladimir/Cotizador/front-end/src/image/51669.jpg';
import image3 from '/home/vladimir/Cotizador/front-end/src/image/cotizacion-formal.webp';
import image4 from '/home/vladimir/Cotizador/front-end/src/image/banner-medico-medico-que-trabaja-computadora-portatil.jpg';
import '/home/vladimir/Cotizador/front-end/src/Styles/Carousel.css';


function CarouselComponent() {
return (
    <div className="carousel-container">
    <Carousel
        showArrows={true}
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={2000}
    >
        <div>
            <img src={image1} alt="Imagen 1" />
        </div>
        <div>
            <img src={image2} alt="Imagen 2" />
        </div>
        <div>
            <img src={image3} alt="Imagen 3" />
        </div>
        <div>
            <img src={image4} alt="Imagen 3" />
        </div>
        {/* Agrega más imágenes según sea necesario */}
    </Carousel>
    </div>
);
}

export default CarouselComponent;
