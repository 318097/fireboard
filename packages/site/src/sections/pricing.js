/** @jsx jsx */
import { useState } from "react";
import { keyframes } from "@emotion/core";
import { jsx, Box, Grid, Container, Flex, Text, Button } from "theme-ui";
import SectionHeading from "components/section-heading";
import PriceTable from "components/cards/price-table";
import { rgba } from "polished";

const platform = [
  {
    id: 1,
    title: "Chrome extension",
    subtitle: "Good for web developers",
    amount: 0,
    isRecommended: true,
    buttonText: "Download",
    features: [
      {
        id: 1,
        isAvailable: true,
        title: "Loaded along with your project",
      },
      {
        id: 2,
        isAvailable: true,
        title: `Auto detect project using meta tag`,
      },
      {
        id: 3,
        isAvailable: true,
        title: `Auto detect project using local storage`,
      },
      {
        id: 4,
        isAvailable: true,
        title: `Controls & Actions`,
      },
      {
        id: 5,
        isAvailable: true,
        title: `Today & Timeline`,
      },
    ],
  },
  {
    id: 2,
    title: "Web app",
    subtitle: "Good for users from any background",
    amount: 0,
    isRecommended: false,
    buttonText: "Go",
    features: [
      {
        id: 1,
        isAvailable: false,
        title: "Loaded along with your project",
      },
      {
        id: 2,
        isAvailable: false,
        title: `Auto detect project using meta tag`,
      },
      {
        id: 3,
        isAvailable: true,
        title: `Auto detect project using local storage`,
      },
      {
        id: 4,
        isAvailable: true,
        title: `Controls & Actions`,
      },
      {
        id: 5,
        isAvailable: true,
        title: `Today & Timeline`,
      },
    ],
  },
];

const Pricing = () => {
  // const [plan, setPlan] = useState({
  //   active: 'monthly',
  //   pricingPlan: monthly,
  // });

  // const handlePlan = (plan) => {
  //   if (plan === 'monthly') {
  //     setPlan({
  //       ...plan,
  //       active: 'monthly',
  //       pricingPlan: monthly,
  //     });
  //   }
  //   if (plan === 'annual') {
  //     setPlan({
  //       ...plan,
  //       active: 'annual',
  //       pricingPlan: annual,
  //     });
  //   }
  // };
  return (
    <Box
      as="section"
      id="pricing"
      sx={styles.section}
      variant="section.pricing"
    >
      <Container>
        <SectionHeading
          sx={styles.heading}
          title="Platforms"
          description="Available in 2 platforms - Chrome extension and Web app"
        />
        {/* <Flex sx={styles.priceSwitcher}>
          <Text as="span" className="discount">
            Save 20%
          </Text>
          <Button
            variant="text"
            onClick={() => handlePlan('monthly')}
            className={`${plan.active === 'monthly' ? 'active' : ''}`}
          >
            Monthly Plan
          </Button>
          <Button
            variant="text"
            onClick={() => handlePlan('annual')}
            className={`${plan.active === 'annual' ? 'active' : ''}`}
          >
            Annual Plan
          </Button>
        </Flex> */}
        <Grid sx={styles.priceWrapper}>
          {platform.map((price, index) => (
            <PriceTable price={price} key={index} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Pricing;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const fadeIn2 = keyframes`
  from {
    transform: translateY(50%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const styles = {
  heading: {
    mb: [60, null, null, 50],
  },
  priceSwitcher: {
    backgroundColor: "#F7F8FB",
    borderRadius: "5px",
    border: `1px solid ${rgba("#fff", 0.2)}`,
    margin: ["0 auto 40px", null, null, "0 auto 50px"],
    maxWidth: 300,
    position: "relative",
    p: 2,
    ".discount": {
      position: "absolute",
      backgroundColor: "primary",
      color: "#fff",
      minHeight: 25,
      display: "flex",
      alignItems: "center",
      padding: "0 8px",
      fontSize: 13,
      fontWeight: 700,
      textTransform: "unset",
      borderRadius: 25,
      right: 38,
      top: "-17px",
    },
    button: {
      minHeight: "48px",
      px: "25px",
      fontWeight: 500,
      "&.active": {
        backgroundColor: "#fff",
        color: "text",
      },
      ":focus": {
        outline: "0 none",
      },
    },
  },
  priceWrapper: {
    gap: 30,
    display: "grid",
    gridTemplateColumns: [
      "repeat(1, 340px)",
      "repeat(1, 340px)",
      "repeat(1, 340px)",
      "repeat(2,1fr)",
      "repeat(2, 430px)",
      "repeat(2, 440px)",
      "repeat(2, 480px)",
    ],
    justifyContent: "center",
    ".priceCard": {
      ".priceHeader": {
        animation: `${fadeIn} 0.8s linear`,
      },
      "ul > li": {
        animation: `${fadeIn2} 0.7s linear`,
      },
      ".priceAmount": {
        animation: `${fadeIn} 0.9s linear`,
      },
      ".priceButton": {
        animation: `${fadeIn2} 0.7s linear`,
      },
    },
  },
};
