import SampleImage from "./SampleDoc.png";

function SampleDoc() {
  return (
    <div>
      <p>This is an example of a documentation</p>
      <p>Below is a sample screenshot</p>
      <img src={SampleImage} alt="screenshot" width="100%" />
    </div>
  );
}

export default SampleDoc;
