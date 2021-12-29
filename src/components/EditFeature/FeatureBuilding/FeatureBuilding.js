import "./styles.css";
import { useEffect, useState } from "react";

export default function FeatureBuilding(props) {
  const [data, setData] = useState(props);

  return (
    <div className={"feature-building"}>
      <FeatureBuildingType />
      <div className={"feature-building-fields"}>
        Fields
        <FeatureBuildingFieldName
          name={props.data.properties["addr:street"]}
          title={"Street"}
          changeData={setData}
          data={data}
        />
        <FeatureBuildingFieldName
          name={props.data.properties["addr:housenumber"]}
          title={"House Number"}
          changeData={setData}
          data={data}
        />
        <FeatureBuildingFieldName
          name={props.data.properties["addr:city"]}
          title={"City"}
          changeData={setData}
          data={data}
        />
        <FeatureBuildingFieldName
          name={props.data.properties.id}
          title={"Id"}
          isDisabled={true}
        />
        <button
          onClick={() =>
            SaveToJsonAndSVG(
              data,
              props.featureJsonData,
              props.setFeatureJsonData
            )
          }
        >
          Save
        </button>
      </div>
    </div>
  );
}

function FeatureBuildingType() {
  return (
    <div className={"feature-building-type"}>
      Feature Type <br />
      <span className={"feature-building-type-span"}>{"Building"}</span>
    </div>
  );
}

function FeatureBuildingFieldName(props) {
  const [name, setName] = useState(props.name);
  const [data, setData] = useState(props.data);

  useEffect(() => {
    if (props.changeData !== undefined) {
      props.changeData.call(null, data);
    }
  }, [name]);

  return (
    <div className={"feature-building-field-name"}>
      <div>
        <span className={"feature-building-field-name-span"}>
          {props.title}
        </span>
        <hr />
        <input
          type={"text"}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (props.title === "Street") {
              setData({
                ...data,
                data: {
                  ...data.data,
                  properties: {
                    ...data.data.properties,
                    "addr:street": e.target.value,
                  },
                },
              });
            } else if (props.title === "House Number") {
              setData({
                ...data,
                data: {
                  ...data.data,
                  properties: {
                    ...data.data.properties,
                    "addr:housenumber": e.target.value,
                  },
                },
              });
            } else if (props.title === "City") {
              setData({
                ...data,
                data: {
                  ...data.data,
                  properties: {
                    ...data.data.properties,
                    "addr:city": e.target.value,
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

function SaveToJsonAndSVG(changedData, globalData, setGlobalData) {
  let elementId = changedData.data.id;
  let target = globalData.features.findIndex((record) =>
    record.id.includes(elementId)
  );
  globalData.features[target] = changedData.data;
  setGlobalData(globalData);
}
