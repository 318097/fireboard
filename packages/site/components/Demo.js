import DATA from "../DATA";
const { videoURL } = DATA;

export default function Demo() {
  return (
    <section className="py-8 leading-7 text-gray-900 bg-white sm:py-12 md:py-16 lg:py-24">
      <div className="px-10 mx-auto border-solid lg:px-12 flex justify-center">
        <iframe width={"80%"} height={"500px"} src={videoURL}></iframe>
      </div>
    </section>
  );
}
