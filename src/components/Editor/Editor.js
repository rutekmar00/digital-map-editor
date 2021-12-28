import { useState } from "react";
import EditFeature from "../EditFeature/EditFeature";
import Map from "../Map/Map";

export default function Editor() {
  const [showFeature, setShowFeature] = useState(false);
  const [svgElementData, setSVGElementData] = useState({});
  const [jsonData, setJsonData] = useState({});

  return (
    <div style={{ width: "100%", display: "flex" }}>
      {showFeature ? (
        <EditFeature
          svgElement={svgElementData}
          globalData={jsonData}
          setGlobalData={setJsonData}
        />
      ) : null}
      <Map
        onShowFeature={setShowFeature}
        inspectBoolean={showFeature}
        getDataFromChild={setSVGElementData}
        getJSONFromChild={setJsonData}
      />
    </div>
  );
}
