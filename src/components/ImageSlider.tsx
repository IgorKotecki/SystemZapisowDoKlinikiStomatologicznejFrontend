import React, { useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../utils/colors';
import { useTranslation } from 'react-i18next';

interface ImageSliderProps {
    beforeImage: string;
    afterImage: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ beforeImage, afterImage }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        let position = (x / rect.width) * 100;
        if (position < 0) position = 0;
        if (position > 100) position = 100;
        setSliderPos(position);
    };

    const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

    return (
        <Box
            ref={containerRef}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
            sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 800,
                height: 450,
                overflow: 'hidden',
                borderRadius: 4,
                boxShadow: 3,
                cursor: 'col-resize',
                userSelect: 'none',
                margin: '0 auto'
            }}
        >
            <Box
                component="img"
                src={afterImage}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${sliderPos}%`,
                    height: '100%',
                    overflow: 'hidden',
                    borderRight: `3px solid ${colors.white}`
                }}
            >
                <Box
                    component="img"
                    src={beforeImage}
                    sx={{
                        width: containerRef.current?.offsetWidth || 800,
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                    }}
                />
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: `${sliderPos}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 40,
                    height: 40,
                    backgroundColor: colors.white,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 2,
                    pointerEvents: 'none',
                    zIndex: 10
                }}
            >
                <Box sx={{ width: 2, height: 20, backgroundColor: colors.color3, mx: 0.5 }} />
                <Box sx={{ width: 2, height: 20, backgroundColor: colors.color3, mx: 0.5 }} />
            </Box>

            <Typography
                variant="caption"
                sx={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    px: 1,
                    borderRadius: 1
                }}
            >
                {t('components.before')}
            </Typography>
            <Typography
                variant="caption"
                sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    px: 1,
                    borderRadius: 1
                }}
            >
                {t('components.after')}
            </Typography>
        </Box>
    );
};

export default ImageSlider;