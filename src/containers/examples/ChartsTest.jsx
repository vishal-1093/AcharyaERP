import { Box } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "@mui/styles";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
function ChartsTest() {
  const theme = useTheme();

  console.log(theme);

  const data = [
    {
      id: "haskell",
      label: "haskell",
      value: 461,
      color: "hsl(156, 70%, 50%)",
    },
    {
      id: "sass",
      label: "sass",
      value: 254,
      color: "hsl(320, 70%, 50%)",
    },
    {
      id: "javascript",
      label: "javascript",
      value: 379,
      color: "hsl(185, 70%, 50%)",
    },
    {
      id: "elixir",
      label: "elixir",
      value: 329,
      color: "hsl(348, 70%, 50%)",
    },
    {
      id: "lisp",
      label: "lisp",
      value: 502,
      color: "hsl(57, 70%, 50%)",
    },
  ];

  return (
    <Box sx={{ width: "100%", height: 500 }}>
      <ResponsivePie
        data={data}
        colors={{ datum: "data.color" }}
        margin={{ top: 47, right: 73, left: 73, bottom: 47 }}
        innerRadius={0.5}
        padAngle={1}
        cornerRadius={7}
        activeInnerRadiusOffset={5}
        activeOuterRadiusOffset={11}
        borderWidth={2}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#222"
        arcLinkLabelsThickness={3}
        arcLinkLabelsColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 5,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 12,
          },
        ]}
        // fill={[
        //   {
        //     match: {
        //       id: "lisp",
        //     },
        //     id: "lines",
        //   },
        //   {
        //     match: {
        //       id: "elixir",
        //     },
        //     id: "dots",
        //   },
        //   {
        //     match: {
        //       id: "javascript",
        //     },
        //     id: "lines",
        //   },
        // ]}
      />
      <p>text</p>
    </Box>
  );
}

export default ChartsTest;
