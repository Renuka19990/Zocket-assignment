import React, { Component } from "react";
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
  "https://img.freepik.com/premium-photo/illustration-cup-hot-chocolate-with-blurry-environment-creating-cozy-atmosphere-generative-ai_1062399-718.jpg?w=740";

class CanvasEditor extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      caption: templateData.caption.text,
      cta: templateData.cta.text,
      background: templateData.background_color,
      image: new Image(),
      uploadedImage: null,
      maskImage: new Image(),
      maskStrokeImage: new Image(),
      design_pattern: new Image(),
      recentColors: [],
      showColorPicker: false,
    };
  }

  componentDidMount() {
    const { image, maskImage, maskStrokeImage } = this.state;
    image.src = templateData.urls.design_pattern;
    image.onload = () => {
      this.drawCanvas();
    };

    const defaultImage = new Image();
    defaultImage.src = defaultImageUrl;
    defaultImage.onload = () => {
      this.setState({ uploadedImage: defaultImage });
    };

    maskImage.src = templateData.urls.mask;
    maskImage.onload = () => {
      this.drawCanvas();
    };

    maskStrokeImage.src = templateData.urls.stroke;
    maskStrokeImage.onload = () => {
      this.drawCanvas();
    };
  }

  componentDidUpdate() {
    this.drawCanvas();
  }

  drawCanvas() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    const {
      caption,
      cta,
      background,
      image,
      uploadedImage,
      maskImage,
      maskStrokeImage,
      design_pattern,
    } = this.state;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Background color
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //design pattern
    ctx.drawImage(
      design_pattern,
      templateData.image_mask.x,
      templateData.image_mask.y,
      templateData.image_mask.width,
      templateData.image_mask.height
    );
    //mask
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      maskImage,
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
    //mask stroke

    ctx.drawImage(maskStrokeImage, 0, 10, 1080, 1070);

    //texts
    ctx.fillStyle = templateData.caption.text_color;
    ctx.font = `${templateData.caption.font_size}px Arial`;
    this.wrapText(ctx, caption, 390, 140, 600, templateData.caption.font_size);

    this.drawCTA(ctx);
  }

  drawCTA(ctx) {
    const { cta } = this.state;
    const x = templateData.cta.position.x - templateData.cta.padding * 4;
    const y = templateData.cta.position.y - templateData.cta.padding * 3.2;
    const width = templateData.cta.wrap_length + 2 * templateData.cta.padding;
    const height = templateData.cta.font_size + 2 * templateData.cta.padding;

    ctx.fillStyle = templateData.cta.background_color;
    this.roundRect(
      ctx,
      90,
      240,
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

  roundRect(ctx, x, y, width, height, radius, fill, stroke) {
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

  handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.setState({ uploadedImage: img });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  handleColorChange(color) {
    this.setState({
      background: color,
      recentColors: [color, ...this.state.recentColors.slice(0, 4)],
      showColorPicker: false,
    });
  }

  wrapText(context, text, x, y, maxWidth, lineHeight) {
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

  render() {
    const { caption, cta, recentColors, showColorPicker, background } =
      this.state;
    return (
      <div className="flex justify-around flex-wrap md:flex-nowrap bg-white rounded-lg shadow-lg p-4">
        <canvas
          ref={this.canvasRef}
          width={1080}
          height={1080}
          style={{ width: "400px", height: "400px" }}
        ></canvas>
        <div className="w-full md:w-1/2 p-4 space-y-4">
          <h1 className="font-bold text-center text-[32px]">
            Ad Customization
          </h1>
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
                onChange={this.handleImageUpload.bind(this)}
              />
            </div>
            <div>
              <div className="items-center p-2 border mt-4 border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50">
                {" "}
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => this.setState({ caption: e.target.value })}
                />
              </div>

              <div className="items-center p-2 border mt-4 border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50">
                {" "}
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => this.setState({ cta: e.target.value })}
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
                    onClick={() => this.setState({ background: color })}
                  />
                ))}
                <button
                  className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium leading-none text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => this.setState({ showColorPicker: true })}
                >
                  +
                </button>
                {showColorPicker && (
                  <input
                    type="color"
                    value={background}
                    onChange={(e) => this.handleColorChange(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasEditor;
