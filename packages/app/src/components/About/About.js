import React, { useState, useEffect, useRef } from "react";
import { Anchor } from "@mantine/core";
import { getProducts } from "@codedrops/lib/dist/downloads";
import _ from "lodash";
import "./About.scss";

const formatProducts = (products, appId) => {
  return {
    current: products.find((product) => product.id === appId),
    others: products.filter(
      (product) => product.id !== appId && product.visibility?.promotion
    ),
  };
};

const About = ({ appId }) => {
  const [products, setProducts] = useState([]);
  const currentProduct = useRef();

  useEffect(() => {
    getProducts().then((products) => {
      const { current, others } = formatProducts(products, appId);
      currentProduct.current = current;
      setProducts(others);
    });
  }, []);

  console.log("currentProduct::-", currentProduct, products);

  return (
    <section id="about">
      <div className="block">
        <div className="header-row">
          <h3>Story</h3>
        </div>
        <div className="wrapper">
          The idea starts when I was working for a remote job and at one point
          in time I was asked to log daily work. I used to write down from small
          to big changes in code base, format it nicely and mailed it to my
          manager. It became really frustating at a later point in time. Then I
          got the idea why not make a simple application, in which developers
          can write down simple tasks, track their daily work. I started work on
          this application in 2019, but I was not sure on which platform to make
          and should I even make it in the first case. As I got ideas and even
          in my current company which does not ask me to log daily work, I just
          felt the need to have a basic application which show me all the
          pending tasks write from my project (No need for 3rd party tools like
          Jira, Trello). And now we have Fireboard.
        </div>
      </div>

      <div className="block">
        <div className="header-row">
          <h3>Other products</h3>
        </div>
        <div className="products-list">
          {products.map(({ id, name, tagline, links }) => (
            <Anchor
              key={id}
              variant="text"
              href={_.get(links, "product.url")}
              target="_blank"
            >
              <div className="product-title">{name}</div>
              <div className="product-description">{tagline}</div>
            </Anchor>
          ))}
        </div>
      </div>

      <div className="block">
        <div className="header-row">
          <h3>Contact us</h3>
        </div>
        <div className="wrapper">
          Reach out at mehullakhanpal@gmail.com for any queries
        </div>
      </div>

      <div className="block">
        <div className="header-row">
          <h3>Credits</h3>
        </div>
        <div className="wrapper"></div>
      </div>
    </section>
  );
};

export default About;
