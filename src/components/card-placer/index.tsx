import { Container, Graphics, Text } from "@pixi/react";
import { gsap } from "gsap";
import { Sprite, TextStyle } from "pixi.js";
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes, GameState, PositionProps, Seat, SizeProps, PositionType } from "../../types"
import { Card } from "./card";
import { useTick } from '@pixi/react';

const playerCardXOffset = 30;
const playerCardYOffset = 20;

const deltaCoefficient = 5;

// gsap.registerPlugin(MotionPathPlugin);

export const CardPlacers:React.FC<SizeProps> = ({width, height}) => {
    const player = useSelector((state: GameState) => state.player);

    const dispatch = useDispatch();
    const CardDeckPlacerPosition = {x: width - 104, y: 84 };

    const delay = 2 * 2;
    const total_seats = useSelector((state: GameState) => state.total_seats);
    const [countDown, setCountDown] = useState(total_seats* delay);
    const [startDealerCardsAnimation, setStartDealerCardsAnimation] = useState(false)

    useEffect(() => {
        dispatch({
            type: ActionTypes.PLACE_BET,
            payload: {
                value: 5
            }
        });
    }, []);

    const handleDealerCardAnimationEnd = () => {
        /* setTimeout(() => {
            dispatch({
                type: ActionTypes.WAIT_FOR_MOVE
            });
        }); */
    }

    /* useEffect(() => {
        setTimeout(() => {
            dispatch({
                type: ActionTypes.WAIT_FOR_MOVE
            });
        });
    }, []); */

    return (
        <Container sortableChildren>

             <Container position={CardDeckPlacerPosition} anchor={0.5} sortableChildren zIndex={1}>
                {<CardDeckPlacer />}
             </Container>

             {/*<Container anchor={0.5} sortableChildren zIndex={2}> 
                <DealerCardPlacer
                    cardDeckPosition={CardDeckPlacerPosition}
                    position={{ x: width / 2, y: 90 }}
                    startAnimation={startDealerCardsAnimation}
                    onAnimationEnd={handleDealerCardAnimationEnd}
                />
            </Container> */}

            <Container sortableChildren anchor={0.5}>
                <PlayerCardPlacer
                    cardDeckPosition={CardDeckPlacerPosition}
                    seat={player.seats[0]}
                    position={{ x: width / 2, y: height - 180 }}
                    onAnimationEnd={() => setStartDealerCardsAnimation(true)}
                />
            </Container>
        </Container>
    );
}

export const PlayerCardPlacer:React.FC<{seat: Seat; onAnimationEnd: () => void} & cardDeckPositionProps & PositionProps> = ({cardDeckPosition, seat, position, onAnimationEnd}) => {
    let i = 0;
    const { card_points, cards } = seat;

    const [finalCoords, setFinalCoords] = useState<Array<PositionType>>([]);

    const isCardPositionsValid = cardDeckPosition.x > 0;

    console.log("finalCoords", finalCoords);
    const [cardsCurrentPositions, setCardsCurrentPositions] = useState<Array<PositionType>>();
    const [animatedCards, setAnimatedCards] = useState<number>(0);

    useEffect(() => {
        if (isCardPositionsValid) {
            setFinalCoords([getFinalPosition(0), getFinalPosition(1)]);
            setCardsCurrentPositions([cardDeckPosition, cardDeckPosition]);
            console.log("getFinalPosition(0), getFinalPosition(1)", getFinalPosition(0), getFinalPosition(1));
        }
    }, [isCardPositionsValid]);

    const getFinalPosition = (idx: number) => {
        return {
            x: position.x + idx * playerCardXOffset,
            y: position.y - idx * playerCardYOffset
        }
    }

    useTick((delta) => {
        if (isCardPositionsValid && cards.length > animatedCards && cardsCurrentPositions?.length && finalCoords.length) {
            i += deltaCoefficient * delta;
            console.log("!!!!!");
            // onAnimationEnd
            const currentCoords = cardsCurrentPositions[animatedCards];
            console.log("currentCoords", currentCoords);
            if (currentCoords.x > finalCoords[animatedCards].x) {
                currentCoords.x = currentCoords.x - i;
            }
            if (currentCoords.y < finalCoords[animatedCards].y) {
                currentCoords.y = currentCoords.y + i;
            }
            console.log("NEW currentCoords", currentCoords)
            setCardsCurrentPositions(prev => {
                prev![animatedCards] = currentCoords;
                console.log("prev", prev);
                return prev;
            });
            console.log("finalCoords[animatedCards].x", finalCoords[animatedCards].x);
            if (isCardPositionsValid && currentCoords.x <= finalCoords[animatedCards].x) {
                if (animatedCards + 1 === 2) {
                    onAnimationEnd();
                }
                setAnimatedCards(prev => prev + 1);
                i = 0;
            }
        }
    });

    useEffect(() => {
        i = 0;
        if (cards.length > 2) {
            const newCardsQ = cards.length - animatedCards;
            const newFinalPositions:PositionType[] = [];
            for(let i = 0; i < newCardsQ; i++) {
                newFinalPositions.push(getFinalPosition(cards.length - 1 - i));
            }
            console.log("newFinalPositions", newFinalPositions);
            // setFinalCoords(prev => [...prev, getFinalPosition(cards.length - 1)]);
            setFinalCoords(prev => [...prev, ...newFinalPositions]);
        }
    }, [cards.length])

    // TODO animation on cards
    // <Container pointerdown={onClick} position={{x: width/2, y: height/2}} anchor={0.5} interactive>
    return (
        <>
            {cards.map((card, idx) => (
                <Card
                    key={`${idx}-${card.suit}-${card.value}`}
                    card={card}
                    position={cardsCurrentPositions[idx] || cardDeckPosition}
                    // position={{ x: idx * playerCardXOffset, y: -idx * playerCardYOffset }}
                    zIndex={idx + 1}
                />
            ))}
            {animatedCards >=2 && <CardPoints points={card_points} position={{ x: position.x, y: position.y + 70}}/> }
        </>
    );
}

interface cardDeckPositionProps {
    cardDeckPosition: {
        x: number;
        y: number
    },
    startAnimation?: boolean;
    onAnimationEnd: () => void;
}

export const DealerCardPlacer:React.FC<cardDeckPositionProps & PositionProps> = ({cardDeckPosition, position, startAnimation, onAnimationEnd}) => {
    let i = 0;
    const dealer = useSelector((state: GameState) => state.dealer);
    const { cards, card_points } = dealer;

    const finalCoords = {
        visible: {x: position.x - 45, y: position.y},
        hidden: {x: position.x + 45, y: position.y}
    }

    const cardPointsCoords = {
        x: position.x,
        y: position.y - 70
    }

    /* const cardsCurrentCoords = {
        visible: {
            x: cardDeckPosition.x,
            y: cardDeckPosition.y
        },
        hidden: {
            x: cardDeckPosition.x,
            y: cardDeckPosition.y
        } 
    } */

    const [visibleCardX, setVisibleCardX] = useState<number>(cardDeckPosition.x);
    const [visibleCardY, setVisibleCardY] = useState<number>(cardDeckPosition.y);
    const [visibleCardBeenAnimated, setVisibleCardBeenAnimated] = useState(false);
    const [visibleCardBackSided, setVisibleCardBackSided] = useState(true);
    const visibleCardPathCenter = (cardDeckPosition.x + finalCoords.visible.x) / 2;

    const [hiddenCardX, setHiddenCardX] = useState<number>(cardDeckPosition.x);
    const [hiddenCardY, setHiddenCardY] = useState<number>(cardDeckPosition.y);

    useEffect(() => {
        setVisibleCardX(cardDeckPosition.x);
        setHiddenCardX(cardDeckPosition.x);
    }, [cardDeckPosition]);

    const visibleCardAnimationEnd = visibleCardX > 0 && visibleCardX <= finalCoords.visible.x;
    const hiddenCardAnimationEnd = hiddenCardX <= finalCoords.hidden.x;

    useEffect(() => {
        if (hiddenCardAnimationEnd) {
            onAnimationEnd();
        }
    }, [hiddenCardAnimationEnd]);

    useEffect(() => {
        setVisibleCardBeenAnimated(true);
        i = 0;
    }, [visibleCardAnimationEnd]);

    useTick(delta => {
        if (startAnimation) {
            i += deltaCoefficient * delta;
            console.log("i", i);
            console.log("visibleCardBeenAnimated", visibleCardBeenAnimated);
            if (!visibleCardBeenAnimated) {
                console.log("here");
                if (visibleCardX > finalCoords.visible.x) {
                    setVisibleCardX(visibleCardX - i);
                }
                if (visibleCardY < finalCoords.visible.y) {
                    setVisibleCardY(visibleCardY + i * 0.1);
                }
                if (visibleCardX < visibleCardPathCenter) {
                    setVisibleCardBackSided(false);
                }

                /* if (visibleCardX <= finalCoords.visible.x) {
                    console.log("HERE");
                    setVisibleCardBeenAnimated(true);
                    i = 0;
                } */
            } else {
                console.log("HIDDEN");
                console.log("hiddenCardX", finalCoords.hidden.x);
                console.log("hiddenCardX", hiddenCardX);
                if (hiddenCardX > finalCoords.hidden.x) {
                    setHiddenCardX(hiddenCardX - i);
                }
                if (hiddenCardY < finalCoords.hidden.y) {
                    setHiddenCardY(hiddenCardY + i * 0.1);
                }
            }
        }
    });

    console.log("cards", cards);
    return (
        <>
            { cards.length === 2 &&
                <> 
                    {visibleCardBeenAnimated && <CardPoints points={card_points} position={cardPointsCoords} />}
                    <Card zIndex={5}
                        card={cards[0]}
                        isBack={visibleCardBackSided}
                        position={{x: visibleCardX, y: visibleCardY}}
                    />
                    <Card
                        card={cards[1]}
                        isBack={true}
                        position={{x: hiddenCardX, y: hiddenCardY}}
                    />
                </>
            }
        </>
    )
}

export const CardDeckPlacer:React.FC = () => {
    const cards = [];

    for(let i = 0; i < 8; i++) {
        cards.push(
            <Card
                isBack={true}
                position={{ x: - i * 2, y: i * 2 }}
                key={i}
                zIndex={9 - i}
            />
        );
    }   

    return (
        <>
            {cards}
        </>
    );
}

export const CardPoints:React.FC<{points: number} & PositionProps> = ({points, position}) => {
    return (
        <Text
            text={points.toString()}
            style={
                new TextStyle({
                    align: 'center',
                    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                    fill: ['#ffffff'], // gradient,
                    fontSize: 18
                })
            }
            anchor={0.5}
            position={position}
        />
    )
}

/* const Tween = ({ duration, children, yoyo = false, repeat = -1, ease = 'none' }) => {
  const [p, setP] = useState(0);
  
  useEffect(() => {
    const t = { progress: 0 };
    const tween = gsap.to(t, {
      duration,
      progress: 1,
      yoyo,
      repeat,
      ease,
      onUpdate: () => setP(t.progress)
    });
    
    return () => tween.kill();
  }, []);
  
  return children(p);
}

// ----------------------
// simple motion path component
// ----------------------

const MotionPath = ({ path, progress, children, autoRotate = true }) => {  
  const m = (x, y, rotation) => ({ x, y, rotation });
  const tween = useRef();
  const [motion, setMotion] = useState(m(0, 0, 0));
  
  useEffect(() => {
    const t = {
      x: 0,
      y: 0,
      rotation: 0,
    };
    
    tween.current = gsap.to(t, { 
      duration: 1, 
      ease: 'none',
      paused: true,
      motionPath: {
        path,
        autoRotate,
        type: 'cubic',
        useRadians: true,
      },
      onUpdate: () => setMotion(m(t.x, t.y, t.rotation))
    });
    
    return () => tween.current.kill();
  }, [path]);
  
  useEffect(() => {
    tween.current.progress(progress);
  }, [progress]);
  
  return children(motion);
}; */