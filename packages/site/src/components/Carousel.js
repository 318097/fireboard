import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import data from "../DATA";
const { carouselList } = data;

export default function CarouselComponent() {
  return (
    <section id="carousel">
      <Carousel>
        {carouselList.map(({ path, legend }, idx) => (
          <div className="" key={idx}>
            <img src={path} />
            {legend && <p className="legend">{legend}</p>}
          </div>
        ))}
      </Carousel>
    </section>
  );
}
