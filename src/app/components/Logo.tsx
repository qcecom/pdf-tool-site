export default function Logo({size=28}:{size?:number}){
  return(<svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="nouploadpdf.com">
    <path fill="currentColor" d="M4 3h10l5 5v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5"/>
    <path fill="currentColor" d="M10.5 12H8l3.5-6v4H16L12.5 16v-4z"/>
  </svg>);
}
