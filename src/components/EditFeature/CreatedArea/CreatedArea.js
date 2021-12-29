import "./styles.css";
import { useState, useEffect } from "react";

export default function CreatedArea(props) {
  const [data, setData] = useState(props);

  return (
    <div className={"created-area"}>
      <FeatureType />
      <FeatureCreatedAreaFieldName
        name={data.data.properties.name}
        title={"Name"}
        changeData={setData}
        data={data}
      />
      <button
        onClick={() =>
          saveToJsonAndSVG(
            data,
            props.featureJsonData,
            props.setFeatureJsonData
          )
        }
      >
        Save
      </button>
    </div>
  );
}

function FeatureType() {
  return (
    <div className={"created-area-type"}>
      Feature Type <br />
      <span className={"created-area-type-span"}>{"Created Area"}</span>
    </div>
  );
}

function FeatureCreatedAreaFieldName(props) {
  const [name, setName] = useState(props.name);
  const [data, setData] = useState(props.data);

  useEffect(() => {
    if (props.changeData !== undefined) {
      props.changeData.call(null, data);
    }
  }, [name]);

  return (
    <div className={"created-area-field-name"}>
      <div>
        <span className={"created-area-field-name-span"}>{props.title}</span>
        <hr />
        <input
          type={"text"}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (props.title === "Name") {
              setData({
                ...data,
                data: {
                  ...data.data,
                  properties: {
                    ...data.data.properties,
                    name: e.target.value,
                  },
                },
              });
            }
          }}
          disabled={props.isDisabled ? "disabled" : ""}
        />
      </div>
    </div>
  );
}

function saveToJsonAndSVG(changedData, globalData, setGlobalData) {
  let elementId = changedData.data.id;
  let target = globalData.features.findIndex((record) =>
    record.id.includes(elementId)
  );

  if (target === -1) {
    globalData.features.push(changedData.data);
    return;
  }

  globalData.features[target] = changedData.data;
  setGlobalData(globalData);
}
