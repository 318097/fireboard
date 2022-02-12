import React, { useState, useEffect } from "react";
import { Anchor } from "@mantine/core";
import { copyToClipboard, getAndFormatProducts } from "@codedrops/lib";
import notify from "../../lib/notify";
import { connect } from "react-redux";
import _ from "lodash";
import "./About.scss";
import { setAppLoading } from "../../redux/actions";
import handleError from "../../lib/errorHandling";
import tracker from "../../lib/mixpanel";

const About = ({ appId, setAppLoading }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    downloadProductInfo();
  }, []);

  const downloadProductInfo = async () => {
    if (!_.isEmpty(products)) return;

    try {
      setAppLoading(true);
      const { others } = await getAndFormatProducts({
        appId,
        trackingInfo: { utm_medium: "about" },
      });
      setProducts(others);
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
    }
  };

  const copy = (input) => {
    copyToClipboard(input);
    notify("Copied!");
  };

  return (
    <section id="about">
      {/* <div className="block">
        <div className="header-row">
          <h3>Story</h3>
        </div>
        <div className="wrapper">
          <p>
            The idea kicked in when I was working for a remote company & at one
            point I was asked to log my daily work. I used to write down all the
            changes, format it & mail it to my manager. It later became really
            frustating. That's how I got the idea to make a application which
            helps in tracking simple tasks.
          </p>
          <p>
            I started work on this application in 2019, but I was not sure if I
            should build this app. As I got more ideas I started building this
            application (No need for 3rd party tools like Jira, Trello). And now
            we have Fireboard.
          </p>
        </div>
      </div> */}

      <div className="block">
        <div className="header-row">
          <h3>Contact</h3>
        </div>
        <div className="wrapper">
          Reach out to me at{" "}
          <span
            className="link"
            onClick={() => copy("mehullakhanpal@gmail.com")}
          >
            mehullakhanpal@gmail.com
          </span>{" "}
          for any feedback/queries. <br />I am planning out v2 for this app.
          Ping me if interested in collaborating.
        </div>
      </div>

      <div className="block">
        <div className="header-row">
          <h3>Donate/Sponser</h3>
        </div>
        <div className="wrapper">
          If you like this app consider supporting{" "}
          <a
            href="https://www.buymeacoffee.com/mehullakhanpal"
            target="__blank"
            className="link"
            onClick={() =>
              tracker.track("SUPPORT", { type: "Buy me a coffee" })
            }
          >
            here
          </a>
        </div>
      </div>

      <div className="block">
        <div className="header-row">
          <h3>Other products</h3>
        </div>
        <div className="products-list">
          {products.map(({ id, name, tagline, ctaUrl }) => (
            <Anchor
              key={id}
              variant="text"
              className="product-item"
              href={ctaUrl}
              target="_blank"
              onClick={() => tracker.track("OTHER_PRODUCTS", { name })}
            >
              <div className="product-title">{name}</div>
              <div className="product-description">{tagline}</div>
            </Anchor>
          ))}
        </div>
      </div>
    </section>
  );
};

const mapDispatchToProps = {
  setAppLoading,
};

export default connect(null, mapDispatchToProps)(About);
