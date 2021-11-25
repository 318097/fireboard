import React, { useState, useEffect, useRef } from "react";
import { Anchor } from "@mantine/core";
import {
  copyToClipboard,
  getProducts,
  appendQueryParams,
} from "@codedrops/lib";
import notify from "../../lib/notify";
import { connect } from "react-redux";
import _ from "lodash";
import "./About.scss";
import { setAppLoading } from "../../redux/actions";
import handleError from "../../lib/errorHandling";
import tracker from "../../lib/mixpanel";

const formatProducts = (products, appId) => {
  return {
    current: products.find((product) => product.id === appId),
    others: products.filter(
      (product) => product.id !== appId && product.visibility?.promotion
    ),
  };
};

const About = ({ appId, setAppLoading }) => {
  const [products, setProducts] = useState([]);
  const currentProduct = useRef();

  useEffect(() => {
    downloadProductInfo();
  }, []);

  const downloadProductInfo = async () => {
    if (!_.isEmpty(products)) return;

    try {
      setAppLoading(true);
      const products = await getProducts();
      const { current, others } = formatProducts(products, appId);
      currentProduct.current = current;
      setProducts(others);
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
    }
  };

  const copy = () => {
    copyToClipboard("mehullakhanpal@gmail.com");
    notify("Copied!");
  };

  return (
    <section id="about">
      <div className="block__fb">
        <div className="header-row__fb">
          <h3>Story</h3>
        </div>
        <div className="wrapper__fb">
          <p>
            The idea kicked in when I was working for a remote job and at one
            point in time I was asked to log daily work. I used to write down
            from small to big changes in code base, format it nicely and mailed
            it to my manager. It became really frustating at a later point in
            time. Then I got the idea why not make a simple application, in
            which developers can write down simple tasks, track their daily
            work.
          </p>
          <p>
            I started work on this application in 2019, but I was not sure on
            which platform to make and should I even make it in the first case.
            As I got ideas and even in my current company which does not ask me
            to log daily work, I just felt the need to have a basic application
            which show me all the pending tasks write from my project (No need
            for 3rd party tools like Jira, Trello). And now we have Fireboard.
          </p>
        </div>
      </div>

      <div className="block__fb">
        <div className="header-row__fb">
          <h3>Other products</h3>
        </div>
        <div className="products-list__fb">
          {products.map(({ id, name, tagline, links }) => (
            <Anchor
              key={id}
              variant="text"
              href={appendQueryParams(
                _.get(links, "product.url"),
                "utm_source=fireboard&utm_medium=about"
              )}
              target="_blank"
              onClick={() => tracker.track("OTHER_PRODUCTS", { name })}
            >
              <div className="product-title__fb">{name}</div>
              <div className="product-description__fb">{tagline}</div>
            </Anchor>
          ))}
        </div>
      </div>

      <div className="block__fb">
        <div className="header-row__fb">
          <h3>Contact</h3>
        </div>
        <div className="wrapper__fb">
          Reach out to me at{" "}
          <span className="email__fb" onClick={copy}>
            mehullakhanpal@gmail.com
          </span>{" "}
          for any feedback/queries
        </div>
      </div>

      {/* <div className="block__fb">
        <div className="header-row__fb">
          <h3>Credits</h3>
        </div>
        <div className="wrapper__fb"></div>
      </div> */}
    </section>
  );
};

const mapDispatchToProps = {
  setAppLoading,
};

export default connect(null, mapDispatchToProps)(About);
