import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import data from "../DATA";
const { carousel = {} } = data;

export default function CarouselComponent() {
  return (
    <section id="carousel" className="">
      <Carousel autoPlay={true} infiniteLoop={true}>
        {carousel.list.map(({ path, legend }, idx) => (
          <div className="" key={idx}>
            <img src={path} />
            {legend && <p className="legend">{legend}</p>}
          </div>
        ))}
      </Carousel>
    </section>
  );
}
