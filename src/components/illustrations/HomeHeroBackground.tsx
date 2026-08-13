const floatingFolders = [
  { transform: "translate(825 125)", opacity: 0.23, className: "", strokeWidth: 1.3 },
  { transform: "translate(925 575) scale(.75)", opacity: 0.18, className: "home-hero-float-folder-2", strokeWidth: 1.5 },
  { transform: "translate(1450 245) scale(.68)", opacity: 0.22, className: "home-hero-float-folder-3", strokeWidth: 1.6 },
  { transform: "translate(1505 525) scale(.48)", opacity: 0.14, className: "home-hero-float-folder-4", strokeWidth: 1.8 },
  { transform: "translate(765 425) scale(.43)", opacity: 0.13, className: "home-hero-float-folder-5", strokeWidth: 2 },
  { transform: "translate(1375 82) scale(.42)", opacity: 0.15, className: "home-hero-float-folder-6", strokeWidth: 2 },
  { transform: "translate(1550 110) scale(.34)", opacity: 0.12, className: "home-hero-float-folder-7", strokeWidth: 2.2 },
] as const;

export function HomeHeroBackground() {
  return (
    <svg
      className="home-hero-background"
      viewBox="0 0 1600 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient
          id="home-hero-green-glow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(1280 220) rotate(135) scale(640 450)"
        >
          <stop stopColor="#32A84C" stopOpacity=".17" />
          <stop offset=".5" stopColor="#32A84C" stopOpacity=".065" />
          <stop offset="1" stopColor="#32A84C" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id="home-hero-side-tint"
          x1="690"
          y1="350"
          x2="1600"
          y2="350"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset=".4" stopColor="#32A84C" stopOpacity=".025" />
          <stop offset="1" stopColor="#32A84C" stopOpacity=".08" />
        </linearGradient>
        <linearGradient
          id="home-hero-folder-fill"
          x1="1000"
          y1="190"
          x2="1390"
          y2="510"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity=".92" />
          <stop offset="1" stopColor="#E8F6EB" stopOpacity=".6" />
        </linearGradient>
        <linearGradient
          id="home-hero-folder-inner"
          x1="1030"
          y1="260"
          x2="1370"
          y2="485"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#32A84C" stopOpacity=".085" />
          <stop offset="1" stopColor="#32A84C" stopOpacity=".018" />
        </linearGradient>
        <linearGradient id="home-hero-scan-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#32A84C" stopOpacity="0" />
          <stop offset=".5" stopColor="#32A84C" stopOpacity=".13" />
          <stop offset="1" stopColor="#32A84C" stopOpacity="0" />
        </linearGradient>
        <pattern id="home-hero-grid" width="42" height="42" patternUnits="userSpaceOnUse">
          <path d="M42 0H0V42" stroke="#185F28" strokeOpacity=".037" />
        </pattern>
        <pattern id="home-hero-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#32A84C" fillOpacity=".07" />
        </pattern>
        <filter id="home-hero-folder-shadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="18" stdDeviation="28" floodColor="#185F28" floodOpacity=".08" />
        </filter>
        <clipPath id="home-hero-right-clip">
          <rect x="680" width="920" height="700" />
        </clipPath>
      </defs>

      <rect width="1600" height="700" fill="#FCFDFB" />
      <ellipse
        className="home-hero-background-glow"
        cx="1280"
        cy="220"
        rx="590"
        ry="420"
        fill="url(#home-hero-green-glow)"
      />
      <rect x="620" width="980" height="700" fill="url(#home-hero-side-tint)" />

      <g clipPath="url(#home-hero-right-clip)">
        <rect x="760" width="840" height="700" fill="url(#home-hero-grid)" />
        <rect x="880" y="20" width="720" height="660" fill="url(#home-hero-dots)" />
        <path
          d="M760 510C940 390 1100 300 1260 255C1380 220 1500 210 1650 240"
          stroke="#32A84C"
          strokeOpacity=".065"
          strokeWidth="1.2"
        />
        <path
          d="M830 625C1010 505 1165 445 1320 425C1430 410 1530 430 1640 475"
          stroke="#32A84C"
          strokeOpacity=".05"
          strokeWidth="1.2"
        />
        <ellipse
          cx="1300"
          cy="325"
          rx="460"
          ry="205"
          transform="rotate(8 1300 325)"
          stroke="#32A84C"
          strokeOpacity=".045"
        />
        <ellipse
          cx="1300"
          cy="325"
          rx="350"
          ry="135"
          transform="rotate(-14 1300 325)"
          stroke="#185F28"
          strokeOpacity=".04"
        />
        <rect
          className="home-hero-scan-line"
          x="900"
          width="125"
          height="700"
          fill="url(#home-hero-scan-gradient)"
        />
      </g>

      {floatingFolders.map((folder, index) => (
        <g key={folder.transform} transform={folder.transform}>
          <g
            className={`home-hero-float-folder ${folder.className}`}
            opacity={folder.opacity}
          >
            <path
              d="M0 9C0 4 4 0 9 0H29L38 9H62C67 9 71 13 71 18V48C71 53 67 57 62 57H9C4 57 0 53 0 48Z"
              fill="#32A84C"
              fillOpacity=".04"
              stroke="#32A84C"
              strokeWidth={folder.strokeWidth}
            />
            <path
              d="M1 21H70"
              stroke="#32A84C"
              strokeOpacity={index === 0 ? 0.35 : 0.4}
            />
          </g>
        </g>
      ))}

      <path
        className="home-hero-branch"
        d="M850 590C925 555 965 510 1015 465C1060 425 1095 405 1140 390C1205 367 1245 325 1265 275C1290 215 1340 180 1420 150"
        stroke="#32A84C"
        strokeOpacity=".28"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        className="home-hero-branch-secondary"
        d="M1015 465C1080 505 1145 535 1220 525C1300 515 1365 470 1435 420"
        stroke="#32A84C"
        strokeOpacity=".15"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {[
        { cx: 850, cy: 590, r: 5 },
        { cx: 1015, cy: 465, r: 5 },
        { cx: 1420, cy: 150, r: 5 },
        { cx: 1435, cy: 420, r: 4 },
      ].map((node, index) => (
        <circle
          key={`${node.cx}-${node.cy}`}
          className={`home-hero-node home-hero-node-${index + 1}`}
          {...node}
          fill="#FCFDFB"
          stroke="#32A84C"
          strokeWidth={index === 3 ? 1.7 : 2}
        />
      ))}

      <g className="home-hero-main-folder" filter="url(#home-hero-folder-shadow)">
        <path
          className="home-hero-folder-tab"
          d="M1025 215C1025 202 1035 192 1048 192H1145L1178 224H1358C1375 224 1388 237 1388 254V470C1388 488 1374 502 1356 502H1048C1030 502 1016 488 1016 470V239C1016 227 1019 219 1025 215Z"
          fill="#32A84C"
          fillOpacity=".055"
          stroke="#32A84C"
          strokeOpacity=".24"
          strokeWidth="1.3"
        />
        <path
          d="M1016 280C1016 262 1030 248 1048 248H1355C1373 248 1388 262 1388 280V470C1388 488 1374 502 1356 502H1048C1030 502 1016 488 1016 470Z"
          fill="url(#home-hero-folder-fill)"
          stroke="#185F28"
          strokeOpacity=".13"
          strokeWidth="1.2"
        />
        <rect x="1038" y="270" width="328" height="208" rx="16" fill="url(#home-hero-folder-inner)" />
        <circle cx="1060" cy="298" r="4" fill="#32A84C" fillOpacity=".65" />
        <circle cx="1077" cy="298" r="4" fill="#32A84C" fillOpacity=".32" />
        <circle cx="1094" cy="298" r="4" fill="#32A84C" fillOpacity=".17" />
        <path d="M1038 320H1366" stroke="#185F28" strokeOpacity=".08" />

        <g transform="translate(1050 348)">
          <path
            d="M0 8C0 3.5 3.5 0 8 0H36L47 11H82C87 11 90 14 90 19V58C90 63 87 66 82 66H8C3.5 66 0 62.5 0 58Z"
            fill="#32A84C"
            fillOpacity=".075"
            stroke="#32A84C"
            strokeOpacity=".55"
            strokeWidth="1.5"
          />
          <path d="M1 24H89" stroke="#32A84C" strokeOpacity=".22" />
          <path d="M17 35H42" stroke="#32A84C" strokeOpacity=".35" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M17 44H65" stroke="#32A84C" strokeOpacity=".2" strokeWidth="2" strokeLinecap="round" />
        </g>

        <g stroke="#185F28" strokeLinecap="round">
          <path className="home-hero-code-line" d="M1165 358H1328" strokeWidth="5" />
          <path className="home-hero-code-line home-hero-code-line-2" d="M1165 383H1288" strokeWidth="5" />
          <path className="home-hero-code-line home-hero-code-line-3" d="M1050 438H1325" strokeWidth="4" />
          <path className="home-hero-code-line home-hero-code-line-4" d="M1050 458H1260" strokeWidth="4" />
        </g>
        <circle cx="1335" cy="438" r="3" fill="#32A84C" fillOpacity=".45" />
        <circle cx="1273" cy="458" r="3" fill="#32A84C" fillOpacity=".25" />
      </g>

      <g
        stroke="#32A84C"
        strokeOpacity=".2"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1460 332L1447 343L1460 354" />
        <path d="M1475 332L1488 343L1475 354" />
        <path d="M1505 317L1490 369" />
      </g>
      <path
        d="M-80 650C180 630 330 535 430 390C515 265 600 160 770 55"
        stroke="#32A84C"
        strokeOpacity=".04"
        strokeWidth="1.2"
        strokeDasharray="2 10"
      />
    </svg>
  );
}
