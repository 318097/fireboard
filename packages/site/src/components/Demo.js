import DATA from "../DATA";
const { videoURL } = DATA;

export default function Demo() {
  const classes = {
    wrapper: "flex justify-center max-w-screen-md",
  };
  return (
    <section id="demo" className={classes.wrapper}>
      <iframe width={"100%"} height={"400px"} src={videoURL}></iframe>
    </section>
  );
}
