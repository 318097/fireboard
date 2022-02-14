import { Fragment } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import Intro from "../components/Intro";
import General from "../components/General";
import Features from "../components/Features";
import Subscribe from "../components/Subscribe";
import Demo from "../components/Demo";
import Footer from "../components/Footer";
import config from "../config";
import { getAndFormatPromotionalProducts } from "../lib/lib";
import { getMenu, tagline } from "../DATA";
// import { formatDate } from "@codedrops/lib/dist/utils.js";
// console.log("getProducts::-", getProducts);

export default function Home({ otherProducts }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{"Fireboard"}</title>
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
      <main className={styles.main} style={{ fontFamily: "Roboto Mono" }}>
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
        {/* 
        <p className="text-5xl text-red-400">Nexxt</p>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div> */}
      </main>
      <Footer otherProducts={otherProducts} />

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  );
}

export async function getStaticProps() {
  // const lib = await import("@codedrops/lib");
  // console.log("=======", lib);
  const { others = [] } = await getAndFormatPromotionalProducts("FIREBOARD");
  return {
    props: { otherProducts: others },
  };
}