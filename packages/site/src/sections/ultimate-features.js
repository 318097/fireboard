/** @jsx jsx */
import { jsx, Box, Container } from "theme-ui";
import SectionHeading from "components/section-heading";
import UltimateFeature from "components/cards/ultimate-feature";

import bulb from "assets/images/icons/bulb.png";
import dart from "assets/images/icons/dart.png";
import rocket from "assets/images/icons/rocket.png";
import trophy from "assets/images/icons/trophy.png";

const data = [
  {
    id: 1,
    icon: trophy,
    title: "Always with you",
    description: `Extension mode works right in your local project environment`,
  },
  {
    id: 2,
    icon: bulb,
    title: "Auto detect project",
    description:
      "Auto detect project by storing the project id in meta tag of your project or in local storage",
  },
  {
    id: 3,
    icon: dart,
    title: "Controls & Actions",
    description: "Track start/end of a feature, add deadline for todos",
  },
  {
    id: 4,
    icon: rocket,
    title: "Today & Timeline",
    description: "Checkout the work done today or glance the work timeline",
  },
];

const UltimateFeatures = () => {
  return (
    <Box as="section" id="ultimate-feature" variant="section.ultimateFeature">
      <Container>
        <SectionHeading
          sx={styles.heading}
          title="Features"
          description="Focus on your work, we take care of tracking."
        />
        <Box sx={styles.features}>
          {data?.map((item) => (
            <UltimateFeature key={item.id} data={item} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default UltimateFeatures;

const styles = {
  heading: {
    marginBottom: [60, 60, 60, 80],
  },
  features: {
    gap: ["35px 60px", 60, 60, 40, 30, 60],
    display: ["grid", "grid"],
    gridTemplateColumns: [
      "repeat(1, 1fr)",
      "repeat(1, 1fr)",
      "repeat(1, 1fr)",
      "repeat(2, 1fr)",
      "repeat(4, 1fr)",
    ],
  },
};
