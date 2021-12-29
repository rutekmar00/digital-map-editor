import React from "react";
import "./styles.css";
import * as MapJSON from "./data/map.json";

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      svgBlobData: null,
      isLoaded: false,
      svgJsonData: null,
      isLoadedJson: false,
      error: null,
      svgImage: null,
      svgImageDocument: null,
      viewBox: null,
      svgSize: null,
      svgElement: null,
      isPanning: false,
      isMoving: false,
      selectedTargetToMove: false,
      elementToMove: null,
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 0, y: 0 },
      scale: 1,
      createElementBool: false,
      createPointBool: false,
      createLineBool: false,
      createAreaBool: false,
      createLineData: { isFirst: false, id: 0 },
      isLockedForEditing: false,
    };
    this.getSVG = this.getSVG.bind(this);
    this.getSVGInfo = this.getSVGInfo.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.handleEventTouch = this.handleEventTouch.bind(this);
    this.getSVGElement = this.getSVGElement.bind(this);
    this.createPoint = this.createPoint.bind(this);
    this.createLine = this.createLine.bind(this);
    this.createArea = this.createArea.bind(this);
    this.createSVGElement = this.createSVGElement.bind(this);
    this.createPointBlinking = this.createPointBlinking.bind(this);
    this.moveElement = this.moveElement.bind(this);
  }
  componentDidMount() {
    this.setState(
      {
        isLoadedJson: true,
        svgJsonData: MapJSON.default,
      },
      () => {
        this.props.getJSONFromChild(this.state.svgJsonData);
      }
    );
  }

  getSVG() {
    let mapObjectDocument =
      document.getElementById("mapObjectId").contentDocument;
    this.setState(
      {
        svgImage: mapObjectDocument.children.item(0),
        svgImageDocument: mapObjectDocument,
      },
      () => this.getSVGInfo()
    );
  }

  getSVGInfo() {
    if (this.state.svgImage !== null) {
      this.setState(
        {
          viewBox: {
            x: this.state.svgImage.viewBox.baseVal.x,
            y: this.state.svgImage.viewBox.baseVal.y,
            w: this.state.svgImage.clientWidth,
            h: this.state.svgImage.clientHeight,
          },
          svgSize: {
            w: this.state.svgImage.clientWidth,
            h: this.state.svgImage.clientHeight,
          },
        },
        () =>
          this.state.svgImage.setAttribute(
            "viewBox",
            `${this.state.viewBox.x} ${this.state.viewBox.y} ${this.state.viewBox.w} ${this.state.viewBox.h}`
          )
      );
    }
  }

  handleEvent = (event) => {
    if (event.type === "mousedown" || event.type === "touchstart") {
      if (this.state.selectedTargetToMove) {
        this.setState({
          isMoving: true,
        });
        return;
      }
      this.setState({
        isPanning: true,
        startPoint: { x: event.screenX, y: event.screenY },
      });
    } else if (event.type === "mouseup" || event.type === "touchend") {
      if (this.state.isMoving) {
        this.setState({
          isMoving: false,
        });
      }
      if (this.state.isPanning) {
        let endPoint = { x: event.screenX, y: event.screenY };
        let dx = (this.state.startPoint.x - endPoint.x) / this.state.scale;
        let dy = (this.state.startPoint.y - endPoint.y) / this.state.scale;
        let movedViewBox;
        if (this.state.viewBox !== null) {
          movedViewBox = {
            x: this.state.viewBox.x + dx,
            y: this.state.viewBox.y + dy,
            w: this.state.viewBox.w,
            h: this.state.viewBox.h,
          };
        }
        if (this.state.svgImage !== null) {
          this.setState(
            {
              endPoint: { x: event.screenX, y: event.screenY },
              isPanning: false,
              viewBox: movedViewBox,
            },
            () =>
              this.state.svgImage.setAttribute(
                "viewBox",
                `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`
              )
          );
        }
      }
    } else if (event.type === "mousemove" || event.type === "touchmove") {
      if (this.state.isMoving) {
        let endPoint = { x: event.clientX, y: event.clientY };
        this.moveElement(this.state.elementToMove, endPoint);
        return;
      }

      if (this.state.isPanning) {
        let endPoint = { x: event.screenX, y: event.screenY };
        let dx = (this.state.startPoint.x - endPoint.x) / this.state.scale;
        let dy = (this.state.startPoint.y - endPoint.y) / this.state.scale;
        let movedViewBox;
        if (this.state.viewBox !== null) {
          movedViewBox = {
            x: this.state.viewBox.x + dx,
            y: this.state.viewBox.y + dy,
            w: this.state.viewBox.w,
            h: this.state.viewBox.h,
          };
        }
        if (this.state.svgImage !== null) {
          this.setState(
            {
              endPoint: { x: event.screenX, y: event.screenY },
            },
            () =>
              this.state.svgImage.setAttribute(
                "viewBox",
                `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`
              )
          );
        }
      }
    } else {
      this.setState({
        isPanning: false,
      });
    }
  };

  handleEventTouch = (event) => {
    if (event.type === "touchstart") {
      if (this.state.selectedTargetToMove) {
        this.setState({
          isMoving: true,
        });
        return;
      }
      this.setState({
        isPanning: true,
        startPoint: {
          x: event.touches[0].screenX,
          y: event.touches[0].screenY,
        },
      });
    } else if (event.type === "touchend") {
      if (this.state.isMoving) {
        this.setState({
          isMoving: false,
        });
      }
      if (this.state.isPanning) {
        let endPoint = {
          x: event.changedTouches[0].screenX,
          y: event.changedTouches[0].screenY,
        };
        let dx = (this.state.startPoint.x - endPoint.x) / this.state.scale;
        let dy = (this.state.startPoint.y - endPoint.y) / this.state.scale;
        let movedViewBox;
        if (this.state.viewBox !== null) {
          movedViewBox = {
            x: this.state.viewBox.x + dx,
            y: this.state.viewBox.y + dy,
            w: this.state.viewBox.w,
            h: this.state.viewBox.h,
          };
        }
        if (this.state.svgImage !== null) {
          this.setState(
            {
              endPoint: {
                x: event.changedTouches[0].screenX,
                y: event.changedTouches[0].screenY,
              },
              isPanning: false,
              viewBox: movedViewBox,
            },
            () =>
              this.state.svgImage.setAttribute(
                "viewBox",
                `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`
              )
          );
        }
      }
    } else if (event.type === "touchmove") {
      if (this.state.isMoving) {
        let endPoint = {
          x: event.touches[0].screenX,
          y: event.touches[0].screenY,
        };
        this.moveElement(this.state.elementToMove, endPoint);
        return;
      }

      if (this.state.isPanning) {
        let endPoint = {
          x: event.touches[0].screenX,
          y: event.touches[0].screenY,
        };
        let dx = (this.state.startPoint.x - endPoint.x) / this.state.scale;
        let dy = (this.state.startPoint.y - endPoint.y) / this.state.scale;
        let movedViewBox;
        if (this.state.viewBox !== null) {
          movedViewBox = {
            x: this.state.viewBox.x + dx,
            y: this.state.viewBox.y + dy,
            w: this.state.viewBox.w,
            h: this.state.viewBox.h,
          };
        }
        if (this.state.svgImage !== null) {
          this.setState(
            {
              endPoint: {
                x: event.touches[0].screenX,
                y: event.touches[0].screenY,
              },
            },
            () =>
              this.state.svgImage.setAttribute(
                "viewBox",
                `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`
              )
          );
        }
      }
    } else {
      this.setState({
        isPanning: false,
      });
    }
  };

  getSVGElement = (event) => {
    let pageScrollX = window.scrollX;
    let pageScrollY = window.scrollY;
    let viewBoxX = this.state.viewBox.x;
    let viewBoxY = this.state.viewBox.y;
    let screenSizeX = document
      .getElementById("root")
      .getBoundingClientRect().width;
    let screenSizeY = document
      .getElementsByClassName("container")[0]
      .getBoundingClientRect().height;
    let editorSizeX = document
      .getElementById("mapContainer")
      .getBoundingClientRect().width;
    let editorSizeY = document
      .getElementById("mapContainer")
      .getBoundingClientRect().height;
    let x = event.clientX + pageScrollX - (screenSizeX - editorSizeX),
      y = event.clientY + pageScrollY - (screenSizeY - editorSizeY);
    let svgImage = this.state.svgImage;
    let point = svgImage.createSVGPoint();
    point.x = x;
    point.y = y;
    point = point.matrixTransform(svgImage.getScreenCTM().inverse());
    if (this.state.createPointBool === true) {
      this.createPoint(point, svgImage);
      return;
    } else if (this.state.createLineBool === true) {
      if (this.state.createLineData.isFirst === false) {
        this.setState({
          createLineData: {
            ...this.state.createLineData,
            firstPoint: point,
            isFirst: true,
          },
        });
        return;
      }

      if (this.state.createLineData.isFirst === true) {
        if (this.state.createLineData.firstCreation === false) {
          this.setState(
            {
              createLineData: {
                ...this.state.createLineData,
                secondPoint: point,
              },
            },
            () => {
              this.createLine(svgImage);
            }
          );
          return;
        }

        this.setState(
          {
            createLineData: {
              ...this.state.createLineData,
              secondPoint: point,
              firstCreation: true,
            },
          },
          () => {
            this.createLine(svgImage);
          }
        );
      }
    } else if (this.state.createAreaBool === true) {
      this.createArea(point, svgImage);
      return;
    }
    let current = this.state.svgImageDocument.elementsFromPoint(
      point.x - viewBoxX,
      point.y - viewBoxY
    );
    current = current[0];
    if (current.classList.contains("draggable")) {
      this.setState({
        selectedTargetToMove: true,
        elementToMove: current,
      });
      return;
    }
    if (this.state.svgElement != null) {
      if (this.state.svgElement.classList.contains("tag-building")) {
        this.state.svgElement.classList.remove("tag-building-blinking-border");
      } else if (this.state.svgElement.classList.contains("tag-highway")) {
        this.state.svgElement.classList.remove("tag-highway-blinking-border");
      } else if (this.state.svgElement.classList.contains("created-point")) {
        this.state.svgElement.classList.remove("created-point-blinking-border");
      } else if (this.state.svgElement.classList.contains("created-line")) {
        this.state.svgElement.classList.remove("created-line-blinking-border");
      } else if (this.state.svgElement.classList.contains("created-area")) {
        this.state.svgElement.classList.remove("tag-building-blinking-border");
      }
    }
    if (current.classList.contains("tag-building")) {
      let parent = svgImage.children[6];
      while (parent.firstChild) {
        parent.firstChild.remove();
      }
      current.classList.add("tag-building-blinking-border");
      let pathPoints = current.getAttribute("d");
      let divided = pathPoints.split(/[MLZ]/);
      let elements = [];
      divided.pop();
      for (let i = 1; i < divided.length; i++) {
        let point = {};
        let element;
        point["x"] = divided[i].split(",")[0];
        point["y"] = divided[i].split(",")[1];
        element = this.createPointBlinking(point, svgImage, "draggable");
        elements.push(element);
      }
      this.setState(
        {
          svgElement: current,
        },
        () => {
          const elementId = current.classList.item(3).slice(1);
          const target = this.state.svgJsonData.features.find((record) =>
            record.id.includes(elementId)
          );
          if (target != null) {
            this.props.getDataFromChild(
              Object.assign(target, { type: "building" })
            );
          }
        }
      );
      return;
    } else if (current.classList.contains("tag-highway")) {
      let parent = svgImage.children[6];
      while (parent.firstChild) {
        parent.firstChild.remove();
      }
      current.classList.add("tag-highway-blinking-border");
      let pathPoints = current.getAttribute("d");
      let divided = pathPoints.split(/[ML]/);
      for (let i = 1; i < divided.length; i++) {
        let point = {};
        point["x"] = divided[i].split(",")[0];
        point["y"] = divided[i].split(",")[1];
        this.createPointBlinking(point, svgImage, "draggable");
      }
      this.setState(
        {
          svgElement: current,
        },
        () => {
          const elementId = current.classList.item(3).slice(1);
          const target = this.state.svgJsonData.features.find((record) =>
            record.id.includes(elementId)
          );
          if (target != null) {
            this.props.getDataFromChild(Object.assign(target, { type: "way" }));
          }
        }
      );
    } else if (current.classList.contains("created-point")) {
      let parent = svgImage.children[6];
      while (parent.firstChild) {
        parent.firstChild.remove();
      }
      current.classList.add("created-point-blinking-border");
      this.setState(
        {
          svgElement: current,
        },
        () => {
          this.props.getDataFromChild(
            Object.assign(current, { type: "created-point" })
          );
        }
      );
    } else if (current.classList.contains("created-line")) {
      let parent = svgImage.children[6];
      while (parent.firstChild) {
        parent.firstChild.remove();
      }
      current.classList.add("created-line-blinking-border");
      let pathPoints = current.getAttribute("d");
      let divided = pathPoints.split(/[ML]/);
      for (let i = 1; i < divided.length; i++) {
        let point = {};
        point["x"] = divided[i].split(",")[0];
        point["y"] = divided[i].split(",")[1];
        this.createPointBlinking(point, svgImage, "draggable");
      }
      this.setState(
        {
          svgElement: current,
        },
        () => {
          const elementId = current.classList[1];
          const target = this.state.svgJsonData.features.findIndex((record) =>
            record.id.includes(elementId)
          );
          if (target === -1) {
            let idOfCreatedLine = current.classList[1];
            let targetData = {
              type: "Feature",
              id: `created/${idOfCreatedLine}`,
              properties: {
                name: "Common name (not set)",
                id: `created/${idOfCreatedLine}`,
                speedlimit: "undetermined",
                highway: "created",
              },
            };
            this.props.getDataFromChild(
              Object.assign(targetData, { type: "created-line" })
            );
            return;
          }
          if (target != null) {
            let jsonDataOfElement = this.state.svgJsonData.features[target];
            let current = this.state.svgElement;
            if (
              jsonDataOfElement.properties.highway === "track" &&
              jsonDataOfElement.properties.surface === "unpaved"
            ) {
              current.classList.add(
                "way",
                "line",
                "stroke",
                "tag-highway",
                "tag-highway-track",
                "tag-unpaved"
              );
              let current1 = current.cloneNode(true);
              let current2 = current.cloneNode(true);
              current1.classList.add(
                "casing",
                "tag-highway",
                "tag-highway-track",
                "tag-unpaved"
              );
              current1.style.stroke = "#c5b59f";
              current2.classList.add(
                "shadow",
                "tag-highway",
                "tag-highway-track",
                "tag-unpaved"
              );
              current.classList.remove("created-line-blinking-border");
              current1.classList.remove("created-line-blinking-border");
              current2.classList.remove("created-line-blinking-border");
              svgImage.children[5].appendChild(current1);
              svgImage.children[5].appendChild(current2);
            }
            this.props.getDataFromChild(
              Object.assign(this.state.svgJsonData.features[target], {
                type: "way",
              })
            );
          }
        }
      );
    } else if (current.classList.contains("created-area")) {
      let parent = svgImage.children[6];
      while (parent.firstChild) {
        parent.firstChild.remove();
      }
      current.classList.add("tag-building-blinking-border");
      let pathPoints = current.getAttribute("points");
      let divided = pathPoints.split(/[ ]/);
      for (let i = 0; i < divided.length; i++) {
        let point = {};
        point["x"] = divided[i].split(",")[0];
        point["y"] = divided[i].split(",")[1];
        this.createPointBlinking(point, svgImage, "draggable");
      }
      this.setState(
        {
          svgElement: current,
        },
        () => {
          const elementId = current.classList[1];
          const target = this.state.svgJsonData.features.findIndex((record) =>
            record.id.includes(elementId)
          );
          if (target === -1) {
            let idOfCreatedArea = current.classList[1];
            let targetData = {
              type: "Created Area",
              id: `created/${idOfCreatedArea}`,
              properties: {
                name: "Common name (not set)",
                id: `created/${idOfCreatedArea}`,
              },
            };
            this.props.getDataFromChild(
              Object.assign(targetData, { type: "created-area" })
            );
            return;
          }
          if (target != null) {
            this.props.getDataFromChild(
              Object.assign(this.state.svgJsonData.features[target], {
                type: "created-area",
              })
            );
          }
        }
      );
    } else {
      let parent = svgImage.children[6];
      while (parent.firstChild) {
        parent.firstChild.remove();
      }
      this.setState(
        {
          svgElement: null,
          selectedTargetToMove: false,
        },
        () => {
          this.props.getDataFromChild({ type: "empty" });
        }
      );
    }
  };

  moveElement(element, pointFromParent) {
    let pageScrollX = window.scrollX;
    let pageScrollY = window.scrollY;
    let screenSizeX = document
      .getElementById("root")
      .getBoundingClientRect().width;
    let screenSizeY = document
      .getElementsByClassName("container")[0]
      .getBoundingClientRect().height;
    let editorSizeX = document
      .getElementById("mapContainer")
      .getBoundingClientRect().width;
    let editorSizeY = document
      .getElementById("mapContainer")
      .getBoundingClientRect().height;
    let x = pointFromParent.x + pageScrollX - (screenSizeX - editorSizeX),
      y = pointFromParent.y + pageScrollY - (screenSizeY - editorSizeY);
    let svgImage = this.state.svgImage;
    let elementToMove = this.state.svgElement;
    let elementPointToMove = this.state.elementToMove;
    let point = svgImage.createSVGPoint();
    point.x = x;
    point.y = y;
    point = point.matrixTransform(svgImage.getScreenCTM().inverse());
    let stringToUpdatePath;
    if (elementToMove.classList.contains("created-area")) {
      stringToUpdatePath = elementToMove.getAttribute("points");
    } else {
      stringToUpdatePath = elementToMove.getAttribute("d");
    }
    let stringToBeReplaced =
      elementPointToMove.getAttribute("cx") +
      "," +
      elementPointToMove.getAttribute("cy");
    let stringToUpdate = point.x.toString() + "," + point.y.toString();
    stringToUpdatePath = stringToUpdatePath.replace(
      stringToBeReplaced,
      stringToUpdate
    );
    element.setAttribute("cx", point.x);
    element.setAttribute("cy", point.y);
    if (elementToMove.classList.contains("created-area")) {
      elementToMove.setAttribute("points", stringToUpdatePath);
      return;
    }
    elementToMove.setAttribute("d", stringToUpdatePath);

    if (
      elementToMove.classList.contains("way") &&
      elementToMove.classList.contains("line")
    ) {
      let secondElementToUpdate = svgImage.getElementsByClassName(
        elementToMove.classList[3]
      )[1];
      secondElementToUpdate.setAttribute("d", stringToUpdatePath);
    }
  }

  inspectFeature(passedValue) {
    this.props.onShowFeature(passedValue);
  }

  createPoint(point, svgImage) {
    let svgNS = "http://www.w3.org/2000/svg";
    let newElement = document.createElementNS(svgNS, "circle");

    newElement.setAttributeNS(null, "cx", point.x);
    newElement.setAttributeNS(null, "cy", point.y);
    newElement.setAttributeNS(null, "r", "5");
    newElement.classList.add("created-point");
    svgImage.children[5].appendChild(newElement);
  }

  createPointBlinking(point, svgImage, typeOfFeature) {
    let svgNS = "http://www.w3.org/2000/svg";
    let newElement = document.createElementNS(svgNS, "circle");

    newElement.setAttributeNS(null, "cx", point.x);
    newElement.setAttributeNS(null, "cy", point.y);
    newElement.setAttributeNS(null, "r", "5");
    newElement.classList.add("created-point");
    newElement.classList.add(typeOfFeature);
    svgImage.children[6].appendChild(newElement);
    return newElement;
  }

  createLine(svgImage) {
    const lineObjectData = this.state.createLineData;
    let currentElement = lineObjectData.element;

    if (lineObjectData.firstCreation === true) {
      let svgNS = "http://www.w3.org/2000/svg";
      let newElement = document.createElementNS(svgNS, "path");

      newElement.setAttributeNS(
        null,
        "d",
        "M" +
          lineObjectData.firstPoint.x.toString() +
          "," +
          lineObjectData.firstPoint.y.toString()
      );
      let stringForSecondPoint = newElement.getAttributeNS(null, "d");
      stringForSecondPoint =
        stringForSecondPoint +
        "L" +
        lineObjectData.secondPoint.x.toString() +
        "," +
        lineObjectData.secondPoint.y.toString();
      newElement.setAttributeNS(null, "d", stringForSecondPoint);
      newElement.setAttributeNS(null, "fill", "none");
      newElement.classList.add("created-line");
      newElement.classList.add(
        "line" + this.state.createLineData.id.toString()
      );
      svgImage.children[5].appendChild(newElement);

      this.setState(
        {
          createLineData: {
            ...this.state.createLineData,
            isFirst: true,
            firstPoint: lineObjectData.secondPoint,
            element: newElement,
            firstCreation: false,
          },
        },
        () => {
          return 0;
        }
      );
      return;
    }
    if (currentElement !== undefined) {
      let stringForSecondPoint = currentElement.getAttributeNS(null, "d");
      stringForSecondPoint =
        stringForSecondPoint +
        "L" +
        lineObjectData.secondPoint.x.toString() +
        "," +
        lineObjectData.secondPoint.y.toString();
      currentElement.setAttributeNS(null, "d", stringForSecondPoint);
      this.setState(
        {
          createLineData: {
            ...this.state.createLineData,
            isFirst: true,
            firstPoint: lineObjectData.secondPoint,
            element: currentElement,
            firstCreation: false,
          },
        },
        () => {
          return 0;
        }
      );
    }
  }

  createArea(point, svgImage) {
    let svgNS = "http://www.w3.org/2000/svg";
    let newElement = document.createElementNS(svgNS, "polygon");
    let stringForPoints1 = (point.x - 50).toString() + "," + (point.y + 25);
    let stringForPoints2 = (point.x + 50).toString() + "," + (point.y + 25);
    let stringForPoints3 = (point.x + 50).toString() + "," + (point.y - 25);
    let stringForPoints4 = (point.x - 50).toString() + "," + (point.y - 25);
    let stringForPoints =
      stringForPoints1 +
      " " +
      stringForPoints2 +
      " " +
      stringForPoints3 +
      " " +
      stringForPoints4;
    newElement.setAttributeNS(null, "points", stringForPoints);
    newElement.classList.add("created-area");
    newElement.classList.add("area" + Math.floor(Math.random() * 1000));
    svgImage.children[5].appendChild(newElement);
  }

  createSVGElement(buttonState, element) {
    const elemPoint = document.getElementsByClassName("create-point")[0];
    const elemLine = document.getElementsByClassName("create-line")[0];
    const elemArea = document.getElementsByClassName(`create-area`)[0];
    if (buttonState === true && element === "point") {
      elemPoint.classList.add("button-clicked");
      elemLine.disabled = true;
      elemArea.disabled = true;
      this.setState(
        {
          createPointBool: true,
        },
        () => {
          this.props.getDataFromChild(
            Object.assign(
              {
                info: "Creating point is selected",
              },
              { type: "editor-point" }
            )
          );
        }
      );
    } else if (buttonState === true && element === "line") {
      elemLine.classList.add("button-clicked");
      elemPoint.disabled = true;
      elemArea.disabled = true;
      this.setState(
        {
          createLineBool: true,
        },
        () => {
          this.props.getDataFromChild(
            Object.assign(
              {
                info: "Creating line is selected",
              },
              { type: "editor-line" }
            )
          );
        }
      );
    } else if (buttonState === true && element === "area") {
      elemArea.classList.add("button-clicked");
      elemLine.disabled = true;
      elemPoint.disabled = true;
      this.setState(
        {
          createAreaBool: true,
        },
        () => {
          this.props.getDataFromChild(
            Object.assign(
              {
                info: "Creating area is selected",
              },
              { type: "editor-area" }
            )
          );
        }
      );
    } else {
      elemPoint.disabled = false;
      elemLine.disabled = false;
      elemArea.disabled = false;
      elemPoint.classList.remove("button-clicked");
      elemLine.classList.remove("button-clicked");
      elemArea.classList.remove("button-clicked");
      let numberForLineData = this.state.createLineData.id + 1;
      this.setState(
        {
          createPointBool: false,
          createLineBool: false,
          createAreaBool: false,
          createLineData: { id: numberForLineData, isFirst: false },
        },
        () => {
          this.props.getDataFromChild({ type: "empty" });
        }
      );
    }
  }

  render() {
    const { error, isLoaded, svgBlobData, isLoadedJson, svgJsonData } =
      this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (
      !isLoaded &&
      svgBlobData === undefined &&
      !isLoadedJson &&
      svgJsonData === undefined
    ) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className={"container"}>
          <div style={{ position: "relative" }}>
            <div className={"navbar"}>
              <div className={"button-left"}>
                <button
                  onClick={() =>
                    this.inspectFeature(!this.props.inspectBoolean)
                  }
                >
                  Inspect
                </button>
              </div>
              <div className={"button-center"}>
                <button
                  className={"create-point"}
                  onClick={() => {
                    this.setState(
                      {
                        createElementBool: !this.state.createElementBool,
                      },
                      () => {
                        this.createSVGElement(
                          this.state.createElementBool,
                          "point"
                        );
                      }
                    );
                  }}
                >
                  Point
                </button>
                <button
                  className={"create-line"}
                  onClick={() => {
                    this.setState(
                      {
                        createElementBool: !this.state.createElementBool,
                      },
                      () => {
                        this.createSVGElement(
                          this.state.createElementBool,
                          "line"
                        );
                      }
                    );
                  }}
                >
                  Line
                </button>
                <button
                  className={"create-area"}
                  onClick={() => {
                    this.setState(
                      {
                        createElementBool: !this.state.createElementBool,
                      },
                      () => {
                        this.createSVGElement(
                          this.state.createElementBool,
                          "area"
                        );
                      }
                    );
                  }}
                >
                  Area
                </button>
              </div>
            </div>
            <div
              id={"mapContainer"}
              onMouseDown={this.handleEvent}
              onMouseUp={this.handleEvent}
              onMouseMove={this.handleEvent}
              onMouseLeave={this.handleEvent}
              onClick={this.getSVGElement}
              onTouchStart={this.handleEventTouch}
              onTouchEnd={this.handleEventTouch}
              onTouchMove={this.handleEventTouch}
            >
              <object
                id={"mapObjectId"}
                style={{ pointerEvents: "none" }}
                data={process.env.PUBLIC_URL + "/map.svg"}
                onLoad={this.getSVG}
                role="application"
                aria-label="Map"
              />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Map;
