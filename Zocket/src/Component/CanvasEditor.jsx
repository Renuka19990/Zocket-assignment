import React, { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color";
import { LuImagePlus } from "react-icons/lu";

const templateData = {
  caption: {
    text: "1 & 2 BHK Luxury Apartments at just Rs.34.97 Lakhs",
    position: { x: 50, y: 50 },
    max_characters_per_line: 31,
    font_size: 44,
    alignment: "left",
    text_color: "#FFFFFF",
  },
  cta: {
    text: "Shop Now",
    position: { x: 190, y: 320 },
    text_color: "#FFFFFF",
    background_color: "#000000",
  },
  image_mask: {
    x: 56,
    y: 442,
    width: 970,
    height: 600,
  },
  urls: {
    mask: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png",
    stroke:
      "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png",
    design_pattern:
      "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png",
  },
};

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const [adContent, setAdContent] = useState(templateData.caption.text);
  const [ctaText, setCtaText] = useState("Contact Us");
  const [imageSrc, setImageSrc] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [pickedColors, setPickedColors] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [rectangleColor, setRectangleColor] = useState(
    pickedColors[0] || "#0369A1"
  );
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawCanvas(ctx);
  }, [adContent, ctaText, imageSrc, backgroundColor, rectangleColor]);


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };


  const drawCanvas = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawBackgroundLines(ctx);
    drawImage(ctx);
    drawAdContent(ctx);
    drawCTA(ctx);
    ctx.font = `${templateData.caption.font_size}px Arial`;
    ctx.fillStyle = templateData.caption.text_color;
  };



  const drawBackgroundLines = (ctx) => {
    const lineCount = 20;
    const lineSpacing = ctx.canvas.width / lineCount;

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.5;

    for (let i = 0; i <= lineCount; i++) {
      let x = lineSpacing * i;
      ctx.moveTo(-300, 0);
      ctx.lineTo(x, ctx.canvas.width / 3);
    }

    ctx.stroke();
  };



  const toggleColorPicker = () => setShowColorPicker(!showColorPicker);
  const drawAdContent = (ctx) => {
    ctx.beginPath();
    const offset = 80;

    ctx.beginPath();
    ctx.moveTo(290 + 30 + offset, 0);
    ctx.lineTo(180 + 300 - 30 + offset, 0);
    ctx.arcTo(180 + 300 + offset, 0, 180 + 300 + offset, 30, 30);
    ctx.lineTo(180 + 300 + offset, 300 - 30);
    ctx.arcTo(180 + 300 + offset, 300, 180 + 300 - 30 + offset, 300, 30);
    ctx.lineTo(180 + 30 + offset, 300);
    ctx.arcTo(180 + offset, 300, 180 + offset, 300 - 30, 30);
    ctx.lineTo(180 + offset, 30);
    ctx.arcTo(180 + offset, 0, 180 + 30 + offset, 0, 30);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(60, -180);
    ctx.lineTo(540, 300);
    ctx.lineWidth = 250;
    ctx.strokeStyle = rectangleColor;
    ctx.stroke();

    ctx.fillStyle = "#000";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";

    const maxCharactersPerLine = 31;
    const lines = getLines(
      ctx,
      adContent,
      ctx.canvas.width / 2,
      maxCharactersPerLine
    );

    let startY = 280;
    const lineHeight = 22;

    lines.forEach((line, index) => {
      ctx.fillText(line, ctx.canvas.width / 5, startY + index * lineHeight);
    });

    ctx.fillStyle = rectangleColor;
    ctx.fill();
  };



  const drawImage = (ctx) => {
    if (imageSrc) {
      const img = new Image();
      img.onload = () => {
        const scaleFactor = 0.65;

        const scale = Math.min(
          (ctx.canvas.width / img.width) * scaleFactor,
          (ctx.canvas.height / img.height) * scaleFactor
        );

        const x = (ctx.canvas.width * scale) / 2;
        const y = (ctx.canvas.height - img.height * scale) / 6;

        ctx.save();

        const roundedCorner = 20;
        ctx.beginPath();
        ctx.moveTo(x + roundedCorner, y);
        ctx.arcTo(
          x + img.width * scale,
          y,
          x + img.width * scale,
          y + img.height * scale,
          roundedCorner
        );
        ctx.arcTo(
          x + img.width * scale,
          y + img.height * scale,
          x,
          y + img.height * scale,
          roundedCorner
        );
        ctx.arcTo(x, y + img.height * scale, x, y, roundedCorner);
        ctx.arcTo(x, y, x + img.width * scale, y, roundedCorner);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        ctx.restore();
      };
      img.src = imageSrc;
    }
  };



  const drawCTA = (ctx) => {
    const buttonWidth = 170;
    const buttonHeight = 40;
    const borderRadius = 20;
    const buttonX = ctx.canvas.width - buttonWidth - 70;
    const buttonY = ctx.canvas.height * 0.76;

    ctx.beginPath();
    ctx.moveTo(buttonX + borderRadius, buttonY);
    ctx.lineTo(buttonX + buttonWidth - borderRadius, buttonY);
    ctx.quadraticCurveTo(
      buttonX + buttonWidth,
      buttonY,
      buttonX + buttonWidth,
      buttonY + borderRadius
    );
    ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - borderRadius);
    ctx.quadraticCurveTo(
      buttonX + buttonWidth,
      buttonY + buttonHeight,
      buttonX + buttonWidth - borderRadius,
      buttonY + buttonHeight
    );
    ctx.lineTo(buttonX + borderRadius, buttonY + buttonHeight);
    ctx.quadraticCurveTo(
      buttonX,
      buttonY + buttonHeight,
      buttonX,
      buttonY + buttonHeight - borderRadius
    );
    ctx.lineTo(buttonX, buttonY + borderRadius);
    ctx.quadraticCurveTo(buttonX, buttonY, buttonX + borderRadius, buttonY);
    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      ctaText,
      buttonX + buttonWidth / 2,
      buttonY + buttonHeight / 2
    );
  };




  function getLines(ctx, text, maxWidth, maxCharactersPerLine) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      const length = (currentLine + " " + word).length;

      if (width < maxWidth && length < maxCharactersPerLine) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  
  

  const handleRectangleColorChange = (color) => {
    const newPickedColors = [color.hex, ...pickedColors].slice(0, 5);
    setPickedColors(newPickedColors);
    setRectangleColor(color.hex);
  };

  const handleSwatchClick = (color) => {
    setRectangleColor(color);
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-center items-center w-full md:w-1/2 bg-gray-100 rounded-lg mb-4 md:mb-0 p-2">
        <canvas
          ref={canvasRef}
          width="640"
          height="360"
          className="rounded-lg"
        />
      </div>
      <div className="w-full md:w-1/2 p-4 space-y-4">
        <h1 className=" font-bold text-center text-[32px]">Ad Customization</h1>
        <p className="text-center text-gray-400 text-[22px] mb-[50px]">
          Customize your ad and get the templates accordingly
        </p>
        <div>
          <label
            htmlFor="imageUpload"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Image
          </label>
          <div className="mt-1 block w-full">
            <label
              className="flex  gap-5 items-center p-2 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50"
              htmlFor="imageUpload"
            >
              <LuImagePlus />
              <span className="block text-sm text-gray-900">
                Change the ad Creative image
              </span>
              <p className="text-blue-500 underline">Select File</p>
            </label>
            <input
              id="imageUpload"
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="adContent"
            className="block text-sm font-medium text-gray-700"
          >
            Ad Content
          </label>
          <input
            id="adContent"
            type="text"
            value={adContent}
            onChange={(e) => setAdContent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="ctaText"
            className="block text-sm font-medium text-gray-700"
          >
            CTA Text
          </label>
          <input
            id="ctaText"
            type="text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Choose Color
          </label>
          <div className="flex items-center mt-1">
            {pickedColors.map((color, index) => (
              <button
                key={index}
                className="w-6 h-6 rounded-full border border-gray-300 mr-2"
                style={{ backgroundColor: color }}
                onClick={() => handleSwatchClick(color)}
              />
            ))}
            <button
              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium leading-none text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={toggleColorPicker}
            >
              +
            </button>
          </div>
          {showColorPicker && (
            <div className="absolute mt-2">
              <SketchPicker
                color={rectangleColor}
                onChangeComplete={handleRectangleColorChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
