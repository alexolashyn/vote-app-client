import { useState } from "react";

const GradientBox = ({ text, colorClass }) => {
    const [hoverStyle, setHoverStyle] = useState({});

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setHoverStyle({
            "--x": `${x}%`,
            "--y": `${y}%`,
        });
    };

    return (
        <div
            className={`box ${colorClass}`}
            style={hoverStyle}
            onMouseMove={handleMouseMove}
        >
            <span className="box-text">{text}</span>
        </div>
    );
};

export default GradientBox;
