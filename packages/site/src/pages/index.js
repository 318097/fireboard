import { Fragment } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Intro from "../components/Intro";
import General from "../components/General";
import Features from "../components/Features";
import Subscribe from "../components/Subscribe";
import Demo from "../components/Demo";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import config from "../config";
import dynamic from "next/dynamic";

const CrispWithNoSSR = dynamic(() => import("../components/Crisp"), {
  ssr: false,
});
import data, { getMenu } from "../DATA";
const { tagline, appName } = data;

export default function Home() {
  return (
    <div>
      <Head>
        <title>{appName}</title>
        <meta name="description" content={tagline} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://fonts.googleapis.com/css?family=Roboto Mono"
          media="all"
        />
        {config.IS_PROD && (
          <Fragment>
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-5GV8TSDDM5"
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5GV8TSDDM5');
            `,
              }}
            />
          </Fragment>
        )}
      </Head>
      <main style={{ fontFamily: "Roboto Mono" }}>
        {config.IS_PROD && <CrispWithNoSSR />}
        <Header />
        {getMenu().map((item) => {
          const key = item.value;
          switch (key) {
            case "intro":
              return <Intro key={key} />;
            case "demo":
              return <Demo key={key} />;
            case "features":
              return <Features key={key} />;
            case "general":
              return <General key={key} />;
            case "subscribe":
              return <Subscribe key={key} />;
            case "carousel":
              return <Carousel key={key} />;
            default:
              return null;
          }
        })}
      </main>
      <Footer />
    </div>
  );
}
