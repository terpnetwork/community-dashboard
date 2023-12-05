import React, { useEffect } from 'react';
import styled from 'styled-components';

const Blur = styled.div`
    height: 100%;
    width: 100%;
    position: fixed;
    backdrop-filter: blur(12vmax);
    z-index: 1;
`;

const Blob = styled.div`
    @keyframes rotate {
        from {
            rotate: 0deg;
        }

        50% {
            scale: 1 1.5;
        }

        to {
            rotate: 360deg;
        }
    }
    height: 30vmax;
    aspect-ratio: 1;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: linear-gradient(
        108.46deg,
        rgb(94, 230, 208) 12.51%,
        rgb(191, 198, 255) 51.13%,
        rgb(255, 186, 105) 87.49%
    );
    animation: rotate 20s infinite;
    opacity: 0.30;
`;

export default function StyledPointer( ) {
    useEffect(() => {
        const blob = document.getElementById('blob');

        window.onpointermove = (event) => {
            const { clientX, clientY } = event;

            blob?.animate(
                {
                    left: `${clientX}px`,
                    top: `${clientY}px`,
                },
                { duration: 6000, fill: 'forwards' }
            );
        };
    }, []);

    return (
        <div className='behind-content'>
            <Blur></Blur>
            <Blob id='blob'></Blob>
        </div>
    );
}
