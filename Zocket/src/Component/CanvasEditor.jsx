import React, { useRef, useEffect, useState } from "react";
import { LuImagePlus } from "react-icons/lu";

const templateData = {
  caption: {
    text: "1 & 2 BHK Luxury Apartments at just Rs.34.97 Lakhs",
    position: { x: 50, y: 50 },
    max_characters_per_line: 31,
    font_size: 44,
    alignment: "center",
    text_color: "#FFFFFF",
  },
  cta: {
    text: "Shop Now",
    position: { x: 190, y: 320 },
    text_color: "#FFFFFF",
    background_color: "#000000",
    font_size: 30,
    wrap_length: 200,
    padding: 24,
    border_radius: 15,
  },
  image_mask: {
    x: 56,
    y: 442,
    width: 970,
    height: 600,
  },
  urls: {
    mask: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png?random=12345",
    stroke:
      "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png?random=12345",
    design_pattern:
      "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png?random=12345",
  },
  background_color: "#0369A1",
};
const defaultImageUrl =
  "https://wallpapers.com/images/featured/kfc-gxi9z9gm4o78gsh7.jpg";
function CanvasEditor() {
  const canvasRef = useRef(null);
  const [caption, setCaption] = useState(templateData.caption.text);
  const [cta, setCta] = useState(templateData.cta.text);
  const [background, setBackground] = useState(templateData.background_color);
  const [image, setImage] = useState(new Image());
  const [uploadedImage, setUploadedImage] = useState(null);
  const [maskImage, setMaskImage] = useState(new Image());
  const [maskStrokeImage, setMaskStrokeImage] = useState(new Image());
  const [recentColors, setRecentColors] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    image.src = templateData.urls.design_pattern;
    image.onload = () => {
      drawCanvas();
    };

    const defaultImage = new Image();
    defaultImage.src = defaultImageUrl;
    defaultImage.onload = () => {
      setUploadedImage(defaultImage);
    };
    maskImage.src = templateData.urls.mask;
    maskImage.onload = () => {
      drawCanvas();
    };

    maskStrokeImage.src = templateData.urls.stroke;
    maskStrokeImage.onload = () => {
      drawCanvas();
    };
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [caption, cta, background, uploadedImage]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      maskImage,
      templateData.image_mask.x,
      templateData.image_mask.y,
      templateData.image_mask.width,
      templateData.image_mask.height
    );

    ctx.drawImage(
      maskStrokeImage,
      templateData.image_mask.x,
      templateData.image_mask.y,
      templateData.image_mask.width,
      templateData.image_mask.height
    );

    if (uploadedImage) {
      ctx.drawImage(
        uploadedImage,
        templateData.image_mask.x,
        templateData.image_mask.y,
        templateData.image_mask.width,
        templateData.image_mask.height
      );
    }

    ctx.fillStyle = templateData.caption.text_color;
    ctx.font = `${templateData.caption.font_size}px Arial`;
    wrapText(ctx, caption, 500, 200, 970, templateData.caption.font_size);

    drawCTA(ctx);
  };

  function drawCTA(ctx) {
    const x = templateData.cta.position.x - templateData.cta.padding;
    const y = templateData.cta.position.y - templateData.cta.padding;
    const width = templateData.cta.wrap_length + 2 * templateData.cta.padding;
    const height = templateData.cta.font_size + 2 * templateData.cta.padding;

    ctx.fillStyle = templateData.cta.background_color;
    roundRect(
      ctx,
      x,
      y,
      width,
      height,
      templateData.cta.border_radius,
      true,
      false
    );

    ctx.font = `${templateData.cta.font_size}px Arial`;
    ctx.fillStyle = templateData.cta.text_color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cta, x + width / 2, y + height / 2);
  }

  function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function handleColorChange(color) {
    setBackground(color);
    setRecentColors((prevColors) => [
      ...new Set([color, ...prevColors].slice(0, 5)),
    ]);
    setShowColorPicker(false);
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + " ";
      let metrics = context.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  return (
    <div className="flex justify-around flex-wrap md:flex-nowrap bg-white rounded-lg shadow-lg p-4">
      <canvas
        ref={canvasRef}
        width={1080}
        height={1080}
        style={{ width: "400px", height: "400px" }}
      ></canvas>
      <div className="w-full md:w-1/2 p-4 space-y-4">
        <h1 className="font-bold text-center text-[32px]">Ad Customization</h1>
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
              className="flex gap-5 items-center p-2 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50"
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
          <div>
            <div className="items-center p-2 border mt-4 border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50">
              {" "}
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="items-center p-2 border mt-4 border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50">
              {" "}
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
              />
            </div>
            <div className="mt-4">
              {recentColors.map((color) => (
                <button
                  key={color}
                  style={{
                    backgroundColor: color,
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    margin: "2px",
                  }}
                  onClick={() => setBackground(color)}
                />
              ))}
              <button
                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium leading-none text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setShowColorPicker(true)}
              >
                +
              </button>
              {showColorPicker && (
                <input
                  type="color"
                  value={background}
                  onChange={(e) => handleColorChange(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanvasEditor;
