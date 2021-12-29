import "./styles.css";
import { useEffect, useState } from "react";

export default function FeatureWay(props) {
  const [data, setData] = useState(props);

  return (
    <div className={"feature-way"}>
      <FeatureWayType type={data.data.properties.highway} />
      <div className={"feature-way-fields"}>
        Fields
        <FeatureWayField
          name={data.data.properties.name}
          title={"Name"}
          changeData={setData}
          data={data}
        />
        <FeatureWayField
          name={data.data.properties.id}
          isDisabled={true}
          title={"Id"}
        />
        <FeatureWayFieldSelectRoadType
          title={"Road type"}
          value={data.data.properties.highway}
          changeData={setData}
          data={data}
        />
        <FeatureWayFieldSelectSurface
          title={"Road surface"}
          value={data.data.properties.surface}
          changeData={setData}
          data={data}
        />
        <FeatureWayField
          name={data.data.properties.speedlimit}
          title={"Speed limit"}
          changeData={setData}
          data={data}
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

function FeatureWayType(props) {
  return (
    <div className={"feature-way-type"}>
      Feature Type <br />
      <span className={"feature-way-type-span"}>{props.type + " Road"}</span>
    </div>
  );
}

function FeatureWayField(props) {
  const [name, setName] = useState(props.name);
  const [data, setData] = useState(props.data);

  useEffect(() => {
    if (props.changeData !== undefined) {
      props.changeData.call(null, data);
    }
  }, [name]);

  return (
    <div className={"feature-way-field-name"}>
      <div>
        <span className={"feature-way-field-name-span"}>{props.title}</span>
        <hr />
        <input
          id={props.title}
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
            } else if (props.title === "Speed limit") {
              setData({
                ...data,
                data: {
                  ...data.data,
                  properties: {
                    ...data.data.properties,
                    speedlimit: e.target.value,
                  },
                },
              });
            }
          }}
          type={"text"}
          disabled={props.isDisabled ? "disabled" : ""}
        />
      </div>
    </div>
  );
}

function FeatureWayFieldSelectRoadType(props) {
  const [roadType, setRoadType] = useState(props.value);
  const [data, setData] = useState(props.data);

  useEffect(() => {
    if (props.changeData !== undefined) {
      props.changeData.call(null, data);
    }
  }, [roadType]);

  return (
    <div className={"feature-way-field-name"}>
      <div>
        <span className={"feature-way-field-name-span"}>{props.title}</span>
        <hr />
        <select
          id={"select-road-type"}
          defaultValue={roadType}
          onChange={(e) => {
            setRoadType(e.target.value);
            setData({
              ...data,
              data: {
                ...data.data,
                properties: {
                  ...data.data.properties,
                  highway: e.target.value,
                },
              },
            });
          }}
        >
          <option value={"motorway"}>motorway</option>
          <option value={"primary"}>primary</option>
          <option value={"residential"}>residential</option>
          <option value={"track"}>track</option>
          <option value={"service"}>service</option>
          <option value={"created"}>created</option>
          <option selected disabled hidden>
            undefined
          </option>
        </select>
      </div>
    </div>
  );
}

function FeatureWayFieldSelectSurface(props) {
  const [surface, setSurface] = useState(props.value);
  const [data, setData] = useState(props.data);

  useEffect(() => {
    if (props.changeData !== undefined) {
      props.changeData.call(null, data);
    }
  }, [surface]);

  return (
    <div className={"feature-way-field-name"}>
      <div>
        <span className={"feature-way-field-name-span"}>{props.title}</span>
        <hr />
        <select
          id={"select-road-surface"}
          defaultValue={surface}
          onChange={(e) => {
            setSurface(e.target.value);
            setData({
              ...data,
              data: {
                ...data.data,
                properties: {
                  ...data.data.properties,
                  surface: e.target.value,
                },
              },
            });
          }}
        >
          <option value={"paved"}>paved</option>
          <option value={"unpaved"}>unpaved</option>
          <option value={"asphalt"}>asphalt</option>
          <option value={"concrete"}>concrete</option>
          <option value={"grass"}>grass</option>
          <option value={"cobblestone"}>cobblestone</option>
          <option selected disabled hidden>
            undefined
          </option>
        </select>
      </div>
    </div>
  );
}

function SaveToJsonAndSVG(changedData, globalData, setGlobalData) {
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
