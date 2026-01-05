import React, { useRef, useState } from "react";

interface Detection {
  label: string;
  confidence: number;
  bbox: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

interface Props {
  imageUrl: string;
  detections: Detection[];
}

const DetectionCanvas: React.FC<Props> = ({ imageUrl, detections }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSize, setImgSize] = useState({ width: 1, height: 1 });

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Uploaded"
        style={{ width: "100%", borderRadius: 8 }}
        onLoad={() => {
          if (imgRef.current) {
            setImgSize({
              width: imgRef.current.naturalWidth,
              height: imgRef.current.naturalHeight
            });
          }
        }}
      />

      {detections.map((d, i) => {
        if (!imgRef.current) return null;

        const scaleX =
          imgRef.current.clientWidth / imgSize.width;
        const scaleY =
          imgRef.current.clientHeight / imgSize.height;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.bbox.x1 * scaleX,
              top: d.bbox.y1 * scaleY,
              width: (d.bbox.x2 - d.bbox.x1) * scaleX,
              height: (d.bbox.y2 - d.bbox.y1) * scaleY,
              border: "2px solid red",
              color: "red",
              fontSize: 12,
              fontWeight: 600,
              pointerEvents: "none",
              boxSizing: "border-box"
            }}
          >
            {d.label} ({Math.round(d.confidence * 100)}%)
          </div>
        );
      })}
    </div>
  );
};

export default DetectionCanvas;
