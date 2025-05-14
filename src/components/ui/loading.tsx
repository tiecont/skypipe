const Loading = ({ width = 20, height = 20, stroke = '#000000' }) => (
    <svg
        viewBox='0 0 100 100'
        preserveAspectRatio='xMidYMid'
        width={width}
        height={height}
    >
        <g>
            <circle
                strokeDasharray='164.93361431346415 56.97787143782138'
                r={35}
                strokeWidth={3}
                stroke={stroke}
                fill='none'
                cy={50}
                cx={50}
            >
                <animateTransform
                    keyTimes='0;1'
                    values='0 50 50;360 50 50'
                    dur='1s'
                    repeatCount='indefinite'
                    type='rotate'
                    attributeName='transform'
                />
            </circle>
            <g />
        </g>
    </svg>
);
export default Loading;