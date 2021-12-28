import "./styles.css";

export default function EditFeature() {
  let feature = <div style={{ textAlign: "center" }}>No feature selected</div>;
  return (
    <div className={"edit-feature"}>
      <p>Edit feature</p>
      {feature}
    </div>
  );
}
