import { JSX } from "solid-js"

export function LineMdLoadingTwotoneLoop(
  props: JSX.SvgSVGAttributes<SVGSVGElement>,
) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2"
      >
        <path
          stroke-dasharray="60"
          stroke-dashoffset="60"
          stroke-opacity=".3"
          d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="1.3s"
            values="60;0"
          ></animate>
        </path>
        <path
          stroke-dasharray="15"
          stroke-dashoffset="15"
          d="M12 3C16.9706 3 21 7.02944 21 12"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.3s"
            values="15;0"
          ></animate>
          <animateTransform
            attributeName="transform"
            dur="1.5s"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 12;360 12 12"
          ></animateTransform>
        </path>
      </g>
    </svg>
  )
}

export function LineMdConfirmCircleTwotone(
  props: JSX.SvgSVGAttributes<SVGSVGElement>,
) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path
          fill="currentColor"
          fill-opacity="0"
          stroke-dasharray="60"
          stroke-dashoffset="60"
          d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.5s"
            values="60;0"
          ></animate>
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="0.8s"
            dur="0.15s"
            values="0;0.3"
          ></animate>
        </path>
        <path
          fill="none"
          stroke-dasharray="14"
          stroke-dashoffset="14"
          d="M8 12L11 15L16 10"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.6s"
            dur="0.2s"
            values="14;0"
          ></animate>
        </path>
      </g>
    </svg>
  )
}
