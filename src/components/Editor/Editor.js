import { useState } from "react";
import EditFeature from "../EditFeature/EditFeature";
import Map from "../Map/Map";

export default function Editor() {
  const [showFeature, setShowFeature] = useState(false);

  return (
    <div style={{ width: "100%", display: "flex" }}>
      {showFeature ? <EditFeature /> : null}
      <Map onShowFeature={setShowFeature} inspectBoolean={showFeature} />
    </div>
  );
}
