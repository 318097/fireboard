import DATA from "../DATA";
const { videoURL } = DATA;

export default function Demo() {
  return (
    <section id="demo" className="py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="px-10 lg:px-12 flex justify-center max-w-screen-md m-auto">
        <iframe width={"100%"} height={"400px"} src={videoURL}></iframe>
      </div>
    </section>
  );
}
