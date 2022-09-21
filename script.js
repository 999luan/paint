const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveImg = document.querySelector(".save-img"),
  ctx = canvas.getContext("2d");

//variaveis globais com valor inicial
let prevMouseX,
  prevMouseY,
  snapshot,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = 5,
  selectedColor = "#000";
const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

//desenhando formas
const drawRect = (e) => {
  if (!fillColor.checked) {
    //metodo desenha retangulo
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  //metodo preenche retangulo
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

const drawCircle = (e) => {
  //cria caminho para desenhar circulo
  ctx.beginPath();

  //raio do circulo de acordo com o ponteiro
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  // conditional render (if) com check no fillcolor
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
  //cria caminho para desenhar triangulo
  ctx.beginPath();
  //move triangulo para o mouse
  ctx.moveTo(prevMouseX, prevMouseY);
  //cria linha de acordo com o ponteiro
  ctx.lineTo(e.offsetX, e.offsetY);
  //cria base do triangulo
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  //conecta os dois pontos com uma linha terminando o triangulo
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};
//posso criar metodo que desenha linha reta
// const drawLine = (e) => {
//     //cria caminho para desenhar linha reta
//     ctx.beginPath();
//     //move triangulo para o mouse
//     ctx.moveTo(prevMouseX, prevMouseY);
//     //cria linha de acordo com o ponteiro
//     ctx.lineTo(e.offsetX, e.offsetY);
//     ctx.stroke();
//   };

//funcoes de desenhar
const startDraw = (e) => {
  isDrawing = true;
  //mouseX se torna valor PrevMouseX
  prevMouseX = e.offsetX;
  //mouseX se torna valor PrevMousey
  prevMouseY = e.offsetY;
  // cria novo caminho (impede bug de redesenhar trajeto do mouse)
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  //seleciona as cores e passa elas como linha e preenchimento
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;

  //copia dados do canvas e passa como valor de snpashot para evitar que a imagem seja arrastada
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};
const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0); //adiciona o canvas copiado acima nesse canvas

  if (selectedTool === "brush" || selectedTool === "eraser") {
    //conditional render que muda a cor para branco caso a ferramenta selecionada seja borracha
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); // metodo cria linha nas cordenadas de evento do click
    ctx.stroke(); //metodo que preenche linha com cor
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else if (selectedTool === "triangle") {
    drawTriangle(e);
  }
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    //remove classe ativa e adiciona na opcao clicada
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});
//valor do brush definido pelo sizeSlider
sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));

//click evento para cada um dos botoes
colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    //remove classe ativa e adiciona na opcao clicada
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");

    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});
colorPicker.addEventListener("change", () => {
  //envia a cor selecionada ao elemento pai do colorpicker
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  //limpa o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});
saveImg.addEventListener("click", () => {
  //salva imagem
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mousemove", drawing);
