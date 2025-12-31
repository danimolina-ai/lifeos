import React from 'react';

/**
 * RadarChart - Football Stats Style
 * Sectors are PERFECTLY bounded by divider lines
 */
const RadarChart = ({
    data = {},
    areas = [],
    size = 400,
    showLabels = true,
    showValues = false
}) => {
    const center = size / 2;
    const outerRadius = size * 0.48;
    const radarRadius = size * 0.40;
    const labelRadius = size * 0.44;
    const innerRadius = size * 0.065;

    const fillColor = '#22d3ee';

    const areaScores = areas.map(area => {
        const score = data[area.areaId] || data[area.id] || 0;
        return Math.min(100, Math.max(0, score));
    });

    const n = areas.length || 1;
    const sectorAngle = (Math.PI * 2) / n;

    // The divider line has visual width - calculate the angular gap it creates
    const dividerStrokeWidth = 5;
    // Convert stroke width to angular offset at the radar radius
    const angularGap = Math.atan2(dividerStrokeWidth / 2, radarRadius);

    // Sector path - fits EXACTLY between two divider lines
    const getSectorPath = (index, score) => {
        // Divider i is at angle: (index * sectorAngle) - PI/2
        // Divider i+1 is at angle: ((index+1) * sectorAngle) - PI/2
        // Sector fills the space BETWEEN them, offset by the divider's angular width

        const divAngle0 = (index * sectorAngle) - Math.PI / 2;
        const divAngle1 = ((index + 1) * sectorAngle) - Math.PI / 2;

        // Start just after divider 0, end just before divider 1
        const startA = divAngle0 + angularGap * 2;
        const endA = divAngle1 - angularGap * 2;

        const outerR = Math.max(innerRadius, (score / 100) * radarRadius);

        // Inner arc (at center circle edge)
        const ix1 = center + innerRadius * Math.cos(startA);
        const iy1 = center + innerRadius * Math.sin(startA);
        const ix2 = center + innerRadius * Math.cos(endA);
        const iy2 = center + innerRadius * Math.sin(endA);

        // Outer arc
        const ox1 = center + outerR * Math.cos(startA);
        const oy1 = center + outerR * Math.sin(startA);
        const ox2 = center + outerR * Math.cos(endA);
        const oy2 = center + outerR * Math.sin(endA);

        return `M ${ix1} ${iy1} L ${ox1} ${oy1} A ${outerR} ${outerR} 0 0 1 ${ox2} ${oy2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 0 0 ${ix1} ${iy1} Z`;
    };

    const getLabelArcPath = (index) => {
        const divAngle0 = (index * sectorAngle) - Math.PI / 2;
        const divAngle1 = ((index + 1) * sectorAngle) - Math.PI / 2;

        const startA = divAngle0 + angularGap * 2;
        const endA = divAngle1 - angularGap * 2;

        const midAngle = (startA + endA) / 2;
        const isBottom = midAngle > 0 && midAngle < Math.PI;

        const x1 = center + labelRadius * Math.cos(startA);
        const y1 = center + labelRadius * Math.sin(startA);
        const x2 = center + labelRadius * Math.cos(endA);
        const y2 = center + labelRadius * Math.sin(endA);

        if (isBottom) {
            return `M ${x2} ${y2} A ${labelRadius} ${labelRadius} 0 0 0 ${x1} ${y1}`;
        }
        return `M ${x1} ${y1} A ${labelRadius} ${labelRadius} 0 0 1 ${x2} ${y2}`;
    };

    const gridLevels = [25, 50, 75, 100];
    const avgScore = areaScores.length > 0
        ? Math.round(areaScores.reduce((a, b) => a + b, 0) / areaScores.length)
        : 0;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
            <defs>
                {areas.map((_, i) => (
                    <path
                        key={`lp-${i}`}
                        id={`labelArc-${i}`}
                        d={getLabelArcPath(i)}
                        fill="none"
                    />
                ))}
            </defs>

            {/* Outer ring for labels */}
            <circle
                cx={center} cy={center} r={outerRadius}
                fill="#080c16" stroke="#1a2744" strokeWidth="2"
            />

            {/* Radar background */}
            <circle cx={center} cy={center} r={radarRadius} fill="#0c1320" />

            {/* Grid circles */}
            {gridLevels.map((lvl) => (
                <circle
                    key={lvl}
                    cx={center} cy={center}
                    r={(lvl / 100) * radarRadius}
                    fill="none"
                    stroke="rgba(40,80,120,0.3)"
                    strokeWidth="1"
                />
            ))}

            {/* Divider lines - these are the BOUNDARIES */}
            {areas.map((_, i) => {
                const angle = (i * sectorAngle) - Math.PI / 2;
                const x1 = center + innerRadius * Math.cos(angle);
                const y1 = center + innerRadius * Math.sin(angle);
                const x2 = center + radarRadius * Math.cos(angle);
                const y2 = center + radarRadius * Math.sin(angle);
                return (
                    <line
                        key={`div-${i}`}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="#080c16"
                        strokeWidth={dividerStrokeWidth}
                    />
                );
            })}

            {/* Colored sectors - fit between dividers */}
            {areas.map((_, i) => {
                const score = areaScores[i];
                if (score <= 0) return null;
                return (
                    <path
                        key={`sec-${i}`}
                        d={getSectorPath(i, score)}
                        fill={fillColor}
                        fillOpacity="0.85"
                    />
                );
            })}

            {/* Center circle */}
            <circle
                cx={center} cy={center} r={innerRadius}
                fill="#080c16" stroke="#1a2744" strokeWidth="2"
            />

            {/* Score text */}
            <text
                x={center} y={center}
                textAnchor="middle" dominantBaseline="central"
                fontSize={size * 0.048} fontWeight="700" fill="white"
            >
                {avgScore}
            </text>

            {/* Labels */}
            {showLabels && areas.map((area, i) => (
                <text
                    key={`lbl-${i}`}
                    fontSize="8" fontWeight="600"
                    fill="rgba(255,255,255,0.85)"
                    letterSpacing="0.4"
                >
                    <textPath
                        href={`#labelArc-${i}`}
                        startOffset="50%"
                        textAnchor="middle"
                    >
                        {area.shortLabel || area.label || area.name || ''}
                    </textPath>
                </text>
            ))}
        </svg>
    );
};

export default RadarChart;
