const canvas = document.getElementById("canvas-area");
const toolbox = document.getElementById('toolbox-panel');
const bgApply = document.getElementById("bg-apply");
const elementCreate = document.getElementById("element-create");
let activeElement;
const elementRegistry = [];
const elementSave = document.getElementById("element-save");
const elementDelete = document.getElementById("element-delete");
const elementRestore = document.getElementById("element-restore");
const shiftRight = document.getElementById("shift-right");
const shiftDown = document.getElementById("shift-down");
const centerHorizontal = document.getElementById("center-horizontal");
const menuToggle = document.querySelector('.menu-toggle');

let currentOffset;

const restoreElements = () => {
    const storedElements = sessionStorage.getItem("canvasElements");
    if (!storedElements) return;
    
    const parsedElements = JSON.parse(storedElements);
    for (let i = 0; i < parsedElements.length; i++){
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = parsedElements[i];
        const restoredElement = tempContainer.firstChild;
        canvas.appendChild(restoredElement);
        elementRegistry.push(restoredElement);
    } 
}

const adjustPosition = (event) => {
    const actionId = event.target.id;

    switch(actionId){
        case "shift-right":
            currentOffset = parseInt(activeElement.style.marginLeft) || 0;
            activeElement.style.marginLeft = `${currentOffset + 10}px`;
            break;
        case "center-horizontal":
            activeElement.style.marginInline = "auto";
            break;
        case "shift-down":
            currentOffset = parseInt(activeElement.style.marginTop) || 0;
            activeElement.style.marginTop = `${currentOffset + 10}px`;
    }
}

const updateBackground = () =>{
    const selectedColor = document.getElementById("canvas-background").value;
    canvas.style.backgroundColor = selectedColor;
}
bgApply.addEventListener("click", updateBackground);

const createElement = () => {
    const elementTag = document.getElementById("element-tag").value;
    const elementWidth = document.getElementById("element-width").value;
    const elementHeight = document.getElementById("element-height").value;
    const elementContent = document.getElementById("element-content").value;
    const elementBgColor = document.getElementById("element-bg-color").value;
    const elementTextColor = document.getElementById("element-text-color").value;
    const elementFontSize = document.getElementById("element-font-size").value;
    const elementPadding = document.getElementById("element-padding").value;
    const elementMargin = document.getElementById("element-margin").value;

    const element = document.createElement(elementTag);
    element.style.width = elementWidth ? `${elementWidth}px` : "auto";
    element.style.height = elementHeight ? `${elementHeight}px` : "auto";
    element.style.backgroundColor = elementBgColor;
    element.style.color = elementTextColor;
    element.style.fontSize = elementFontSize ? `${elementFontSize}px` : "inherit";
    element.style.padding = elementPadding ? `${elementPadding}px` : "0";
    element.style.margin = elementMargin ? `${elementMargin}px` : "0";
    element.innerHTML = elementContent;
    
    activeElement = element;
    canvas.appendChild(element);
    elementRegistry.push(element);
}

const saveElements = () => {
    const htmlElements = [];
    for (let i = 0; i < elementRegistry.length; i++){
        const serializedElement = elementRegistry[i].outerHTML;
        htmlElements.push(serializedElement);
    }    
    sessionStorage.setItem("canvasElements", JSON.stringify(htmlElements));
}

const deleteElement = () => {
    const currentElement = elementRegistry.pop();
    if (currentElement) {
        canvas.removeChild(currentElement);
    }
}

elementCreate.addEventListener("click", createElement);
elementSave.addEventListener("click", saveElements);
elementDelete.addEventListener("click", deleteElement);
elementRestore.addEventListener("click", restoreElements);
shiftRight.addEventListener("click", adjustPosition);
centerHorizontal.addEventListener("click", adjustPosition);
shiftDown.addEventListener("click", adjustPosition);
