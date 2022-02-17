import DATA from "../DATA";
const { videoURL } = DATA;

export default function Demo() {
  const classes = {
    container: "py-8 sm:py-12 md:py-16 lg:py-24",
    wrapper: "px-10 lg:px-12 flex justify-center max-w-screen-md m-auto",
  };
  return (
    <section id="demo" className={classes.container}>
      <div className={classes.wrapper}>
        <iframe width={"100%"} height={"400px"} src={videoURL}></iframe>
      </div>
    </section>
  );
}
