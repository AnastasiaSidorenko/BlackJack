import { Container, Graphics, SimpleMesh, Sprite, Stage } from "@pixi/react";
import React, { useCallback, useEffect, useState } from "react";

// const { uvs, vertices, indices } = makeSimpleMeshData();

const BackGround:React.FC<SizeProps> = ({width, height}) => {
    return (
        <Sprite
            image={'./assets/background.png'}
            x={0}
            y={0}
            width={width}
            height={height}
        />
    );
};

export const Table:React.FC<SizeProps> = ({ width, height }) => {
    console.log("here");
    console.log("width", width);
    console.log("height", height);

    /* useEffect(() => {
        draw();
    }, [width, height]) */

    const drawOuter = useCallback((g: any) => {
        g.clear();
        g.moveTo(0, 0);
        g.beginFill(0x555555);
        g.lineTo(0, height / 2);
        g.bezierCurveTo(0, height * 1.1, width, height * 1.1, width, height / 2);
        g.lineTo(width, 0);
        g.lineTo(0, 0);
        g.endFill();
    }, [width, height]);

    const padding = 40;

    const drawInner = useCallback((g: any) => {
        g.clear();
        g.moveTo(padding, 0);
        g.beginFill(0x095525);
        g.lineTo(padding, height / 2);
        g.bezierCurveTo(padding, height, width - padding, height, width - padding, height / 2);
        g.lineTo(width - padding, 0);
        g.lineTo(padding, 0);
        g.endFill();
    }, [width, height]);

    return (
        <>
            <Graphics draw={drawOuter} />
            <Graphics draw={drawInner} />
        </>
    );
}

interface SizeProps {
    width: number;
    height: number;
}

export const Game:React.FC<SizeProps> = ({ ...props }) => {
    /* const [width, setWidth] = useState<number>();
    const [height, setHeight] = useState<number>()

    useEffect(() => {
        console.log("window", window.innerWidth);
        window.addEventListener('resize', handleResize);
        handleResize();
    }, []);

    const handleResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }; */

    /* <Sprite
                image={'./assets/table.png'}
                x={0}
                y={- window.innerHeight}
                width={window.innerWidth}
                height={window.innerHeight * 2}
            /> */

  return (
        <Container>
            <BackGround {...props }/>
            <Table {...props} />
        </Container>
  );
};
