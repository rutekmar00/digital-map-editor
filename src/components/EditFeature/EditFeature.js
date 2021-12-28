import "./styles.css";
import FeatureWay from "./FeatureWay/FeatureWay";
import FeatureBuilding from "./FeatureBuilding/FeatureBuilding";
import CreateElement from "./CreateElement/CreateElement";
import CreatedElement from "./CreatedElement/CreatedElement";
import CreatedArea from "./CreatedArea/CreatedArea";

export default function EditFeature(props) {
  const svgElementData = props.globalData;
  const data = props.svgElement;
  let feature;
  if (data.type === "building") {
    feature = (
      <FeatureBuilding
        key={data.id}
        data={data}
        featureJsonData={svgElementData}
        setFeatureJsonData={props.setGlobalData}
      />
    );
  } else if (data.type === "way") {
    feature = (
      <FeatureWay
        key={data.id}
        data={data}
        featureJsonData={svgElementData}
        setFeatureJsonData={props.setGlobalData}
      />
    );
  } else if (data.type === "editor-point") {
    feature = <CreateElement info={data.info} />;
  } else if (data.type === "editor-line") {
    feature = <CreateElement info={data.info} />;
  } else if (data.type === "editor-area") {
    feature = <CreateElement info={data.info} />;
  } else if (data.type === "created-point") {
    feature = <CreatedElement info={data.info} />;
  } else if (data.type === "created-line") {
    feature = (
      <FeatureWay
        key={data.id}
        data={data}
        featureJsonData={svgElementData}
        setFeatureJsonData={props.setGlobalData}
      />
    );
  } else if (data.type === "created-area") {
    feature = (
      <CreatedArea
        key={data.id}
        data={data}
        featureJsonData={svgElementData}
        setFeatureJsonData={props.setGlobalData}
      />
    );
  } else {
    feature = <div style={{ textAlign: "center" }}>No feature selected</div>;
  }
  return (
    <div className={"edit-feature"}>
      <p>Edit feature</p>
      {feature}
    </div>
  );
}
