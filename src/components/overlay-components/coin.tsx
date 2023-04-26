import { Sprite } from '@pixi/react';

interface CoinProps {
    position: [number, number],
    bet: number,
    isSelected: boolean,
    onSelect: (bet: number) => void
}

const path = '../../assets/Coins/';

// if selected then show shadow (подсветка)

const Coin:React.FC<CoinProps> = ({bet, position}) => (
    <Sprite
        image={`${path}${bet}.png`}
        position={position}
        roundPixels={true}
        // filters={[blurFilter, matrixFilter]}
        // подсветка если selected
    />
);