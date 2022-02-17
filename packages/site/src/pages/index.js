import { Fragment } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Intro from "../components/Intro";
import General from "../components/General";
import Features from "../components/Features";
import Subscribe from "../components/Subscribe";
import Demo from "../components/Demo";
import Footer from "../components/Footer";
import config from "../config";
import { getMenu, tagline, name } from "../DATA";

export default function Home({ otherProducts }) {
  return (
    <div>
      <Head>
        <title>{name}</title>
        <meta name="description" content={tagline} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://fonts.googleapis.com/css?family=Roboto Mono"
          media="all"
        />
        {config.isProd && (
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
        <Header />
        {getMenu().map((item) => {
          switch (item.value) {
            case "intro":
              return <Intro key={item.value} />;
            case "demo":
              return <Demo key={item.value} />;
            case "features":
              return <Features key={item.value} />;
            case "general":
              return <General key={item.value} />;
            case "subscribe":
              return <Subscribe key={item.value} />;
            default:
              return null;
          }
        })}
      </main>
      <Footer otherProducts={otherProducts} />
    </div>
  );
}
